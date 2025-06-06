import session from "express-session";
import createMemoryStore from "memorystore";
import { 
  users, 
  pendingUsers, 
  news, 
  competitions, 
  memberships, 
  userMemberships, 
  contacts, 
  newsletter,
  type User, 
  type PendingUser, 
  type News, 
  type Competition, 
  type Membership, 
  type UserMembership, 
  type Contact, 
  type Newsletter,
  type InsertUser, 
  type InsertPendingUser, 
  type InsertNews, 
  type InsertCompetition, 
  type InsertContact, 
  type InsertNewsletter 
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.SessionStore;
  
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, 'passwordConfirm'>): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Pending users
  getPendingUser(id: number): Promise<PendingUser | undefined>;
  getPendingUserByEmail(email: string): Promise<PendingUser | undefined>;
  createPendingUser(user: InsertPendingUser): Promise<PendingUser>;
  getAllPendingUsers(): Promise<PendingUser[]>;
  deletePendingUser(id: number): Promise<boolean>;
  
  // News
  getNews(id: number): Promise<News | undefined>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  getAllNews(): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, updates: Partial<News>): Promise<News | undefined>;
  deleteNews(id: number): Promise<boolean>;
  
  // Competitions
  getCompetition(id: number): Promise<Competition | undefined>;
  getAllCompetitions(): Promise<Competition[]>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;
  updateCompetition(id: number, updates: Partial<Competition>): Promise<Competition | undefined>;
  deleteCompetition(id: number): Promise<boolean>;
  
  // Memberships
  getMembership(id: number): Promise<Membership | undefined>;
  getAllMemberships(): Promise<Membership[]>;
  createMembership(membership: Omit<Membership, 'id' | 'currentMembers'>): Promise<Membership>;
  
  // User memberships
  getUserMembership(userId: number, membershipId: number): Promise<UserMembership | undefined>;
  createUserMembership(userMembership: Omit<UserMembership, 'id' | 'createdAt'>): Promise<UserMembership>;
  getUserMemberships(userId: number): Promise<UserMembership[]>;
  updateUserMembership(id: number, updates: Partial<UserMembership>): Promise<UserMembership | undefined>;
  
  // Contacts
  getContact(id: number): Promise<Contact | undefined>;
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, updates: Partial<Contact>): Promise<Contact | undefined>;
  
  // Newsletter
  getNewsletterSubscriber(email: string): Promise<Newsletter | undefined>;
  createNewsletterSubscriber(subscriber: InsertNewsletter): Promise<Newsletter>;
  getAllNewsletterSubscribers(): Promise<Newsletter[]>;
}

export class MemStorage implements IStorage {
  public sessionStore: session.SessionStore;
  
  private users: Map<number, User> = new Map();
  private pendingUsers: Map<number, PendingUser> = new Map();
  private news: Map<number, News> = new Map();
  private competitions: Map<number, Competition> = new Map();
  private memberships: Map<number, Membership> = new Map();
  private userMemberships: Map<number, UserMembership> = new Map();
  private contacts: Map<number, Contact> = new Map();
  private newsletter: Map<string, Newsletter> = new Map();
  
