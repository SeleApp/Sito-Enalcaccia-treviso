import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertContactSchema, insertNewsletterSchema, insertPendingUserSchema, insertNewsSchema, insertCompetitionSchema } from "@shared/schema";
import Stripe from "stripe";

// Initialize Stripe only if secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Middleware to check if user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Middleware to check if user is admin
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Public routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      const publishedNews = news.filter(item => item.published);
      res.json(publishedNews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  });

  app.get("/api/news/:slug", async (req, res) => {
    try {
      const news = await storage.getNewsBySlug(req.params.slug);
      if (!news || !news.published) {
        return res.status(404).json({ message: "News article not found" });
      }
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news article" });
    }
  });

  app.get("/api/competitions", async (req, res) => {
    try {
      const competitions = await storage.getCompetitions();
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching competitions" });
    }
  });

  app.get("/api/competitions/:id", async (req, res) => {
    try {
      const competition = await storage.getCompetition(parseInt(req.params.id));
      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }
      res.json(competition);
    } catch (error) {
      res.status(500).json({ message: "Error fetching competition" });
    }
  });

  app.get("/api/memberships", async (req, res) => {
    try {
      const memberships = await storage.getMemberships();
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ message: "Error fetching memberships" });
    }
  });

  // Contact form
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json({ message: "Message sent successfully", id: contact.id });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data", error });
    }
  });

  // Newsletter signup
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getNewsletterSubscribers();
      if (existing.find(sub => sub.email === validatedData.email)) {
        return res.status(400).json({ message: "Email already subscribed" });
      }
      
      await storage.addNewsletterSubscriber(validatedData);
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(400).json({ message: "Invalid email", error });
    }
  });

  // User registration (pending approval)
  app.post("/api/auth/register-pending", async (req, res) => {
    try {
      const validatedData = insertPendingUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(validatedData.username) || 
                          await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
      }

      // Check pending users too
      const pendingUsers = await storage.getPendingUsers();
      if (pendingUsers.find(u => u.username === validatedData.username || u.email === validatedData.email)) {
        return res.status(400).json({ message: "Registration already pending for this username or email" });
      }

      const pendingUser = await storage.createPendingUser(validatedData);
      res.status(201).json({ 
        message: "Registration submitted successfully. Please wait for admin approval.",
        id: pendingUser.id 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid registration data", error });
    }
  });

  // Protected routes - User dashboard
  app.get("/api/user/profile", requireAuth, (req: any, res) => {
    res.json(req.user);
  });

  // Stripe payment intent for membership
  app.post("/api/create-payment-intent", requireAuth, async (req: any, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Payment system not configured" });
    }

    try {
      const { membershipId } = req.body;
      const membership = await storage.getMembership(parseInt(membershipId));
      
      if (!membership) {
        return res.status(404).json({ message: "Membership not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(membership.price) * 100), // Convert to cents
        currency: "eur",
        metadata: {
          userId: req.user.id.toString(),
          membershipId: membershipId,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Stripe webhook
  app.post("/api/webhook/stripe", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Payment system not configured" });
    }

    try {
      const event = req.body;

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const { userId, membershipId } = paymentIntent.metadata;

        const membership = await storage.getMembership(parseInt(membershipId));
        if (membership) {
          await storage.createMembershipPurchase({
            userId: parseInt(userId),
            membershipId: parseInt(membershipId),
            amount: membership.price,
            paymentIntentId: paymentIntent.id,
            status: "completed",
            emailSent: false,
          });
        }
      }

      res.json({ received: true });
    } catch (error) {
      res.status(500).json({ message: "Webhook error" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const pendingUsers = await storage.getPendingUsers();
      const purchases = await storage.getMembershipPurchases();
      const contacts = await storage.getContacts();

      const stats = {
        approvedUsers: users.filter((u: any) => u.approved).length,
        pendingUsers: pendingUsers.length,
        totalMemberships: purchases.length,
        contactMessages: contacts.length,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  app.get("/api/admin/pending-users", requireAdmin, async (req, res) => {
    try {
      const pendingUsers = await storage.getPendingUsers();
      res.json(pendingUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending users" });
    }
  });

  app.post("/api/admin/approve-user/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.approvePendingUser(parseInt(req.params.id));
      res.json({ message: "User approved successfully", user });
    } catch (error) {
      res.status(404).json({ message: "Pending user not found" });
    }
  });

  app.delete("/api/admin/reject-user/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deletePendingUser(parseInt(req.params.id));
      res.json({ message: "User registration rejected" });
    } catch (error) {
      res.status(404).json({ message: "Pending user not found" });
    }
  });

  // Admin news management
  app.get("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  });

  app.post("/api/admin/news", requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertNewsSchema.parse({
        ...req.body,
        authorId: req.user.id,
      });
      const news = await storage.createNews(validatedData);
      res.status(201).json(news);
    } catch (error) {
      res.status(400).json({ message: "Invalid news data", error });
    }
  });

  app.put("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const news = await storage.updateNews(parseInt(req.params.id), validatedData);
      res.json(news);
    } catch (error) {
      res.status(400).json({ message: "Error updating news" });
    }
  });

  app.delete("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteNews(parseInt(req.params.id));
      res.json({ message: "News deleted successfully" });
    } catch (error) {
      res.status(404).json({ message: "News not found" });
    }
  });

  // Admin competition management
  app.get("/api/admin/competitions", requireAdmin, async (req, res) => {
    try {
      const competitions = await storage.getCompetitions();
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching competitions" });
    }
  });

  app.post("/api/admin/competitions", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.createCompetition(validatedData);
      res.status(201).json(competition);
    } catch (error) {
      res.status(400).json({ message: "Invalid competition data", error });
    }
  });

  app.put("/api/admin/competitions/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.updateCompetition(parseInt(req.params.id), validatedData);
      res.json(competition);
    } catch (error) {
      res.status(400).json({ message: "Error updating competition" });
    }
  });

  app.delete("/api/admin/competitions/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteCompetition(parseInt(req.params.id));
      res.json({ message: "Competition deleted successfully" });
    } catch (error) {
      res.status(404).json({ message: "Competition not found" });
    }
  });

  // Admin contacts
  app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contacts" });
    }
  });

  app.put("/api/admin/contacts/:id/reply", requireAdmin, async (req, res) => {
    try {
      const contact = await storage.markContactReplied(parseInt(req.params.id));
      res.json(contact);
    } catch (error) {
      res.status(404).json({ message: "Contact not found" });
    }
  });

  // Admin membership purchases
  app.get("/api/admin/membership-purchases", requireAdmin, async (req, res) => {
    try {
      const purchases = await storage.getMembershipPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Error fetching membership purchases" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
