import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs/promises";
import path from "path";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, insertNewsSchema, insertCompetitionSchema } from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set - payment functionality will not work');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
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

  app.get("/api/magazines", async (_req, res) => {
    try {
      const assetsDir = path.resolve(process.cwd(), "attached_assets", "Magazine");
      const fileNames = await fs.readdir(assetsDir);

      const monthMap: Record<string, string> = {
        gennaio: "01",
        febbraio: "02",
        marzo: "03",
        aprile: "04",
        maggio: "05",
        giugno: "06",
        luglio: "07",
        agosto: "08",
        settembre: "09",
        ottobre: "10",
        novembre: "11",
        dicembre: "12",
      };

      const parsed = fileNames
        .filter((fileName) => fileName.toLowerCase().endsWith(".pdf"))
        .map((fileName) => {
          const lower = fileName.toLowerCase();
          const normalized = lower.replace(/[_.-]+/g, " ");

          let magazine: "Caccia e Natura" | "Il Beccaccino" | null = null;

          const isBeccaccino =
            normalized.includes("beccaccino") ||
            normalized.includes("foglio notizie") ||
            /^enalcaccia-n\d+-anno\d{4}-rivista\.pdf$/.test(lower);

          const isCacciaENatura =
            normalized.includes("caccia e natura") ||
            /^37310-caccia-e-natura/.test(lower) ||
            /^rivista-caccia-e-natura/.test(lower);

          if (isBeccaccino) {
            magazine = "Il Beccaccino";
          } else if (isCacciaENatura) {
            magazine = "Caccia e Natura";
          }

          if (!magazine) return null;

          const yearMatch = lower.match(/20\d{2}/);
          const monthNumMatch = lower.match(/(?:^|[^0-9])(0[1-9]|1[0-2])(?:[^0-9]|$)/);
          const monthNameEntry = Object.entries(monthMap).find(([name]) => lower.includes(name));

          const year = yearMatch?.[0];
          const month = monthNumMatch?.[1] ?? monthNameEntry?.[1];
          const monthLabel = year && month ? `${month}/${year}` : year ? `Anno ${year}` : "Edizione corrente";

          const issueNumberMatch = lower.match(/(?:n\.?|numero)[-_ ]?(\d{1,2})/);
          const issueNumber = issueNumberMatch ? `n. ${issueNumberMatch[1]}` : "";
          const displayLabel = issueNumber ? `${issueNumber} - ${monthLabel}` : monthLabel;

          return {
            id: fileName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
            magazine,
            monthLabel: displayLabel,
            file: `/attached_assets/Magazine/${encodeURIComponent(fileName)}`,
            cover:
              magazine === "Caccia e Natura"
                ? "/attached_assets/enalcaccia-associazione-venatoria.png"
                : "/attached_assets/enalcaccia-cinofilia.jpg",
            note: "Numero mensile digitale in formato PDF.",
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      if (parsed.length > 0) {
        return res.json(parsed);
      }

      return res.json([
        {
          id: "caccia-e-natura-edizione-corrente",
          magazine: "Caccia e Natura",
          monthLabel: "Edizione corrente",
          file: "/attached_assets/tessera nazionale Enalcaccia _1751923500470.pdf",
          cover: "/attached_assets/enalcaccia-associazione-venatoria.png",
          note: "Numero mensile digitale in formato PDF.",
        },
        {
          id: "il-beccaccino-edizione-corrente",
          magazine: "Il Beccaccino",
          monthLabel: "Edizione corrente",
          file: "/attached_assets/Locandina 18-04-26.pdf",
          cover: "/attached_assets/enalcaccia-cinofilia.jpg",
          note: "Numero mensile digitale in formato PDF.",
        },
      ]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch magazines" });
    }
  });

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
        const authUser = req.user!;
        const { membershipId } = req.body;
        const membership = await storage.getMembership(membershipId);
        
        if (!membership) {
          return res.status(404).json({ message: "Membership not found" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: membership.price,
          currency: "eur",
          metadata: {
            userId: authUser.id.toString(),
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
      const authUser = req.user!;
      const memberships = await storage.getUserMemberships(authUser.id);
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user memberships" });
    }
  });

  app.get("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const authUser = req.user!;
      const user = await storage.getUser(authUser.id);
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
      const unapprovedUsers = users.filter((u) => !u.approved);
      
      const stats = {
        approvedUsers: users.filter(u => u.approved).length,
        pendingUsers: pendingUsers.length + unapprovedUsers.length,
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
      const users = await storage.getAllUsers();
      const unapprovedUsers = users
        .filter((user) => !user.approved)
        .map((user) => ({
          id: user.id,
          firstName: user.nome,
          lastName: user.cognome,
          email: user.email,
          phone: null,
          address: null,
          city: null,
          zipCode: null,
          dateOfBirth: user.dataNascita,
          placeOfBirth: user.luogoNascita,
          fiscalCode: user.codiceFiscale,
          membershipType: "base",
          notes: "Registrazione web in attesa di approvazione",
          pdfExtracted: false,
          createdAt: user.createdAt,
        }));

      res.json([...pendingUsers, ...unapprovedUsers]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending users" });
    }
  });

  app.post("/api/admin/approve-user/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const pendingUser = await storage.getPendingUser(userId);
      if (!pendingUser) {
        const users = await storage.getAllUsers();
        const unapprovedUser = users.find((user) => user.id === userId && !user.approved);
        if (!unapprovedUser) {
          return res.status(404).json({ message: "Pending user not found" });
        }

        const approvedUser = await storage.updateUser(unapprovedUser.id, {
          approved: true,
          approvedAt: new Date(),
        });

        return res.json({ message: "User approved successfully", user: approvedUser });
      }

      // Move to approved users
      const { id, createdAt, ...userData } = pendingUser;
      const approvedUser = await storage.createUser({
        nome: userData.firstName,
        cognome: userData.lastName,
        dataNascita: userData.dateOfBirth || "",
        luogoNascita: userData.placeOfBirth || "",
        codiceFiscale: userData.fiscalCode || `${Date.now()}-${id}`,
        numeroLicenza: "DA_VERIFICARE",
        email: userData.email,
        password: "pending-approval-migrated",
        role: "utente",
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
      const userId = parseInt(req.params.id);
      const deletedPending = await storage.deletePendingUser(userId);
      if (deletedPending) {
        return res.json({ message: "User registration rejected" });
      }

      const deletedUser = await storage.deleteUser(userId);
      if (!deletedUser) {
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
