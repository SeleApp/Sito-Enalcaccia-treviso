import { 
  users, 
  pendingUsers, 
  memberships, 
  news, 
  competitions, 
  contacts, 
  newsletter,
  type User, 
  type InsertUser, 
  type PendingUser, 
  type InsertPendingUser,
  type Membership,
  type InsertMembership,
  type News,
  type InsertNews,
  type Competition,
  type InsertCompetition,
  type Contact,
  type InsertContact,
  type Newsletter,
  type InsertNewsletter
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User>;
  
  // Pending users
  getAllPendingUsers(): Promise<PendingUser[]>;
  getPendingUser(id: number): Promise<PendingUser | undefined>;
  createPendingUser(user: InsertPendingUser): Promise<PendingUser>;
  approvePendingUser(id: number): Promise<User>;
  deletePendingUser(id: number): Promise<void>;
  
  // Memberships
  createMembership(membership: InsertMembership): Promise<Membership>;
  getUserMemberships(userId: number): Promise<Membership[]>;
  
  // News
  getAllNews(): Promise<News[]>;
  getNews(id: number): Promise<News | undefined>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, data: Partial<InsertNews>): Promise<News>;
  deleteNews(id: number): Promise<void>;
  
  // Competitions
  getAllCompetitions(): Promise<Competition[]>;
  getCompetition(id: number): Promise<Competition | undefined>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;
  updateCompetition(id: number, data: Partial<InsertCompetition>): Promise<Competition>;
  deleteCompetition(id: number): Promise<void>;
  
  // Contacts
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactResponded(id: number): Promise<void>;
  
  // Newsletter
  subscribeNewsletter(email: string): Promise<Newsletter>;
  
  // Admin stats
  getAdminStats(): Promise<{
    approvedUsers: number;
    pendingUsers: number;
    totalMemberships: number;
    contactMessages: number;
  }>;

  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pendingUsers: Map<number, PendingUser>;
  private memberships: Map<number, Membership>;
  private news: Map<number, News>;
  private competitions: Map<number, Competition>;
  private contacts: Map<number, Contact>;
  private newsletter: Map<number, Newsletter>;
  private currentUserId: number;
  private currentPendingUserId: number;
  private currentMembershipId: number;
  private currentNewsId: number;
  private currentCompetitionId: number;
  private currentContactId: number;
  private currentNewsletterId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.pendingUsers = new Map();
    this.memberships = new Map();
    this.news = new Map();
    this.competitions = new Map();
    this.contacts = new Map();
    this.newsletter = new Map();
    this.currentUserId = 1;
    this.currentPendingUserId = 1;
    this.currentMembershipId = 1;
    this.currentNewsId = 1;
    this.currentCompetitionId = 1;
    this.currentContactId = 1;
    this.currentNewsletterId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Create default admin user
    this.createAdminUser();
    this.createSampleData();
  }

  private async createAdminUser() {
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      email: "admin@enalcaccia.it",
      password: "$2b$10$example_hashed_password", // This will be properly hashed by the auth system
      role: "admin",
      nome: "Admin",
      cognome: "User",
      dataNascita: "1980-01-01",
      luogoNascita: "Roma",
      codiceFiscale: "ADMIN123456789AB",
      numeroLicenza: "ADMIN001",
      approved: true,
      approvedAt: new Date(),
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);
  }

  private async createSampleData() {
    // Sample news articles
    const sampleNews: News[] = [
      {
        id: this.currentNewsId++,
        title: "Campionato Regionale di Caccia Pratica",
        slug: "campionato-regionale-caccia-pratica",
        content: "Si terrà il prossimo mese il campionato regionale di caccia pratica. Il evento coinvolgerà cacciatori esperti da tutta la regione.",
        excerpt: "Si terrà il prossimo mese il campionato regionale di caccia pratica. Iscrizioni aperte fino al 28 gennaio.",
        featuredImage: "https://images.unsplash.com/photo-1551717743-49959800b1f6",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentNewsId++,
        title: "Nuovo Corso di Formazione Venatoria",
        slug: "nuovo-corso-formazione-venatoria",
        content: "Al via il corso per aspiranti cacciatori con focus sulla sostenibilità ambientale e sicurezza.",
        excerpt: "Al via il corso per aspiranti cacciatori con focus sulla sostenibilità ambientale e sicurezza.",
        featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleNews.forEach(article => this.news.set(article.id, article));

    // Sample competitions
    const sampleCompetitions: Competition[] = [
      {
        id: this.currentCompetitionId++,
        title: "Gara di Caccia al Cinghiale - Treviso",
        description: "Gara di caccia al cinghiale con cani segugi. Iscrizioni aperte fino al 15 dicembre.",
        date: new Date("2024-12-20"),
        location: "Treviso, Località Monte Grappa",
        discipline: "Caccia al Cinghiale",
        cost: 45,
        bandoUrl: "/docs/bando-treviso-cinghiale.pdf",
        maxParticipants: 50,
        registrationDeadline: new Date("2024-12-15"),
        createdAt: new Date(),
      },
      {
        id: this.currentCompetitionId++,
        title: "Prova di Lavoro per Segugi - Vicenza",
        description: "Prova di lavoro su lepre per cani segugi. Valida per qualifica ENCI.",
        date: new Date("2024-12-28"),
        location: "Vicenza, Altopiano di Asiago",
        discipline: "Segugio",
        cost: 35,
        bandoUrl: "/docs/bando-vicenza-segugi.pdf",
        maxParticipants: 30,
        registrationDeadline: new Date("2024-12-23"),
        createdAt: new Date(),
      },
    ];

    sampleCompetitions.forEach(competition => this.competitions.set(competition.id, competition));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: "utente",
      approved: false,
      approvedAt: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllPendingUsers(): Promise<PendingUser[]> {
    return Array.from(this.pendingUsers.values());
  }

  async getPendingUser(id: number): Promise<PendingUser | undefined> {
    return this.pendingUsers.get(id);
  }

  async createPendingUser(user: InsertPendingUser): Promise<PendingUser> {
    const id = this.currentPendingUserId++;
    const pendingUser: PendingUser = { 
      ...user, 
      id,
      createdAt: new Date(),
    };
    this.pendingUsers.set(id, pendingUser);
    return pendingUser;
  }

  async approvePendingUser(id: number): Promise<User> {
    const pendingUser = this.pendingUsers.get(id);
    if (!pendingUser) {
      throw new Error("Pending user not found");
    }

    const newUser: User = {
      id: this.currentUserId++,
      username: pendingUser.email,
      email: pendingUser.email,
      password: pendingUser.passwordHash,
      role: pendingUser.role,
      nome: pendingUser.nome,
      cognome: pendingUser.cognome,
      dataNascita: pendingUser.dataNascita,
      luogoNascita: pendingUser.luogoNascita,
      codiceFiscale: pendingUser.codiceFiscale,
      numeroLicenza: pendingUser.numeroLicenza,
      approved: true,
      approvedAt: new Date(),
      createdAt: new Date(),
    };

    this.users.set(newUser.id, newUser);
    this.pendingUsers.delete(id);
    return newUser;
  }

  async deletePendingUser(id: number): Promise<void> {
    this.pendingUsers.delete(id);
  }

  async createMembership(membership: InsertMembership): Promise<Membership> {
    const id = this.currentMembershipId++;
    const newMembership: Membership = { 
      ...membership, 
      id,
      createdAt: new Date(),
    };
    this.memberships.set(id, newMembership);
    return newMembership;
  }

  async getUserMemberships(userId: number): Promise<Membership[]> {
    return Array.from(this.memberships.values()).filter(m => m.userId === userId);
  }

  async getAllNews(): Promise<News[]> {
    return Array.from(this.news.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getNews(id: number): Promise<News | undefined> {
    return this.news.get(id);
  }

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    return Array.from(this.news.values()).find(article => article.slug === slug);
  }

  async createNews(news: InsertNews): Promise<News> {
    const id = this.currentNewsId++;
    const newNews: News = { 
      ...news, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.news.set(id, newNews);
    return newNews;
  }

  async updateNews(id: number, data: Partial<InsertNews>): Promise<News> {
    const news = this.news.get(id);
    if (!news) {
      throw new Error("News article not found");
    }
    const updatedNews = { ...news, ...data, updatedAt: new Date() };
    this.news.set(id, updatedNews);
    return updatedNews;
  }

  async deleteNews(id: number): Promise<void> {
    this.news.delete(id);
  }

  async getAllCompetitions(): Promise<Competition[]> {
    return Array.from(this.competitions.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getCompetition(id: number): Promise<Competition | undefined> {
    return this.competitions.get(id);
  }

  async createCompetition(competition: InsertCompetition): Promise<Competition> {
    const id = this.currentCompetitionId++;
    const newCompetition: Competition = { 
      ...competition, 
      id,
      createdAt: new Date(),
    };
    this.competitions.set(id, newCompetition);
    return newCompetition;
  }

  async updateCompetition(id: number, data: Partial<InsertCompetition>): Promise<Competition> {
    const competition = this.competitions.get(id);
    if (!competition) {
      throw new Error("Competition not found");
    }
    const updatedCompetition = { ...competition, ...data };
    this.competitions.set(id, updatedCompetition);
    return updatedCompetition;
  }

  async deleteCompetition(id: number): Promise<void> {
    this.competitions.delete(id);
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const newContact: Contact = { 
      ...contact, 
      id,
      responded: false,
      createdAt: new Date(),
    };
    this.contacts.set(id, newContact);
    return newContact;
  }

  async markContactResponded(id: number): Promise<void> {
    const contact = this.contacts.get(id);
    if (contact) {
      contact.responded = true;
      this.contacts.set(id, contact);
    }
  }

  async subscribeNewsletter(email: string): Promise<Newsletter> {
    const existing = Array.from(this.newsletter.values()).find(n => n.email === email);
    if (existing) {
      return existing;
    }

    const id = this.currentNewsletterId++;
    const subscription: Newsletter = {
      id,
      email,
      active: true,
      createdAt: new Date(),
    };
    this.newsletter.set(id, subscription);
    return subscription;
  }

  async getAdminStats(): Promise<{
    approvedUsers: number;
    pendingUsers: number;
    totalMemberships: number;
    contactMessages: number;
  }> {
    return {
      approvedUsers: Array.from(this.users.values()).filter(u => u.approved).length,
      pendingUsers: this.pendingUsers.size,
      totalMemberships: this.memberships.size,
      contactMessages: this.contacts.size,
    };
  }
}

export const storage = new MemStorage();
