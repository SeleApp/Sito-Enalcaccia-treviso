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
  type InsertNewsletter
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Pending users
  getPendingUserByEmail(email: string): Promise<PendingUser | undefined>;
  createPendingUser(user: InsertPendingUser): Promise<PendingUser>;
  getAllPendingUsers(): Promise<PendingUser[]>;
  approvePendingUser(id: number): Promise<User | undefined>;
  rejectPendingUser(id: number): Promise<boolean>;

  // News management
  getAllNews(): Promise<News[]>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(slug: string, updates: Partial<News>): Promise<News | undefined>;
  deleteNews(slug: string): Promise<boolean>;

  // Competitions
  getAllCompetitions(): Promise<Competition[]>;
  getCompetition(id: number): Promise<Competition | undefined>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;

  // Memberships
  getAllMemberships(): Promise<Membership[]>;
  getMembership(id: number): Promise<Membership | undefined>;
  createMembershipPurchase(purchase: Omit<MembershipPurchase, 'id'>): Promise<MembershipPurchase>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;

  // Newsletter
  createNewsletterSubscription(newsletter: InsertNewsletter): Promise<Newsletter>;

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

    // Initialize with default admin user and sample data
    this.initializeData();
  }

  private initializeData() {
    // Create default admin user
    const adminUser: User = {
      id: this.currentId++,
      nome: "Admin",
      cognome: "Enal",
      dataNascita: "1980-01-01",
      luogoNascita: "Roma",
      codiceFiscale: "ADMNTR80A01H501Z",
      numeroLicenza: "ADMIN001",
      email: "admin@enalcaccia.it",
      password: "$2b$10$K7L/8Y1t85E.M5L5Z8q5w.GVQ6M5Z8q5w.GVQ6M5Z8q5w.GVQ6M5Z8", // "admin123"
      role: "admin",
      approved: true,
      approvedAt: new Date(),
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Initialize sample memberships
    const sampleMemberships: Membership[] = [
      {
        id: this.currentId++,
        nome: "Tessera Base",
        descrizione: "Ideale per cacciatori occasionali",
        costo: 85,
        vantaggi: ["Licenza di caccia valida", "Accesso alle riserve convenzionate", "Newsletter mensile"],
        attivo: true,
      },
      {
        id: this.currentId++,
        nome: "Tessera Premium",
        descrizione: "Per cacciatori esperti e appassionati",
        costo: 150,
        vantaggi: ["Tutti i vantaggi della tessera base", "Partecipazione gare cinofile", "Sconti presso armerie", "Corsi di formazione gratuiti"],
        attivo: true,
      },
      {
        id: this.currentId++,
        nome: "Tessera Elite",
        descrizione: "Massimo livello di servizi",
        costo: 250,
        vantaggi: ["Tutti i vantaggi Premium", "Accesso esclusivo riserve premium", "Consulenza personalizzata", "Eventi esclusivi"],
        attivo: true,
      },
    ];

    sampleMemberships.forEach(membership => {
      this.memberships.set(membership.id, membership);
    });

    // Initialize sample news
    const sampleNews: News[] = [
      {
        id: this.currentId++,
        titolo: "Campionato Regionale di Cinofilia",
        slug: "campionato-regionale-cinofilia-2024",
        contenuto: "Grande successo per il campionato regionale che ha visto la partecipazione di oltre 200 binomi cane-conduttore...",
        data: new Date("2024-01-15"),
        autore: "Admin Enal",
        categoria: "Gare Cinofile",
        pubblicato: true,
      },
      {
        id: this.currentId++,
        titolo: "Nuovo Protocollo Ambientale",
        slug: "nuovo-protocollo-ambientale-2024",
        contenuto: "Approvato il nuovo protocollo per la tutela dell'ambiente e la sostenibilità delle attività venatorie...",
        data: new Date("2024-01-10"),
        autore: "Admin Enal",
        categoria: "Formazione",
        pubblicato: true,
      },
    ];

    sampleNews.forEach(article => {
      this.news.set(article.id, article);
    });

    // Initialize sample competitions
    const sampleCompetitions: Competition[] = [
      {
        id: this.currentId++,
        titolo: "Gara di Caccia al Cinghiale - Treviso",
        dataEvento: new Date("2024-12-20"),
        luogo: "Treviso, Località Monte Grappa",
        disciplina: "Caccia al Cinghiale",
        costo: 45,
        bandoUrl: "/docs/bando-treviso-cinghiale.pdf",
        descrizione: "Gara di caccia al cinghiale con cani segugi. Iscrizioni aperte fino al 15 dicembre.",
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        titolo: "Prova di Lavoro per Segugi - Vicenza",
        dataEvento: new Date("2024-12-28"),
        luogo: "Vicenza, Altopiano di Asiago",
        disciplina: "Segugio",
        costo: 35,
        bandoUrl: "/docs/bando-vicenza-segugi.pdf",
        descrizione: "Prova di lavoro su lepre per cani segugi. Valida per qualifica ENCI.",
        createdAt: new Date(),
      },
    ];

    sampleCompetitions.forEach(competition => {
      this.competitions.set(competition.id, competition);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: "utente",
      approved: true,
      approvedAt: new Date(),
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getPendingUserByEmail(email: string): Promise<PendingUser | undefined> {
    return Array.from(this.pendingUsers.values()).find(user => user.email === email);
  }

  async createPendingUser(user: InsertPendingUser): Promise<PendingUser> {
    const id = this.currentId++;
    const pendingUser: PendingUser = { 
      ...user, 
      id,
      createdAt: new Date(),
    };
    this.pendingUsers.set(id, pendingUser);
    return pendingUser;
  }

  async getAllPendingUsers(): Promise<PendingUser[]> {
    return Array.from(this.pendingUsers.values());
  }

  async approvePendingUser(id: number): Promise<User | undefined> {
    const pendingUser = this.pendingUsers.get(id);
    if (!pendingUser) return undefined;

    const approvedUser = await this.createUser({
      nome: pendingUser.nome,
      cognome: pendingUser.cognome,
      dataNascita: pendingUser.dataNascita,
      luogoNascita: pendingUser.luogoNascita,
      codiceFiscale: pendingUser.codiceFiscale,
      numeroLicenza: pendingUser.numeroLicenza,
      email: pendingUser.email,
      password: pendingUser.password,
    });

    this.pendingUsers.delete(id);
    return approvedUser;
  }

  async rejectPendingUser(id: number): Promise<boolean> {
    return this.pendingUsers.delete(id);
  }

  async getAllNews(): Promise<News[]> {
    return Array.from(this.news.values()).sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    return Array.from(this.news.values()).find(article => article.slug === slug);
  }

  async createNews(newsData: InsertNews): Promise<News> {
    const id = this.currentId++;
    const article: News = { 
      ...newsData, 
      id,
      data: new Date(),
      pubblicato: true,
    };
    this.news.set(id, article);
    return article;
  }

  async updateNews(slug: string, updates: Partial<News>): Promise<News | undefined> {
    const article = await this.getNewsBySlug(slug);
    if (!article) return undefined;
    
    const updatedArticle = { ...article, ...updates };
    this.news.set(article.id, updatedArticle);
    return updatedArticle;
  }

  async deleteNews(slug: string): Promise<boolean> {
    const article = await this.getNewsBySlug(slug);
    if (!article) return false;
    
    return this.news.delete(article.id);
  }

  async getAllCompetitions(): Promise<Competition[]> {
    return Array.from(this.competitions.values()).sort((a, b) => 
      new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime()
    );
  }

  async getCompetition(id: number): Promise<Competition | undefined> {
    return this.competitions.get(id);
  }

  async createCompetition(competition: InsertCompetition): Promise<Competition> {
    const id = this.currentId++;
    const newCompetition: Competition = { 
      ...competition, 
      id,
      createdAt: new Date(),
    };
    this.competitions.set(id, newCompetition);
    return newCompetition;
  }

  async getAllMemberships(): Promise<Membership[]> {
    return Array.from(this.memberships.values()).filter(m => m.attivo);
  }

  async getMembership(id: number): Promise<Membership | undefined> {
    return this.memberships.get(id);
  }

  async createMembershipPurchase(purchase: Omit<MembershipPurchase, 'id'>): Promise<MembershipPurchase> {
    const id = this.currentId++;
    const newPurchase: MembershipPurchase = { ...purchase, id };
    this.membershipPurchases.set(id, newPurchase);
    return newPurchase;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.currentId++;
    const newContact: Contact = { 
      ...contact, 
      id,
      createdAt: new Date(),
      risposto: false,
    };
    this.contacts.set(id, newContact);
    return newContact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createNewsletterSubscription(newsletter: InsertNewsletter): Promise<Newsletter> {
    // Check if email already exists
    const existing = Array.from(this.newsletter.values()).find(n => n.email === newsletter.email);
    if (existing) {
      throw new Error("Email already subscribed");
    }

    const id = this.currentId++;
    const subscription: Newsletter = { 
      ...newsletter, 
      id,
      attivo: true,
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
      totalMemberships: this.membershipPurchases.size,
      contactMessages: this.contacts.size,
    };
  }
}

export const storage = new MemStorage();
