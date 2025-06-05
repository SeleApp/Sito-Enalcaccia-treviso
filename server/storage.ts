import { 
  users, 
  pendingUsers, 
  news, 
  competitions, 
  memberships, 
  membershipPurchases, 
  contacts, 
  newsletter,
  type User, 
  type InsertUser,
  type PendingUser,
  type InsertPendingUser,
  type News,
  type InsertNews,
  type Competition,
  type InsertCompetition,
  type Membership,
  type InsertMembership,
  type MembershipPurchase,
  type Contact,
  type InsertContact,
  type Newsletter,
  type InsertNewsletter,
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  
  // Pending users
  getPendingUsers(): Promise<PendingUser[]>;
  getPendingUser(id: number): Promise<PendingUser | undefined>;
  createPendingUser(user: InsertPendingUser): Promise<PendingUser>;
  deletePendingUser(id: number): Promise<boolean>;
  approvePendingUser(id: number): Promise<User>;
  
  // News
  getAllNews(): Promise<News[]>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(slug: string, news: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(slug: string): Promise<boolean>;
  
  // Competitions
  getAllCompetitions(): Promise<Competition[]>;
  getCompetition(id: number): Promise<Competition | undefined>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;
  updateCompetition(id: number, competition: Partial<InsertCompetition>): Promise<Competition | undefined>;
  deleteCompetition(id: number): Promise<boolean>;
  
  // Memberships
  getAllMemberships(): Promise<Membership[]>;
  getMembership(id: number): Promise<Membership | undefined>;
  createMembership(membership: InsertMembership): Promise<Membership>;
  
  // Membership purchases
  createMembershipPurchase(purchase: Omit<MembershipPurchase, 'id' | 'createdAt'>): Promise<MembershipPurchase>;
  getMembershipPurchasesByUser(userId: number): Promise<MembershipPurchase[]>;
  updateMembershipPurchaseStatus(paymentIntentId: string, status: string): Promise<MembershipPurchase | undefined>;
  
  // Contacts
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Newsletter
  subscribeToNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pendingUsers: Map<number, PendingUser>;
  private news: Map<number, News>;
  private competitions: Map<number, Competition>;
  private memberships: Map<number, Membership>;
  private membershipPurchases: Map<number, MembershipPurchase>;
  private contacts: Map<number, Contact>;
  private newsletter: Map<number, Newsletter>;
  private currentId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.pendingUsers = new Map();
    this.news = new Map();
    this.competitions = new Map();
    this.memberships = new Map();
    this.membershipPurchases = new Map();
    this.contacts = new Map();
    this.newsletter = new Map();
    this.currentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize default admin user
    this.createUser({
      nome: "Admin",
      cognome: "User",
      dataNascita: "1990-01-01",
      luogoNascita: "Roma",
      codiceFiscale: "ADMIN01234567890",
      numeroLicenza: "ADMIN001",
      email: "admin@enalcaccia.it",
      password: "$2b$10$K8yF5vQ1y4Y.pOoJwO2Q0O0Zh0s0WxF8RZzQ1yF5vQ1y4Y.pOoJwO", // "admin123"
      role: "admin",
    });

    // Initialize sample memberships
    this.createMembership({
      name: "Tessera Base",
      description: "Ideale per cacciatori occasionali",
      price: "85.00",
      features: ["Licenza di caccia valida", "Accesso alle riserve convenzionate", "Newsletter mensile"],
      isPopular: false,
    });

    this.createMembership({
      name: "Tessera Premium",
      description: "Per cacciatori esperti e appassionati",
      price: "150.00",
      features: ["Tutti i vantaggi della tessera base", "Partecipazione gare cinofile", "Sconti presso armerie convenzionate", "Corsi di formazione gratuiti"],
      isPopular: true,
    });

    this.createMembership({
      name: "Tessera Elite",
      description: "Massimo livello di servizi",
      price: "250.00",
      features: ["Tutti i vantaggi Premium", "Accesso esclusivo riserve premium", "Consulenza personalizzata", "Eventi esclusivi"],
      isPopular: false,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      approvedAt: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, stripeCustomerId, stripeSubscriptionId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getPendingUsers(): Promise<PendingUser[]> {
    return Array.from(this.pendingUsers.values());
  }

  async getPendingUser(id: number): Promise<PendingUser | undefined> {
    return this.pendingUsers.get(id);
  }

  async createPendingUser(insertPendingUser: InsertPendingUser): Promise<PendingUser> {
    const id = this.currentId++;
    const pendingUser: PendingUser = { 
      ...insertPendingUser, 
      id, 
      createdAt: new Date() 
    };
    this.pendingUsers.set(id, pendingUser);
    return pendingUser;
  }

  async deletePendingUser(id: number): Promise<boolean> {
    return this.pendingUsers.delete(id);
  }

  async approvePendingUser(id: number): Promise<User> {
    const pendingUser = this.pendingUsers.get(id);
    if (!pendingUser) throw new Error("Pending user not found");
    
    const user = await this.createUser({
      nome: pendingUser.nome,
      cognome: pendingUser.cognome,
      dataNascita: pendingUser.dataNascita,
      luogoNascita: pendingUser.luogoNascita,
      codiceFiscale: pendingUser.codiceFiscale,
      numeroLicenza: pendingUser.numeroLicenza,
      email: pendingUser.email,
      password: pendingUser.password,
      role: pendingUser.role,
    });
    
    this.pendingUsers.delete(id);
    return user;
  }

  async getAllNews(): Promise<News[]> {
    return Array.from(this.news.values()).sort((a, b) => 
      new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    );
  }

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    return Array.from(this.news.values()).find(article => article.slug === slug);
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = this.currentId++;
    const article: News = { 
      ...insertNews, 
      id, 
      createdAt: new Date(),
      publishedAt: new Date() 
    };
    this.news.set(id, article);
    return article;
  }

  async updateNews(slug: string, updateNews: Partial<InsertNews>): Promise<News | undefined> {
    const existing = Array.from(this.news.values()).find(article => article.slug === slug);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateNews };
    this.news.set(existing.id, updated);
    return updated;
  }

  async deleteNews(slug: string): Promise<boolean> {
    const existing = Array.from(this.news.values()).find(article => article.slug === slug);
    if (!existing) return false;
    
    return this.news.delete(existing.id);
  }

  async getAllCompetitions(): Promise<Competition[]> {
    return Array.from(this.competitions.values()).sort((a, b) => 
      new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  }

  async getCompetition(id: number): Promise<Competition | undefined> {
    return this.competitions.get(id);
  }

  async createCompetition(insertCompetition: InsertCompetition): Promise<Competition> {
    const id = this.currentId++;
    const competition: Competition = { 
      ...insertCompetition, 
      id, 
      createdAt: new Date() 
    };
    this.competitions.set(id, competition);
    return competition;
  }

  async updateCompetition(id: number, updateCompetition: Partial<InsertCompetition>): Promise<Competition | undefined> {
    const existing = this.competitions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateCompetition };
    this.competitions.set(id, updated);
    return updated;
  }

  async deleteCompetition(id: number): Promise<boolean> {
    return this.competitions.delete(id);
  }

  async getAllMemberships(): Promise<Membership[]> {
    return Array.from(this.memberships.values());
  }

  async getMembership(id: number): Promise<Membership | undefined> {
    return this.memberships.get(id);
  }

  async createMembership(insertMembership: InsertMembership): Promise<Membership> {
    const id = this.currentId++;
    const membership: Membership = { ...insertMembership, id };
    this.memberships.set(id, membership);
    return membership;
  }

  async createMembershipPurchase(purchase: Omit<MembershipPurchase, 'id' | 'createdAt'>): Promise<MembershipPurchase> {
    const id = this.currentId++;
    const membershipPurchase: MembershipPurchase = { 
      ...purchase, 
      id, 
      createdAt: new Date() 
    };
    this.membershipPurchases.set(id, membershipPurchase);
    return membershipPurchase;
  }

  async getMembershipPurchasesByUser(userId: number): Promise<MembershipPurchase[]> {
    return Array.from(this.membershipPurchases.values()).filter(purchase => purchase.userId === userId);
  }

  async updateMembershipPurchaseStatus(paymentIntentId: string, status: string): Promise<MembershipPurchase | undefined> {
    const existing = Array.from(this.membershipPurchases.values()).find(purchase => purchase.paymentIntentId === paymentIntentId);
    if (!existing) return undefined;
    
    const updated = { ...existing, status };
    this.membershipPurchases.set(existing.id, updated);
    return updated;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentId++;
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async subscribeToNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    // Check if email already exists
    const existing = Array.from(this.newsletter.values()).find(sub => sub.email === insertNewsletter.email);
    if (existing) {
      throw new Error("Email already subscribed");
    }
    
    const id = this.currentId++;
    const newsletter: Newsletter = { 
      ...insertNewsletter, 
      id, 
      subscribedAt: new Date() 
    };
    this.newsletter.set(id, newsletter);
    return newsletter;
  }
}

export const storage = new MemStorage();
