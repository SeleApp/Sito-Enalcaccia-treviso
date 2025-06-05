import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
  nome: text("nome").notNull(),
  cognome: text("cognome").notNull(),
  dataNascita: text("data_nascita").notNull(),
  luogoNascita: text("luogo_nascita").notNull(),
  codiceFiscale: text("codice_fiscale").notNull().unique(),
  numeroLicenza: text("numero_licenza").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  titolo: text("titolo").notNull(),
  slug: text("slug").notNull().unique(),
  contenuto: text("contenuto").notNull(),
  data: timestamp("data").defaultNow(),
  autore: text("autore").notNull(),
  categoria: text("categoria").notNull().default("generale"),
  pubblicato: boolean("pubblicato").default(true),
});

export const competitions = pgTable("competitions", {
  id: serial("id").primaryKey(),
  titolo: text("titolo").notNull(),
  dataEvento: timestamp("data_evento").notNull(),
  luogo: text("luogo").notNull(),
  disciplina: text("disciplina").notNull(),
  costo: integer("costo").notNull(),
  bandoUrl: text("bando_url"),
  descrizione: text("descrizione"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const memberships = pgTable("memberships", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  descrizione: text("descrizione").notNull(),
  costo: integer("costo").notNull(),
  vantaggi: text("vantaggi").array(),
  attivo: boolean("attivo").default(true),
});

export const membershipPurchases = pgTable("membership_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  membershipId: integer("membership_id").references(() => memberships.id),
  amount: integer("amount").notNull(),
  paymentIntentId: text("payment_intent_id"),
  status: text("status").notNull().default("in_attesa"),
  timestamp: timestamp("timestamp").defaultNow(),
  emailSent: boolean("email_sent").default(false),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  oggetto: text("oggetto").notNull(),
  messaggio: text("messaggio").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  risposto: boolean("risposto").default(false),
});

export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  attivo: boolean("attivo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  nome: true,
  cognome: true,
  dataNascita: true,
  luogoNascita: true,
  codiceFiscale: true,
  numeroLicenza: true,
  email: true,
  password: true,
});

export const insertPendingUserSchema = createInsertSchema(pendingUsers).omit({
  id: true,
  createdAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  data: true,
});

export const insertCompetitionSchema = createInsertSchema(competitions).omit({
  id: true,
  createdAt: true,
});

export const insertMembershipSchema = createInsertSchema(memberships).omit({
  id: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  risposto: true,
});

export const insertNewsletterSchema = createInsertSchema(newsletter).pick({
  email: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PendingUser = typeof pendingUsers.$inferSelect;
export type InsertPendingUser = z.infer<typeof insertPendingUserSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;
export type Membership = typeof memberships.$inferSelect;
export type InsertMembership = z.infer<typeof insertMembershipSchema>;
export type MembershipPurchase = typeof membershipPurchases.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Newsletter = typeof newsletter.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
