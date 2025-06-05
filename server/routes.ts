import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, insertPendingUserSchema, insertNewsSchema, insertCompetitionSchema } from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Public routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/news/:slug", async (req, res) => {
    try {
      const article = await storage.getNewsBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/competitions", async (req, res) => {
    try {
      const competitions = await storage.getAllCompetitions();
      res.json(competitions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/memberships", async (req, res) => {
    try {
      const memberships = await storage.getAllMemberships();
      res.json(memberships);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeToNewsletter(validatedData);
      res.status(201).json(subscription);
    } catch (error: any) {
      if (error.message === "Email already subscribed") {
        return res.status(400).json({ message: "Email already subscribed to newsletter" });
      }
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/register-pending", async (req, res) => {
    try {
      const validatedData = insertPendingUserSchema.parse(req.body);
      
      // Check if email already exists in users or pending users
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const pendingUsers = await storage.getPendingUsers();
      const existingPending = pendingUsers.find(u => u.email === validatedData.email);
      if (existingPending) {
        return res.status(400).json({ message: "Registration already pending approval" });
      }

      const pendingUser = await storage.createPendingUser(validatedData);
      res.status(201).json({ message: "Registration submitted for approval", id: pendingUser.id });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Protected routes (require authentication)
  app.get("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  app.get("/api/user/memberships", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      const purchases = await storage.getMembershipPurchasesByUser(req.user.id);
      res.json(purchases);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { membershipId } = req.body;
      const membership = await storage.getMembership(membershipId);
      
      if (!membership) {
        return res.status(404).json({ message: "Membership not found" });
      }

      const amount = Math.round(parseFloat(membership.price) * 100); // Convert to cents

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "eur",
        metadata: {
          userId: req.user.id.toString(),
          membershipId: membershipId.toString(),
        },
      });

      // Store the purchase intent
      await storage.createMembershipPurchase({
        userId: req.user.id,
        membershipId,
        amount: membership.price,
        paymentIntentId: paymentIntent.id,
        status: "pending",
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Admin routes (require admin role)
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getUser(0); // This will get all users in a real implementation
      const pendingUsers = await storage.getPendingUsers();
      const contacts = await storage.getAllContacts();
      const memberships = await storage.getAllMemberships();

      res.json({
        approvedUsers: 1, // Placeholder - would count actual users
        pendingUsers: pendingUsers.length,
        totalContacts: contacts.length,
        totalMemberships: memberships.length,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/pending-users", requireAdmin, async (req, res) => {
    try {
      const pendingUsers = await storage.getPendingUsers();
      res.json(pendingUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/approve-user/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.approvePendingUser(userId);
      res.json({ message: "User approved successfully", user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/reject-user/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const deleted = await storage.deletePendingUser(userId);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User registration rejected" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const article = await storage.createNews(validatedData);
      res.status(201).json(article);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/news/:slug", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const article = await storage.updateNews(req.params.slug, validatedData);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/news/:slug", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteNews(req.params.slug);
      if (!deleted) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ message: "Article deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/competitions", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.createCompetition(validatedData);
      res.status(201).json(competition);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/competitions/:id", requireAdmin, async (req, res) => {
    try {
      const competitionId = parseInt(req.params.id);
      const validatedData = insertCompetitionSchema.partial().parse(req.body);
      const competition = await storage.updateCompetition(competitionId, validatedData);
      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }
      res.json(competition);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/competitions/:id", requireAdmin, async (req, res) => {
    try {
      const competitionId = parseInt(req.params.id);
      const deleted = await storage.deleteCompetition(competitionId);
      if (!deleted) {
        return res.status(404).json({ message: "Competition not found" });
      }
      res.json({ message: "Competition deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
