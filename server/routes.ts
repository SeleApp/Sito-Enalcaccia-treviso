import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, insertMembershipSchema, insertNewsSchema, insertCompetitionSchema } from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Public routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news.filter(article => article.published));
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
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

  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      await storage.createContact(contactData);
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      await storage.subscribeNewsletter(newsletterData.email);
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(400).json({ message: "Error subscribing to newsletter" });
    }
  });

  // Protected routes
  app.get("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.user);
  });

  app.put("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const updatedUser = await storage.updateUser(req.user!.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: "Error updating profile" });
    }
  });

  // Membership routes
  app.get("/api/membership-types", (req, res) => {
    const membershipTypes = [
      {
        id: "base",
        name: "Tessera Base",
        description: "Ideale per cacciatori occasionali",
        price: 85,
        features: [
          "Licenza di caccia valida",
          "Accesso alle riserve convenzionate",
          "Newsletter mensile",
        ]
      },
      {
        id: "premium",
        name: "Tessera Premium",
        description: "Per cacciatori esperti e appassionati",
        price: 150,
        features: [
          "Tutti i vantaggi della tessera base",
          "Partecipazione gare cinofile",
          "Sconti presso armerie convenzionate",
          "Corsi di formazione gratuiti",
        ]
      },
      {
        id: "elite",
        name: "Tessera Elite",
        description: "Massimo livello di servizi",
        price: 250,
        features: [
          "Tutti i vantaggi Premium",
          "Accesso esclusivo riserve premium",
          "Consulenza personalizzata",
          "Eventi esclusivi",
        ]
      }
    ];
    res.json(membershipTypes);
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { membershipType, amount } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: "eur",
        metadata: {
          userId: req.user!.id.toString(),
          membershipType,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/membership/confirm", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { paymentIntentId, membershipType, amount } = req.body;
      
      const membershipData = insertMembershipSchema.parse({
        userId: req.user!.id,
        membershipType,
        amount,
        stripePaymentIntentId: paymentIntentId,
        status: "completed",
      });

      await storage.createMembership(membershipData);
      res.json({ message: "Membership created successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error creating membership" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  app.get("/api/admin/pending-users", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const pendingUsers = await storage.getAllPendingUsers();
      res.json(pendingUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending users" });
    }
  });

  app.post("/api/admin/approve-user/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      await storage.approvePendingUser(parseInt(req.params.id));
      res.json({ message: "User approved successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error approving user" });
    }
  });

  app.delete("/api/admin/pending-users/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      await storage.deletePendingUser(parseInt(req.params.id));
      res.json({ message: "Pending user deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting pending user" });
    }
  });

  // Admin news management
  app.get("/api/admin/news", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news" });
    }
  });

  app.post("/api/admin/news", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const newsData = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(newsData);
      res.json(news);
    } catch (error) {
      res.status(400).json({ message: "Error creating news article" });
    }
  });

  app.put("/api/admin/news/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const newsData = insertNewsSchema.parse(req.body);
      const news = await storage.updateNews(parseInt(req.params.id), newsData);
      res.json(news);
    } catch (error) {
      res.status(400).json({ message: "Error updating news article" });
    }
  });

  app.delete("/api/admin/news/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      await storage.deleteNews(parseInt(req.params.id));
      res.json({ message: "News article deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting news article" });
    }
  });

  // Admin competitions management
  app.get("/api/admin/competitions", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const competitions = await storage.getAllCompetitions();
      res.json(competitions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching competitions" });
    }
  });

  app.post("/api/admin/competitions", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const competitionData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.createCompetition(competitionData);
      res.json(competition);
    } catch (error) {
      res.status(400).json({ message: "Error creating competition" });
    }
  });

  app.put("/api/admin/competitions/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const competitionData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.updateCompetition(parseInt(req.params.id), competitionData);
      res.json(competition);
    } catch (error) {
      res.status(400).json({ message: "Error updating competition" });
    }
  });

  app.delete("/api/admin/competitions/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      await storage.deleteCompetition(parseInt(req.params.id));
      res.json({ message: "Competition deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting competition" });
    }
  });

  // Admin contacts management
  app.get("/api/admin/contacts", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contacts" });
    }
  });

  app.put("/api/admin/contacts/:id/respond", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      await storage.markContactResponded(parseInt(req.params.id));
      res.json({ message: "Contact marked as responded" });
    } catch (error) {
      res.status(400).json({ message: "Error updating contact" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
