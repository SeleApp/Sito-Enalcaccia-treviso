import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, insertNewsSchema, insertCompetitionSchema } from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set - payment functionality will not work');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Public routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      const publicNews = news.filter(article => article.published);
      res.json(publicNews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get("/api/news/:slug", async (req, res) => {
    try {
      const article = await storage.getNewsBySlug(req.params.slug);
      if (!article || !article.published) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.get("/api/competitions", async (req, res) => {
    try {
      const competitions = await storage.getAllCompetitions();
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitions" });
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
      res.status(500).json({ message: "Failed to fetch competition" });
    }
  });

  app.get("/api/memberships", async (req, res) => {
    try {
      const memberships = await storage.getAllMemberships();
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch memberships" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json({ message: "Messaggio inviato con successo", contact });
    } catch (error: any) {
      res.status(400).json({ message: "Errore nell'invio del messaggio", error: error.message });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      
      // Check if already subscribed
      const existing = await storage.getNewsletterSubscriber(validatedData.email);
      if (existing) {
        return res.status(400).json({ message: "Email già iscritta alla newsletter" });
      }
      
      const subscriber = await storage.createNewsletterSubscriber(validatedData);
      res.status(201).json({ message: "Iscrizione alla newsletter completata", subscriber });
    } catch (error: any) {
      res.status(400).json({ message: "Errore nell'iscrizione", error: error.message });
    }
  });

  // Payment routes
  if (stripe) {
    app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
      try {
        const { membershipId } = req.body;
        const membership = await storage.getMembership(membershipId);
        
        if (!membership) {
          return res.status(404).json({ message: "Membership not found" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: membership.price,
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
          const { userId, membershipId } = paymentIntent.metadata;
          
          // Create user membership record
          const expiresAt = new Date();
          expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year membership
          
          await storage.createUserMembership({
            userId: parseInt(userId),
            membershipId: parseInt(membershipId),
            stripePaymentIntentId: paymentIntentId,
            status: 'paid',
            amount: paymentIntent.amount,
            paidAt: new Date(),
            expiresAt,
          });

          res.json({ message: "Payment confirmed successfully" });
        } else {
          res.status(400).json({ message: "Payment not successful" });
        }
      } catch (error: any) {
        res.status(500).json({ message: "Error confirming payment: " + error.message });
      }
    });
  }

  // Protected user routes
  app.get("/api/user/memberships", requireAuth, async (req, res) => {
    try {
      const memberships = await storage.getUserMemberships(req.user.id);
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user memberships" });
    }
  });

  app.get("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Remove password from response
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const pendingUsers = await storage.getAllPendingUsers();
      const contacts = await storage.getAllContacts();
      const memberships = await storage.getAllMemberships();
      
      const stats = {
        approvedUsers: users.filter(u => u.approved).length,
        pendingUsers: pendingUsers.length,
        totalContacts: contacts.length,
        totalMemberships: memberships.length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/pending-users", requireAdmin, async (req, res) => {
    try {
      const pendingUsers = await storage.getAllPendingUsers();
      res.json(pendingUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending users" });
    }
  });

  app.post("/api/admin/approve-user/:id", requireAdmin, async (req, res) => {
    try {
      const pendingUser = await storage.getPendingUser(parseInt(req.params.id));
      if (!pendingUser) {
        return res.status(404).json({ message: "Pending user not found" });
      }

      // Move to approved users
      const { id, createdAt, ...userData } = pendingUser;
      const approvedUser = await storage.createUser({
        ...userData,
        approved: true,
        approvedAt: new Date(),
      });

      // Remove from pending
      await storage.deletePendingUser(pendingUser.id);

      res.json({ message: "User approved successfully", user: approvedUser });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve user" });
    }
  });

  app.delete("/api/admin/reject-user/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deletePendingUser(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Pending user not found" });
      }
      res.json({ message: "User registration rejected" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reject user" });
    }
  });

  app.get("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.post("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const article = await storage.createNews(validatedData);
      res.status(201).json(article);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to create article", error: error.message });
    }
  });

  app.put("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try {
      const article = await storage.updateNews(parseInt(req.params.id), req.body);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteNews(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  app.get("/api/admin/competitions", requireAdmin, async (req, res) => {
    try {
      const competitions = await storage.getAllCompetitions();
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitions" });
    }
  });

  app.post("/api/admin/competitions", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.createCompetition(validatedData);
      res.status(201).json(competition);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to create competition", error: error.message });
    }
  });

  app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
