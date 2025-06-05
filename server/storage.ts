import { users, pendingUsers, news, competitions, memberships, membershipPurchases, contacts, newsletter } from "@shared/schema";
import type { User, InsertUser, PendingUser, InsertPendingUser, News, InsertNews, Competition, InsertCompetition, Membership, InsertMembership, MembershipPurchase, Contact, InsertContact, Newsletter, InsertNewsletter } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  
  // Pending users
  createPendingUser(user: InsertPendingUser): Promise<PendingUser>;
  getPendingUsers(): Promise<PendingUser[]>;
  getPendingUser(id: number): Promise<PendingUser | undefined>;
  approvePendingUser(id: number): Promise<User>;
  deletePendingUser(id: number): Promise<void>;
  
  // News
  createNews(news: InsertNews): Promise<News>;
  getNews(): Promise<News[]>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  updateNews(id: number, news: Partial<InsertNews>): Promise<News>;
  deleteNews(id: number): Promise<void>;
  
  // Competitions
  createCompetition(competition: InsertCompetition): Promise<Competition>;
  getCompetitions(): Promise<Competition[]>;
  getCompetition(id: number): Promise<Competition | undefined>;
  updateCompetition(id: number, competition: Partial<InsertCompetition>): Promise<Competition>;
  deleteCompetition(id: number): Promise<void>;
  
  // Memberships
  createMembership(membership: InsertMembership): Promise<Membership>;
  getMemberships(): Promise<Membership[]>;
  getMembership(id: number): Promise<Membership | undefined>;
  updateMembership(id: number, membership: Partial<InsertMembership>): Promise<Membership>;
  
  // Membership purchases
  createMembershipPurchase(purchase: Omit<MembershipPurchase, 'id' | 'createdAt'>): Promise<MembershipPurchase>;
  getMembershipPurchases(): Promise<MembershipPurchase[]>;
  updateMembershipPurchaseStatus(id: number, status: string, emailSent?: boolean): Promise<MembershipPurchase>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  markContactReplied(id: number): Promise<Contact>;
  
  // Newsletter
  addNewsletterSubscriber(subscriber: InsertNewsletter): Promise<Newsletter>;
  getNewsletterSubscribers(): Promise<Newsletter[]>;
  
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
  public sessionStore: session.SessionStore;

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

    // Seed some initial data
    this.seedInitialData();
  }

  private async seedInitialData() {
    // Create admin user
    const admin: User = {
      id: this.currentId++,
      username: "admin",
      email: "admin@enalcaccia.it",
      password: "$2b$12$LQv3c1yqBwEHFw1d1Q1Qq.H9I8U9JNPZGcEJcGHGqW3JGjlJ0J5jO", // password: admin123
      role: "admin",
      nome: "Mario",
      cognome: "Rossi",
      dataNascita: "1980-01-01",
      luogoNascita: "Roma",
      codiceFiscale: "RSSMRA80A01H501Z",
      numeroLicenza: "ADM001",
      approved: true,
      approvedAt: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };
    this.users.set(admin.id, admin);

    // Create sample memberships
    const memberships = [
      {
        id: this.currentId++,
        name: "Tessera Base",
        description: "Ideale per cacciatori occasionali",
        price: "85.00",
        benefits: ["Licenza di caccia valida", "Accesso alle riserve convenzionate", "Newsletter mensile"],
        active: true,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        name: "Tessera Premium",
        description: "Per cacciatori esperti e appassionati",
        price: "150.00",
        benefits: ["Tutti i vantaggi della tessera base", "Partecipazione gare cinofile", "Sconti presso armerie convenzionate", "Corsi di formazione gratuiti"],
        active: true,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        name: "Tessera Elite",
        description: "Massimo livello di servizi",
        price: "250.00",
        benefits: ["Tutti i vantaggi Premium", "Accesso esclusivo riserve premium", "Consulenza personalizzata", "Eventi esclusivi"],
        active: true,
        createdAt: new Date(),
      },
    ];

    memberships.forEach(membership => {
      this.memberships.set(membership.id, membership as Membership);
    });

    // Create sample news articles
    const newsArticles = [
      {
        id: this.currentId++,
        title: "Campionato Regionale di Caccia Pratica",
        slug: "campionato-regionale-caccia-pratica",
        content: "Si terrà il prossimo mese il campionato regionale di caccia pratica. Le iscrizioni sono aperte fino al 28 gennaio. Il campionato si svolgerà nelle riserve di caccia del nord Italia.",
        excerpt: "Si terrà il prossimo mese il campionato regionale di caccia pratica. Iscrizioni aperte fino al 28 gennaio.",
        featuredImage: "https://images.unsplash.com/photo-1551717743-49959800b1f6",
        category: "Gare Cinofile",
        authorId: admin.id,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Nuovo Corso di Formazione Venatoria",
        slug: "nuovo-corso-formazione-venatoria",
        content: "Al via il corso per aspiranti cacciatori con focus sulla sostenibilità ambientale e sicurezza. Il corso si articola in 8 lezioni teoriche e 4 pratiche.",
        excerpt: "Al via il corso per aspiranti cacciatori con focus sulla sostenibilità ambientale e sicurezza.",
        featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        category: "Formazione",
        authorId: admin.id,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Addestramento Cani da Caccia",
        slug: "addestramento-cani-caccia",
        content: "Workshop specializzato per l'addestramento di cani da ferma e da cerca, condotto da esperti cinofili. Il workshop include tecniche moderne di addestramento.",
        excerpt: "Workshop specializzato per l'addestramento di cani da ferma e da cerca, condotto da esperti cinofili.",
        featuredImage: "https://images.unsplash.com/photo-1551717743-49959800b1f6",
        category: "Attività",
        authorId: admin.id,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    newsArticles.forEach(article => {
      this.news.set(article.id, article as News);
    });

    // Create sample competitions
    const competitions = [
      {
        id: this.currentId++,
        title: "Gara di Caccia al Cinghiale - Treviso",
        description: "Gara di caccia al cinghiale con cani segugi. Iscrizioni aperte fino al 15 dicembre.",
        discipline: "Caccia al Cinghiale",
        location: "Treviso, Località Monte Grappa",
        eventDate: new Date("2024-12-20"),
        cost: "45.00",
        bandoUrl: "/docs/bando-treviso-cinghiale.pdf",
        maxParticipants: 50,
        registrationDeadline: new Date("2024-12-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        title: "Prova di Lavoro per Segugi - Vicenza",
        description: "Prova di lavoro su lepre per cani segugi. Valida per qualifica ENCI.",
        discipline: "Segugio",
        location: "Vicenza, Altopiano di Asiago",
        eventDate: new Date("2024-12-28"),
        cost: "35.00",
        bandoUrl: "/docs/bando-vicenza-segugi.pdf",
        maxParticipants: 30,
        registrationDeadline: new Date("2024-12-20"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    competitions.forEach(competition => {
      this.competitions.set(competition.id, competition as Competition);
    });
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
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      role: "utente",
      approved: true,
      approvedAt: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };
    delete (user as any).passwordConfirm;
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

  async getPendingUsers(): Promise<PendingUser[]> {
    return Array.from(this.pendingUsers.values());
  }

  async getPendingUser(id: number): Promise<PendingUser | undefined> {
    return this.pendingUsers.get(id);
  }

  async approvePendingUser(id: number): Promise<User> {
    const pendingUser = this.pendingUsers.get(id);
    if (!pendingUser) throw new Error("Pending user not found");

    const userId = this.currentId++;
    const user: User = {
      id: userId,
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password,
      role: "utente",
      nome: pendingUser.nome,
      cognome: pendingUser.cognome,
      dataNascita: pendingUser.dataNascita,
      luogoNascita: pendingUser.luogoNascita,
      codiceFiscale: pendingUser.codiceFiscale,
      numeroLicenza: pendingUser.numeroLicenza,
      approved: true,
      approvedAt: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };

    this.users.set(userId, user);
    this.pendingUsers.delete(id);
    return user;
  }

  async deletePendingUser(id: number): Promise<void> {
    this.pendingUsers.delete(id);
  }

  async createNews(news: InsertNews): Promise<News> {
    const id = this.currentId++;
    const newsItem: News = {
      ...news,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.news.set(id, newsItem);
    return newsItem;
  }

  async getNews(): Promise<News[]> {
    return Array.from(this.news.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    return Array.from(this.news.values()).find(item => item.slug === slug);
  }

  async updateNews(id: number, updates: Partial<InsertNews>): Promise<News> {
    const newsItem = this.news.get(id);
    if (!newsItem) throw new Error("News not found");
    
    const updatedNews = { ...newsItem, ...updates, updatedAt: new Date() };
    this.news.set(id, updatedNews);
    return updatedNews;
  }

  async deleteNews(id: number): Promise<void> {
    this.news.delete(id);
  }

  async createCompetition(competition: InsertCompetition): Promise<Competition> {
    const id = this.currentId++;
    const comp: Competition = {
      ...competition,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.competitions.set(id, comp);
    return comp;
  }

  async getCompetitions(): Promise<Competition[]> {
    return Array.from(this.competitions.values()).sort((a, b) => 
      new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  }

  async getCompetition(id: number): Promise<Competition | undefined> {
    return this.competitions.get(id);
  }

  async updateCompetition(id: number, updates: Partial<InsertCompetition>): Promise<Competition> {
    const competition = this.competitions.get(id);
    if (!competition) throw new Error("Competition not found");
    
    const updatedCompetition = { ...competition, ...updates, updatedAt: new Date() };
    this.competitions.set(id, updatedCompetition);
    return updatedCompetition;
  }

  async deleteCompetition(id: number): Promise<void> {
    this.competitions.delete(id);
  }

  async createMembership(membership: InsertMembership): Promise<Membership> {
    const id = this.currentId++;
    const mem: Membership = {
      ...membership,
      id,
      createdAt: new Date(),
    };
    this.memberships.set(id, mem);
    return mem;
  }

  async getMemberships(): Promise<Membership[]> {
    return Array.from(this.memberships.values()).filter(m => m.active);
  }

  async getMembership(id: number): Promise<Membership | undefined> {
    return this.memberships.get(id);
  }

  async updateMembership(id: number, updates: Partial<InsertMembership>): Promise<Membership> {
    const membership = this.memberships.get(id);
    if (!membership) throw new Error("Membership not found");
    
    const updatedMembership = { ...membership, ...updates };
    this.memberships.set(id, updatedMembership);
    return updatedMembership;
  }

  async createMembershipPurchase(purchase: Omit<MembershipPurchase, 'id' | 'createdAt'>): Promise<MembershipPurchase> {
    const id = this.currentId++;
    const membershipPurchase: MembershipPurchase = {
      ...purchase,
      id,
      createdAt: new Date(),
    };
    this.membershipPurchases.set(id, membershipPurchase);
    return membershipPurchase;
  }

  async getMembershipPurchases(): Promise<MembershipPurchase[]> {
    return Array.from(this.membershipPurchases.values());
  }

  async updateMembershipPurchaseStatus(id: number, status: string, emailSent?: boolean): Promise<MembershipPurchase> {
    const purchase = this.membershipPurchases.get(id);
    if (!purchase) throw new Error("Membership purchase not found");
    
    const updatedPurchase = { ...purchase, status, ...(emailSent !== undefined && { emailSent }) };
    this.membershipPurchases.set(id, updatedPurchase);
    return updatedPurchase;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.currentId++;
    const contactItem: Contact = {
      ...contact,
      id,
      replied: false,
      createdAt: new Date(),
    };
    this.contacts.set(id, contactItem);
    return contactItem;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async markContactReplied(id: number): Promise<Contact> {
    const contact = this.contacts.get(id);
    if (!contact) throw new Error("Contact not found");
    
    const updatedContact = { ...contact, replied: true };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async addNewsletterSubscriber(subscriber: InsertNewsletter): Promise<Newsletter> {
    const id = this.currentId++;
    const newsletterSub: Newsletter = {
      ...subscriber,
      id,
      active: true,
      createdAt: new Date(),
    };
    this.newsletter.set(id, newsletterSub);
    return newsletterSub;
  }

  async getNewsletterSubscribers(): Promise<Newsletter[]> {
    return Array.from(this.newsletter.values()).filter(sub => sub.active);
  }
}

export const storage = new MemStorage();
