import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertNewsSchema, 
  insertCompetitionSchema, 
  insertContactSchema, 
  insertNewsletterSchema,
  insertPendingUserSchema
} from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

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
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Public routes
  app.get("/api/news", async (req, res) => {
    try {
      const allNews = await storage.getAllNews();
      res.json(allNews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  });

  app.get("/api/news/:slug", async (req, res) => {
    try {
      const article = await storage.getNewsBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  app.get("/api/competitions", async (req, res) => {
    try {
      const competitions = await storage.getAllCompetitions();
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching competitions" });
    }
  });

  app.get("/api/memberships", async (req, res) => {
    try {
      const memberships = await storage.getAllMemberships();
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ message: "Error fetching memberships" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json({ message: "Message sent successfully", contact });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.createNewsletterSubscription(newsletterData);
      res.status(201).json({ message: "Newsletter subscription successful", subscription });
    } catch (error) {
      res.status(400).json({ message: "Invalid email or already subscribed" });
    }
  });

  // User registration route (public but creates pending user)
  app.post("/api/register-pending", async (req, res) => {
    try {
      const userData = insertPendingUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      const existingPending = await storage.getPendingUserByEmail(userData.email);
      
      if (existingUser || existingPending) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const pendingUser = await storage.createPendingUser(userData);
      res.status(201).json({ 
        message: "Registration request submitted. Awaiting admin approval.",
        pendingUser: { id: pendingUser.id, email: pendingUser.email }
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  // Protected routes (require authentication)
  app.get("/api/user/profile", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userProfile } = user;
    res.json(userProfile);
  });

  app.put("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const updatedUser = await storage.updateUser(req.user.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userProfile } = updatedUser;
      res.json(userProfile);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      const { membershipId } = req.body;
      const membership = await storage.getMembership(membershipId);
      
      if (!membership) {
        return res.status(404).json({ message: "Membership not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: membership.costo * 100, // Convert to cents
        currency: "eur",
        metadata: {
          userId: req.user.id.toString(),
          membershipId: membershipId.toString(),
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/confirm-payment", requireAuth, async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        const userId = parseInt(paymentIntent.metadata.userId);
        const membershipId = parseInt(paymentIntent.metadata.membershipId);
        const membership = await storage.getMembership(membershipId);
        
        if (membership) {
          const purchase = await storage.createMembershipPurchase({
            userId,
            membershipId,
            amount: membership.costo,
            paymentIntentId,
            status: "pagato",
            emailSent: false,
          });
          
          res.json({ success: true, purchase });
        }
      } else {
        res.status(400).json({ message: "Payment not completed" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  app.get("/api/admin/pending-users", requireAdmin, async (req, res) => {
    try {
      const pendingUsers = await storage.getAllPendingUsers();
      res.json(pendingUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending users" });
    }
  });

  app.post("/api/admin/approve-user/:id", requireAdmin, async (req, res) => {
    try {
      const pendingUserId = parseInt(req.params.id);
      const approvedUser = await storage.approvePendingUser(pendingUserId);
      if (!approvedUser) {
        return res.status(404).json({ message: "Pending user not found" });
      }
      res.json({ message: "User approved successfully", user: approvedUser });
    } catch (error) {
      res.status(500).json({ message: "Error approving user" });
    }
  });

  app.delete("/api/admin/reject-user/:id", requireAdmin, async (req, res) => {
    try {
      const pendingUserId = parseInt(req.params.id);
      const rejected = await storage.rejectPendingUser(pendingUserId);
      if (!rejected) {
        return res.status(404).json({ message: "Pending user not found" });
      }
      res.json({ message: "User registration rejected" });
    } catch (error) {
      res.status(500).json({ message: "Error rejecting user" });
    }
  });

  app.get("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const allNews = await storage.getAllNews();
      res.json(allNews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  });

  app.post("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse({
        ...req.body,
        autore: req.user.nome + " " + req.user.cognome,
      });
      const article = await storage.createNews(newsData);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid news data" });
    }
  });

  app.put("/api/admin/news/:slug", requireAdmin, async (req, res) => {
    try {
      const updates = req.body;
      const updatedArticle = await storage.updateNews(req.params.slug, updates);
      if (!updatedArticle) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(updatedArticle);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/admin/news/:slug", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteNews(req.params.slug);
      if (!deleted) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting article" });
    }
  });

  app.post("/api/admin/competitions", requireAdmin, async (req, res) => {
    try {
      const competitionData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.createCompetition(competitionData);
      res.status(201).json(competition);
    } catch (error) {
      res.status(400).json({ message: "Invalid competition data" });
    }
  });

  app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contacts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