  private currentUserId = 1;
  private currentPendingUserId = 1;
  private currentNewsId = 1;
  private currentCompetitionId = 1;
  private currentMembershipId = 1;
  private currentUserMembershipId = 1;
  private currentContactId = 1;
  private currentNewsletterId = 1;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminUser: User = {
      id: this.currentUserId++,
      nome: "Admin",
      cognome: "Enal Caccia",
      dataNascita: "1980-01-01",
      luogoNascita: "Roma",
      codiceFiscale: "ADMENC80A01H501Z",
      numeroLicenza: "ADMIN001",
      email: "admin@enalcaccia.it",
      password: "$2b$10$placeholder", // Will be properly hashed in auth
      role: "admin",
      approved: true,
      approvedAt: new Date(),
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Initialize membership types
    const baseMembership: Membership = {
      id: this.currentMembershipId++,
      name: "Tessera Base",
      description: "Ideale per cacciatori occasionali",
      price: 8500, // €85.00 in cents
      features: [
        "Licenza di caccia valida",
        "Accesso alle riserve convenzionate", 
        "Newsletter mensile",
        "Supporto base"
      ],
      maxMembers: null,
      currentMembers: 0,
      active: true,
    };

    const premiumMembership: Membership = {
      id: this.currentMembershipId++,
      name: "Tessera Premium",
      description: "Per cacciatori esperti e appassionati",
      price: 15000, // €150.00 in cents
      features: [
        "Tutti i vantaggi della tessera base",
        "Partecipazione gare cinofile",
        "Sconti presso armerie convenzionate",
        "Corsi di formazione gratuiti",
        "Supporto prioritario"
      ],
      maxMembers: null,
      currentMembers: 0,
      active: true,
    };

    const eliteMembership: Membership = {
      id: this.currentMembershipId++,
      name: "Tessera Elite",
      description: "Massimo livello di servizi",
      price: 25000, // €250.00 in cents
      features: [
        "Tutti i vantaggi Premium",
        "Accesso esclusivo riserve premium",
        "Consulenza personalizzata",
        "Eventi esclusivi",
        "Kit cacciatore personalizzato"
      ],
      maxMembers: 100,
      currentMembers: 0,
      active: true,
    };

    this.memberships.set(baseMembership.id, baseMembership);
    this.memberships.set(premiumMembership.id, premiumMembership);
    this.memberships.set(eliteMembership.id, eliteMembership);

    // Sample news articles
    const sampleNews: News[] = [
      {
        id: this.currentNewsId++,
        title: "Campionato Regionale di Caccia Pratica",
        slug: "campionato-regionale-caccia-pratica",
        content: "Si terrà il prossimo mese il campionato regionale di caccia pratica. Un evento che vedrà la partecipazione dei migliori cacciatori della regione...",
        excerpt: "Si terrà il prossimo mese il campionato regionale di caccia pratica. Iscrizioni aperte fino al 28 gennaio.",
        featuredImage: "https://images.unsplash.com/photo-1551717743-49959800b1f6",
        category: "Gare Cinofile",
        published: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: this.currentNewsId++,
        title: "Nuovo Corso di Formazione Venatoria",
        slug: "nuovo-corso-formazione-venatoria",
        content: "Al via il corso per aspiranti cacciatori con focus sulla sostenibilità ambientale e sicurezza. Il corso si terrà presso la nostra sede...",
        excerpt: "Al via il corso per aspiranti cacciatori con focus sulla sostenibilità ambientale e sicurezza.",
        featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        category: "Formazione",
        published: true,
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-12"),
      },
      {
        id: this.currentNewsId++,
        title: "Addestramento Cani da Caccia",
        slug: "addestramento-cani-caccia",
        content: "Workshop specializzato per l'addestramento di cani da ferma e da cerca, condotto da esperti cinofili certificati...",
        excerpt: "Workshop specializzato per l'addestramento di cani da ferma e da cerca, condotto da esperti cinofili.",
        featuredImage: "https://images.unsplash.com/photo-1551717743-49959800b1f6",
        category: "Attività",
        published: true,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
      },
    ];

    sampleNews.forEach(article => {
      this.news.set(article.id, article);
    });

    // Sample competitions
    const sampleCompetitions: Competition[] = [
      {
        id: this.currentCompetitionId++,
        title: "Gara di Caccia al Cinghiale - Treviso",
        description: "Gara di caccia al cinghiale con cani segugi. Iscrizioni aperte fino al 15 dicembre.",
        discipline: "Caccia al Cinghiale",
        location: "Treviso, Località Monte Grappa",
        eventDate: new Date("2024-12-20"),
        cost: 4500, // €45.00 in cents
        bandoUrl: "/docs/bando-treviso-cinghiale.pdf",
        maxParticipants: 50,
        registeredParticipants: 23,
        registrationDeadline: new Date("2024-12-15"),
        createdAt: new Date(),
      },
      {
        id: this.currentCompetitionId++,
        title: "Prova di Lavoro per Segugi - Vicenza",
        description: "Prova di lavoro su lepre per cani segugi. Valida per qualifica ENCI.",
        discipline: "Segugio",
        location: "Vicenza, Altopiano di Asiago",
        eventDate: new Date("2024-12-28"),
        cost: 3500, // €35.00 in cents
        bandoUrl: "/docs/bando-vicenza-segugi.pdf",
        maxParticipants: 40,
        registeredParticipants: 18,
        registrationDeadline: new Date("2024-12-22"),
        createdAt: new Date(),
      },
    ];

    sampleCompetitions.forEach(competition => {
      this.competitions.set(competition.id, competition);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: Omit<InsertUser, 'passwordConfirm'>): Promise<User> {
    const user: User = {
      ...userData,
      id: this.currentUserId++,
      approved: false,
      approvedAt: null,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Pending users methods
  async getPendingUser(id: number): Promise<PendingUser | undefined> {
    return this.pendingUsers.get(id);
  }

  async getPendingUserByEmail(email: string): Promise<PendingUser | undefined> {
    return Array.from(this.pendingUsers.values()).find(user => user.email === email);
  }

  async createPendingUser(userData: InsertPendingUser): Promise<PendingUser> {
    const user: PendingUser = {
      ...userData,
      id: this.currentPendingUserId++,
      createdAt: new Date(),
    };
    this.pendingUsers.set(user.id, user);
    return user;
  }

  async getAllPendingUsers(): Promise<PendingUser[]> {
    return Array.from(this.pendingUsers.values());
  }

  async deletePendingUser(id: number): Promise<boolean> {
    return this.pendingUsers.delete(id);
  }

  // News methods
  async getNews(id: number): Promise<News | undefined> {
    return this.news.get(id);
  }

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    return Array.from(this.news.values()).find(article => article.slug === slug);
  }

  async getAllNews(): Promise<News[]> {
    return Array.from(this.news.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createNews(newsData: InsertNews): Promise<News> {
    const article: News = {
      ...newsData,
      id: this.currentNewsId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.news.set(article.id, article);
    return article;
  }

  async updateNews(id: number, updates: Partial<News>): Promise<News | undefined> {
    const article = this.news.get(id);
    if (!article) return undefined;
    
    const updatedArticle = { ...article, ...updates, updatedAt: new Date() };
    this.news.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteNews(id: number): Promise<boolean> {
    return this.news.delete(id);
  }

  // Competition methods
  async getCompetition(id: number): Promise<Competition | undefined> {
    return this.competitions.get(id);
  }

  async getAllCompetitions(): Promise<Competition[]> {
    return Array.from(this.competitions.values()).sort((a, b) => 
      new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  }

  async createCompetition(competitionData: InsertCompetition): Promise<Competition> {
    const competition: Competition = {
      ...competitionData,
      id: this.currentCompetitionId++,
      registeredParticipants: 0,
      createdAt: new Date(),
    };
    this.competitions.set(competition.id, competition);
    return competition;
  }

  async updateCompetition(id: number, updates: Partial<Competition>): Promise<Competition | undefined> {
    const competition = this.competitions.get(id);
    if (!competition) return undefined;
    
    const updatedCompetition = { ...competition, ...updates };
    this.competitions.set(id, updatedCompetition);
    return updatedCompetition;
  }

  async deleteCompetition(id: number): Promise<boolean> {
    return this.competitions.delete(id);
  }

  // Membership methods
  async getMembership(id: number): Promise<Membership | undefined> {
    return this.memberships.get(id);
  }

  async getAllMemberships(): Promise<Membership[]> {
    return Array.from(this.memberships.values()).filter(m => m.active);
  }

  async createMembership(membershipData: Omit<Membership, 'id' | 'currentMembers'>): Promise<Membership> {
    const membership: Membership = {
      ...membershipData,
      id: this.currentMembershipId++,
      currentMembers: 0,
    };
    this.memberships.set(membership.id, membership);
    return membership;
  }

  // User membership methods
  async getUserMembership(userId: number, membershipId: number): Promise<UserMembership | undefined> {
    return Array.from(this.userMemberships.values()).find(
      um => um.userId === userId && um.membershipId === membershipId
    );
  }

  async createUserMembership(userMembershipData: Omit<UserMembership, 'id' | 'createdAt'>): Promise<UserMembership> {
    const userMembership: UserMembership = {
      ...userMembershipData,
      id: this.currentUserMembershipId++,
      createdAt: new Date(),
    };
    this.userMemberships.set(userMembership.id, userMembership);
    return userMembership;
  }

  async getUserMemberships(userId: number): Promise<UserMembership[]> {
    return Array.from(this.userMemberships.values()).filter(um => um.userId === userId);
  }

  async updateUserMembership(id: number, updates: Partial<UserMembership>): Promise<UserMembership | undefined> {
    const userMembership = this.userMemberships.get(id);
    if (!userMembership) return undefined;
    
    const updated = { ...userMembership, ...updates };
    this.userMemberships.set(id, updated);
    return updated;
  }

  // Contact methods
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createContact(contactData: InsertContact): Promise<Contact> {
    const contact: Contact = {
      ...contactData,
      id: this.currentContactId++,
      replied: false,
      createdAt: new Date(),
    };
    this.contacts.set(contact.id, contact);
    return contact;
  }

  async updateContact(id: number, updates: Partial<Contact>): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;
    
    const updated = { ...contact, ...updates };
    this.contacts.set(id, updated);
    return updated;
  }

  // Newsletter methods
  async getNewsletterSubscriber(email: string): Promise<Newsletter | undefined> {
    return this.newsletter.get(email);
  }

  async createNewsletterSubscriber(subscriberData: InsertNewsletter): Promise<Newsletter> {
    const subscriber: Newsletter = {
      ...subscriberData,
      id: this.currentNewsletterId++,
      subscribedAt: new Date(),
    };
    this.newsletter.set(subscriber.email, subscriber);
    return subscriber;
  }

  async getAllNewsletterSubscribers(): Promise<Newsletter[]> {
    return Array.from(this.newsletter.values());
  }
}

export const storage = new MemStorage();
