import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  cognome: text("cognome").notNull(),
  dataNascita: text("data_nascita").notNull(),
  luogoNascita: text("luogo_nascita").notNull(),
  codiceFiscale: text("codice_fiscale").notNull().unique(),
  numeroLicenza: text("numero_licenza").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("utente"),
  approved: boolean("approved").default(false),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pendingUsers = pgTable("pending_users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  zipCode: text("zip_code"),
  dateOfBirth: text("date_of_birth"),
  placeOfBirth: text("place_of_birth"),
  fiscalCode: text("fiscal_code"),
  membershipType: text("membership_type").default("base"),
  notes: text("notes"),
  pdfExtracted: boolean("pdf_extracted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  featuredImage: text("featured_image"),
  category: text("category").notNull(),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const competitions = pgTable("competitions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discipline: text("discipline").notNull(),
  location: text("location").notNull(),
  eventDate: timestamp("event_date").notNull(),
  cost: integer("cost").notNull(),
  bandoUrl: text("bando_url"),
  maxParticipants: integer("max_participants"),
  registeredParticipants: integer("registered_participants").default(0),
  registrationDeadline: timestamp("registration_deadline").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const memberships = pgTable("memberships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  features: json("features").$type<string[]>().notNull(),
  maxMembers: integer("max_members"),
  currentMembers: integer("current_members").default(0),
  active: boolean("active").default(true),
});

export const userMemberships = pgTable("user_memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  membershipId: integer("membership_id").references(() => memberships.id).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, cancelled
  amount: integer("amount").notNull(),
  paidAt: timestamp("paid_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  replied: boolean("replied").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  approved: true,
  approvedAt: true,
}).extend({
  passwordConfirm: z.string().min(8),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Le password non corrispondono",
  path: ["passwordConfirm"],
});

export const insertPendingUserSchema = createInsertSchema(pendingUsers).omit({
  id: true,
  createdAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompetitionSchema = createInsertSchema(competitions).omit({
  id: true,
  createdAt: true,
  registeredParticipants: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  replied: true,
});

export const insertNewsletterSchema = createInsertSchema(newsletter).omit({
  id: true,
  subscribedAt: true,
});

// Select types
export type User = typeof users.$inferSelect;
export type PendingUser = typeof pendingUsers.$inferSelect;
export type News = typeof news.$inferSelect;
export type Competition = typeof competitions.$inferSelect;
export type Membership = typeof memberships.$inferSelect;
export type UserMembership = typeof userMemberships.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Newsletter = typeof newsletter.$inferSelect;

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPendingUser = z.infer<typeof insertPendingUserSchema>;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
