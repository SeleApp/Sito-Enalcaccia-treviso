import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq } from "drizzle-orm";
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
const PostgresSessionStore = connectPg(session);

type MembershipInput = Omit<Membership, 'id' | 'currentMembers'>;

const OFFICIAL_MEMBERSHIP_CATALOG: MembershipInput[] = [
  {
    name: "Tessera semplice",
    description: "Copertura annuale per attivita venatoria di base.",
    price: 6500,
    features: ["Copertura base", "Validita annuale"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Tessera caccia super 1 cane",
    description: "Copertura estesa per caccia con un cane.",
    price: 14000,
    features: ["Copertura super", "Inclusione 1 cane", "Validita annuale"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Tessera caccia super 2 cani",
    description: "Copertura estesa per caccia con due cani.",
    price: 16500,
    features: ["Copertura super", "Inclusione 2 cani", "Validita annuale"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Tessera base nazionale",
    description: "Tessera nazionale con copertura base.",
    price: 8500,
    features: ["Copertura nazionale base", "Validita annuale"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Tessera super",
    description: "Tessera nazionale con copertura super.",
    price: 11000,
    features: ["Copertura super", "Servizi estesi", "Validita annuale"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Tessera pesca semplice",
    description: "Copertura annuale per attivita di pesca.",
    price: 8000,
    features: ["Copertura pesca base", "Validita annuale"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Tessera pesca super 1 cane",
    description: "Copertura pesca super con opzione 1 cane.",
    price: 15500,
    features: ["Copertura pesca super", "Opzione 1 cane", "Validita annuale"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Tessera pesca",
    description: "Tessera pesca essenziale.",
    price: 2000,
    features: ["Accesso pesca", "Validita annuale"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Tessera pesca lago (giovani 14-90 anni)",
    description: "Formula lago dedicata ai giovani 14-90 anni.",
    price: 1000,
    features: ["Accesso pesca lago", "Tariffa agevolata"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Tessera pesca ragazzi 7-14 anni",
    description: "Formula pesca dedicata ai ragazzi 7-14 anni.",
    price: 600,
    features: ["Accesso pesca ragazzi", "Tariffa agevolata"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Tessera amatoriale",
    description: "Tessera per attivita amatoriali.",
    price: 3000,
    features: ["Copertura amatoriale", "Validita annuale"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Capanno richiami vivi",
    description: "Opzione aggiuntiva per capanno richiami vivi.",
    price: 1000,
    features: ["Opzione aggiuntiva"],
    maxMembers: null,
    active: true,
  },
  {
    name: "Morte del cane (opzione assicurativa)",
    description: "Opzione assicurativa aggiuntiva per morte del cane.",
    price: 3000,
    features: ["Opzione assicurativa aggiuntiva"],
    maxMembers: null,
    active: true,
  },
];

export interface IStorage {
  sessionStore: session.Store;
  
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, 'passwordConfirm'>): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
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
  createMembership(membership: MembershipInput): Promise<Membership>;
  
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
  public sessionStore: session.Store;
  
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

    // Initialize membership types from official catalog
    OFFICIAL_MEMBERSHIP_CATALOG.forEach((membershipData) => {
      const membership: Membership = {
        ...membershipData,
        id: this.currentMembershipId++,
        currentMembers: 0,
      };
      this.memberships.set(membership.id, membership);
    });

    // Sample news articles (ispirate a temi recenti di Caccia Magazine, testi originali)
    const sampleNews: News[] = [
      {
        id: this.currentNewsId++,
        title: "Trofeo Prealpi FIBE: pubblicata la comunicazione ufficiale",
        slug: "trofeo-prealpi-fibe-comunicazione-ufficiale",
        content: "La sezione comunica la pubblicazione del Trofeo Prealpi FIBE con materiale informativo ufficiale aggiornato.\n\nPer tutti i dettagli organizzativi, consultare la locandina e gli allegati dedicati:\n- Locandina: /attached_assets/Locandina Fibec.jpg\n- Calendario: /attached_assets/Calendario fibec .jpg\n- Quota partecipazione: /attached_assets/Quota partecipazione fibec.jpg\n\nPer chiarimenti operativi e adesioni, utilizzare la pagina contatti del sito.",
        excerpt: "Disponibile la comunicazione ufficiale del Trofeo Prealpi FIBE con locandina, calendario e quota partecipazione.",
        featuredImage: "/attached_assets/Locandina Fibec.jpg",
        category: "Gare Cinofile",
        published: true,
        createdAt: new Date("2026-03-09"),
        updatedAt: new Date("2026-03-09"),
      },
      {
        id: this.currentNewsId++,
        title: "Gara cinofila provinciale 18 aprile 2026: locandina ufficiale",
        slug: "gara-cinofila-provinciale-18-aprile-2026-locandina-ufficiale",
        content: "E' online la locandina ufficiale della gara cinofila provinciale in programma sabato 18 aprile 2026.\n\nL'evento e' dedicato alle razze da ferma, con ritrovo alle ore 7:00 e inizio prove alle ore 8:00.\n\nConsulta la locandina completa per regolamento, iscrizioni e indicazioni organizzative.",
        excerpt: "Pubblicata la locandina ufficiale della gara cinofila del 18 aprile 2026 con dettagli su regolamento e iscrizioni.",
        featuredImage: "/attached_assets/Locandina 18-04-26.pdf",
        category: "Gare Cinofile",
        published: true,
        createdAt: new Date("2026-03-09"),
        updatedAt: new Date("2026-03-09"),
      },
      {
        id: this.currentNewsId++,
        title: "Riforma della legge sulla caccia: aggiornamento sul calendario parlamentare",
        slug: "riforma-legge-caccia-aggiornamento-calendario-parlamentare",
        content: "Nel dibattito nazionale sulla riforma della normativa venatoria si registra una fase di attesa sui passaggi in calendario. La sezione provinciale raccomanda ai soci di seguire gli sviluppi istituzionali con attenzione, evitando interpretazioni non ufficiali e verificando sempre le fonti primarie. Per approfondire il tema, è disponibile un monitoraggio periodico nella rassegna stampa dedicata alle principali testate di settore.",
        excerpt: "Aggiornamento sulla riforma venatoria: fase di attesa sui prossimi passaggi istituzionali.",
        featuredImage: null,
        category: "Normativa",
        published: true,
        createdAt: new Date("2026-03-06"),
        updatedAt: new Date("2026-03-06"),
      },
      {
        id: this.currentNewsId++,
        title: "Comitato faunistico-venatorio: proseguono i lavori tecnici",
        slug: "comitato-faunistico-venatorio-proseguono-lavori-tecnici",
        content: "Nel confronto tra istituzioni e rappresentanze del settore proseguono le attività del comitato faunistico-venatorio nazionale. La sezione sottolinea l'importanza di un approccio tecnico, basato su dati territoriali, sicurezza e gestione sostenibile della fauna. I soci interessati riceveranno aggiornamenti sintetici sui punti che possono avere ricadute operative a livello locale.",
        excerpt: "Proseguono i lavori del comitato faunistico-venatorio con focus su aspetti tecnici e gestione sostenibile.",
        featuredImage: null,
        category: "Comunicati",
        published: true,
        createdAt: new Date("2026-03-06"),
        updatedAt: new Date("2026-03-06"),
      },
      {
        id: this.currentNewsId++,
        title: "Cinofilia venatoria: calendario verifiche attitudinali di primavera",
        slug: "cinofilia-venatoria-calendario-verifiche-attitudinali-primavera",
        content: "Le attività cinofile primaverili entrano nel vivo con verifiche attitudinali dedicate ai cani da ferma. La sezione invita i conduttori a consultare i bandi prima dell'iscrizione, con particolare attenzione a requisiti sanitari, documentazione e limiti numerici. L'obiettivo è garantire prove ordinate, trasparenti e coerenti con i regolamenti vigenti.",
        excerpt: "In arrivo le verifiche attitudinali di primavera: controllare requisiti e bandi prima dell'iscrizione.",
        featuredImage: "/attached_assets/cane-caccia-1.jpg",
        category: "Gare Cinofile",
        published: true,
        createdAt: new Date("2026-03-04"),
        updatedAt: new Date("2026-03-04"),
      },
      {
        id: this.currentNewsId++,
        title: "Cinofilia specialistica: appuntamenti su beccaccia tra febbraio e marzo",
        slug: "cinofilia-specialistica-appuntamenti-beccaccia-febbraio-marzo",
        content: "Il calendario cinofilo specialistico prevede appuntamenti concentrati tra fine inverno e inizio primavera, con formule dedicate ai cani da ferma. La sezione ricorda che la partecipazione richiede preparazione tecnica, rispetto delle regole di campo e attenzione al benessere animale. Eventuali variazioni logistiche saranno comunicate tempestivamente nei canali ufficiali.",
        excerpt: "Appuntamenti cinofili specialistici su beccaccia: focus su regole di campo e benessere animale.",
        featuredImage: "/attached_assets/cane-caccia-2.jpg",
        category: "Gare Cinofile",
        published: true,
        createdAt: new Date("2026-03-03"),
        updatedAt: new Date("2026-03-03"),
      },
      {
        id: this.currentNewsId++,
        title: "Rassegna tecnica: ottiche e attrezzature, come scegliere in modo consapevole",
        slug: "rassegna-tecnica-ottiche-attrezzature-scelta-consapevole",
        content: "Le ultime uscite editoriali del settore evidenziano una crescita dell'interesse verso prove pratiche su ottiche, armi e accessori. La sezione consiglia ai soci di valutare sempre l'attrezzatura in funzione dell'impiego reale, della sicurezza e della conformità normativa. Le schede comparative hanno valore orientativo e non sostituiscono la verifica diretta presso operatori autorizzati.",
        excerpt: "Prove e test di settore: criteri pratici per scegliere ottiche e attrezzature con maggiore consapevolezza.",
        featuredImage: null,
        category: "Attrezzature",
        published: true,
        createdAt: new Date("2026-03-01"),
        updatedAt: new Date("2026-03-01"),
      },
    ];

    sampleNews.forEach(article => {
      this.news.set(article.id, article);
    });

    // Sample competitions
    const sampleCompetitions: Competition[] = [
      {
        id: this.currentCompetitionId++,
        title: "Gara cinofila provinciale - locandina ufficiale",
        description: "Evento ufficiale ENAL Caccia Treviso in programma il 18/04/2026. Consultare la locandina per regolamento, iscrizioni e dettagli organizzativi.",
        discipline: "Cinofilia venatoria",
        location: "Provincia di Treviso",
        eventDate: new Date("2026-04-18"),
        cost: 4000,
        bandoUrl: "/attached_assets/Locandina 18-04-26.pdf",
        maxParticipants: 40,
        registeredParticipants: 0,
        registrationDeadline: new Date("2026-04-15"),
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
      role: userData.role ?? "utente",
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

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
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
      phone: userData.phone ?? null,
      address: userData.address ?? null,
      city: userData.city ?? null,
      zipCode: userData.zipCode ?? null,
      dateOfBirth: userData.dateOfBirth ?? null,
      placeOfBirth: userData.placeOfBirth ?? null,
      fiscalCode: userData.fiscalCode ?? null,
      membershipType: userData.membershipType ?? "base",
      notes: userData.notes ?? null,
      pdfExtracted: userData.pdfExtracted ?? false,
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
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    );
  }

  async createNews(newsData: InsertNews): Promise<News> {
    const article: News = {
      ...newsData,
      id: this.currentNewsId++,
      featuredImage: newsData.featuredImage ?? null,
      published: newsData.published ?? true,
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
      bandoUrl: competitionData.bandoUrl ?? null,
      maxParticipants: competitionData.maxParticipants ?? null,
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

  async createMembership(membershipData: MembershipInput): Promise<Membership> {
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
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
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

// Database storage implementation
export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
    
    // Initialize default data
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Check if admin user exists
      const existingAdmin = await this.getUserByEmail("admin@enalcaccia.it");
      if (!existingAdmin) {
        // Create default admin user
        const adminUser = await this.createUser({
          nome: "Amministratore",
          cognome: "Sistema",
          dataNascita: "1980-01-01",
          luogoNascita: "Treviso",
          codiceFiscale: "DMNSSS80A01L407K",
          numeroLicenza: "ADMIN001",
          email: "admin@enalcaccia.it",
          password: "$2b$10$K8Q8K8K8K8K8K8K8K8K8KO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8", // "admin123"
          role: "admin"
        });

        await this.updateUser(adminUser.id, {
          approved: true,
          approvedAt: new Date(),
        });
        
        // Create sample competition (official programmed event)
        await this.createCompetition({
          title: "Gara cinofila provinciale - locandina ufficiale",
          description: "Evento ufficiale ENAL Caccia Treviso in programma il 18/04/2026. Consultare la locandina per regolamento, iscrizioni e dettagli organizzativi.",
          discipline: "Cinofilia venatoria",
          location: "Provincia di Treviso",
          eventDate: new Date("2026-04-18"),
          cost: 4000,
          bandoUrl: "/attached_assets/Locandina 18-04-26.pdf",
          maxParticipants: 40,
          registrationDeadline: new Date("2026-04-15")
        });

      }

      await this.syncOfficialMemberships();

      const curatedNews: InsertNews[] = [
        {
          title: "Trofeo Prealpi FIBE: pubblicata la comunicazione ufficiale",
          content: "La sezione comunica la pubblicazione del Trofeo Prealpi FIBE con materiale informativo ufficiale aggiornato.\n\nPer tutti i dettagli organizzativi, consultare la locandina e gli allegati dedicati:\n- Locandina: /attached_assets/Locandina Fibec.jpg\n- Calendario: /attached_assets/Calendario fibec .jpg\n- Quota partecipazione: /attached_assets/Quota partecipazione fibec.jpg\n\nPer chiarimenti operativi e adesioni, utilizzare la pagina contatti del sito.",
          slug: "trofeo-prealpi-fibe-comunicazione-ufficiale",
          excerpt: "Disponibile la comunicazione ufficiale del Trofeo Prealpi FIBE con locandina, calendario e quota partecipazione.",
          category: "Gare Cinofile",
          published: true,
          featuredImage: "/attached_assets/Locandina Fibec.jpg",
        },
        {
          title: "Riforma della legge sulla caccia: aggiornamento sul calendario parlamentare",
          content: "Nel dibattito nazionale sulla riforma della normativa venatoria si registra una fase di attesa sui passaggi in calendario. La sezione provinciale raccomanda ai soci di seguire gli sviluppi istituzionali con attenzione, evitando interpretazioni non ufficiali e verificando sempre le fonti primarie. Per approfondire il tema, è disponibile un monitoraggio periodico nella rassegna stampa dedicata alle principali testate di settore.",
          slug: "riforma-legge-caccia-aggiornamento-calendario-parlamentare",
          excerpt: "Aggiornamento sulla riforma venatoria: fase di attesa sui prossimi passaggi istituzionali.",
          category: "Normativa",
          published: true,
          featuredImage: null,
        },
        {
          title: "Comitato faunistico-venatorio: proseguono i lavori tecnici",
          content: "Nel confronto tra istituzioni e rappresentanze del settore proseguono le attività del comitato faunistico-venatorio nazionale. La sezione sottolinea l'importanza di un approccio tecnico, basato su dati territoriali, sicurezza e gestione sostenibile della fauna. I soci interessati riceveranno aggiornamenti sintetici sui punti che possono avere ricadute operative a livello locale.",
          slug: "comitato-faunistico-venatorio-proseguono-lavori-tecnici",
          excerpt: "Proseguono i lavori del comitato faunistico-venatorio con focus su aspetti tecnici e gestione sostenibile.",
          category: "Comunicati",
          published: true,
          featuredImage: null,
        },
        {
          title: "Cinofilia venatoria: calendario verifiche attitudinali di primavera",
          content: "Le attività cinofile primaverili entrano nel vivo con verifiche attitudinali dedicate ai cani da ferma. La sezione invita i conduttori a consultare i bandi prima dell'iscrizione, con particolare attenzione a requisiti sanitari, documentazione e limiti numerici. L'obiettivo è garantire prove ordinate, trasparenti e coerenti con i regolamenti vigenti.",
          slug: "cinofilia-venatoria-calendario-verifiche-attitudinali-primavera",
          excerpt: "In arrivo le verifiche attitudinali di primavera: controllare requisiti e bandi prima dell'iscrizione.",
          category: "Gare Cinofile",
          published: true,
          featuredImage: "/attached_assets/cane-caccia-1.jpg",
        },
        {
          title: "Cinofilia specialistica: appuntamenti su beccaccia tra febbraio e marzo",
          content: "Il calendario cinofilo specialistico prevede appuntamenti concentrati tra fine inverno e inizio primavera, con formule dedicate ai cani da ferma. La sezione ricorda che la partecipazione richiede preparazione tecnica, rispetto delle regole di campo e attenzione al benessere animale. Eventuali variazioni logistiche saranno comunicate tempestivamente nei canali ufficiali.",
          slug: "cinofilia-specialistica-appuntamenti-beccaccia-febbraio-marzo",
          excerpt: "Appuntamenti cinofili specialistici su beccaccia: focus su regole di campo e benessere animale.",
          category: "Gare Cinofile",
          published: true,
          featuredImage: "/attached_assets/cane-caccia-2.jpg",
        },
        {
          title: "Rassegna tecnica: ottiche e attrezzature, come scegliere in modo consapevole",
          content: "Le ultime uscite editoriali del settore evidenziano una crescita dell'interesse verso prove pratiche su ottiche, armi e accessori. La sezione consiglia ai soci di valutare sempre l'attrezzatura in funzione dell'impiego reale, della sicurezza e della conformità normativa. Le schede comparative hanno valore orientativo e non sostituiscono la verifica diretta presso operatori autorizzati.",
          slug: "rassegna-tecnica-ottiche-attrezzature-scelta-consapevole",
          excerpt: "Prove e test di settore: criteri pratici per scegliere ottiche e attrezzature con maggiore consapevolezza.",
          category: "Attrezzature",
          published: true,
          featuredImage: null,
        },
        {
          title: "Gara cinofila provinciale 18 aprile 2026: locandina ufficiale",
          content: "E' online la locandina ufficiale della gara cinofila provinciale in programma sabato 18 aprile 2026.\n\nL'evento e' dedicato alle razze da ferma, con ritrovo alle ore 7:00 e inizio prove alle ore 8:00.\n\nConsulta la locandina completa per regolamento, iscrizioni e indicazioni organizzative: /attached_assets/Locandina 18-04-26.pdf",
          slug: "gara-cinofila-provinciale-18-aprile-2026-locandina-ufficiale",
          excerpt: "Pubblicata la locandina ufficiale della gara cinofila del 18 aprile 2026 con dettagli su regolamento e iscrizioni.",
          category: "Gare Cinofile",
          published: true,
          featuredImage: "/attached_assets/Locandina 18-04-26.pdf",
        },
      ];

      const allExistingNews = await this.getAllNews();
      for (const article of allExistingNews) {
        await this.deleteNews(article.id);
      }

      for (const article of curatedNews) {
        await this.createNews(article);
      }

      const curatedCompetitions: InsertCompetition[] = [
        {
          title: "Gara cinofila provinciale - locandina ufficiale",
          description: "Evento ufficiale ENAL Caccia Treviso in programma il 18/04/2026. Consultare la locandina per regolamento, iscrizioni e dettagli organizzativi.",
          discipline: "Cinofilia venatoria",
          location: "Provincia di Treviso",
          eventDate: new Date("2026-04-18"),
          cost: 4000,
          bandoUrl: "/attached_assets/Locandina 18-04-26.pdf",
          maxParticipants: 40,
          registrationDeadline: new Date("2026-04-15"),
        },
      ];

      const allExistingCompetitions = await this.getAllCompetitions();
      for (const competition of allExistingCompetitions) {
        await this.deleteCompetition(competition.id);
      }

      for (const competition of curatedCompetitions) {
        await this.createCompetition(competition);
      }
    } catch (error) {
      console.log("Inizializzazione dati completata o già presente");
    }
  }

  private async syncOfficialMemberships() {
    const existingMemberships = await db.select().from(memberships);
    const byLowerName = new Map(existingMemberships.map((m) => [m.name.toLowerCase(), m]));

    const legacyNameMap: Record<string, string> = {
      "tessera base nazionale": "Tessera base nazionale",
      "tessera super nazionale": "Tessera super",
      "tessera 2 cani": "Tessera caccia super 2 cani",
      "tessera pesca €10": "Tessera pesca lago (giovani 14-90 anni)",
      "tessera pesca €6": "Tessera pesca ragazzi 7-14 anni",
    };

    for (const [legacyName, targetName] of Object.entries(legacyNameMap)) {
      const legacyMembership = byLowerName.get(legacyName);
      const targetMembership = OFFICIAL_MEMBERSHIP_CATALOG.find((item) => item.name === targetName);

      if (!legacyMembership || !targetMembership) continue;

      await db
        .update(memberships)
        .set({
          name: targetMembership.name,
          description: targetMembership.description,
          price: targetMembership.price,
          features: targetMembership.features,
          maxMembers: targetMembership.maxMembers,
          active: true,
        })
        .where(eq(memberships.id, legacyMembership.id));

      byLowerName.delete(legacyName);
      byLowerName.set(targetMembership.name.toLowerCase(), { ...legacyMembership, name: targetMembership.name });
    }

    for (const membershipData of OFFICIAL_MEMBERSHIP_CATALOG) {
      const existing = byLowerName.get(membershipData.name.toLowerCase());

      if (existing) {
        await db
          .update(memberships)
          .set({
            description: membershipData.description,
            price: membershipData.price,
            features: membershipData.features,
            maxMembers: membershipData.maxMembers,
            active: true,
          })
          .where(eq(memberships.id, existing.id));
        continue;
      }

      await db
        .insert(memberships)
        .values({
          ...membershipData,
          currentMembers: 0,
        });
    }
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: Omit<InsertUser, 'passwordConfirm'>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        role: userData.role || 'utente',
        approved: false,
        approvedAt: null,
        createdAt: new Date()
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Pending users
  async getPendingUser(id: number): Promise<PendingUser | undefined> {
    const [user] = await db.select().from(pendingUsers).where(eq(pendingUsers.id, id));
    return user || undefined;
  }

  async getPendingUserByEmail(email: string): Promise<PendingUser | undefined> {
    const [user] = await db.select().from(pendingUsers).where(eq(pendingUsers.email, email));
    return user || undefined;
  }

  async createPendingUser(userData: InsertPendingUser): Promise<PendingUser> {
    const [user] = await db
      .insert(pendingUsers)
      .values({
        ...userData,
        createdAt: new Date()
      })
      .returning();
    return user;
  }

  async getAllPendingUsers(): Promise<PendingUser[]> {
    return await db.select().from(pendingUsers);
  }

  async deletePendingUser(id: number): Promise<boolean> {
    const result = await db.delete(pendingUsers).where(eq(pendingUsers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // News
  async getNews(id: number): Promise<News | undefined> {
    const [article] = await db.select().from(news).where(eq(news.id, id));
    return article || undefined;
  }

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    const [article] = await db.select().from(news).where(eq(news.slug, slug));
    return article || undefined;
  }

  async getAllNews(): Promise<News[]> {
    return await db.select().from(news);
  }

  async createNews(newsData: InsertNews): Promise<News> {
    const [article] = await db
      .insert(news)
      .values({
        ...newsData,
        featuredImage: newsData.featuredImage || null,
        published: newsData.published || true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return article;
  }

  async updateNews(id: number, updates: Partial<News>): Promise<News | undefined> {
    const [article] = await db
      .update(news)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(news.id, id))
      .returning();
    return article || undefined;
  }

  async deleteNews(id: number): Promise<boolean> {
    const result = await db.delete(news).where(eq(news.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Competitions
  async getCompetition(id: number): Promise<Competition | undefined> {
    const [competition] = await db.select().from(competitions).where(eq(competitions.id, id));
    return competition || undefined;
  }

  async getAllCompetitions(): Promise<Competition[]> {
    return await db.select().from(competitions);
  }

  async createCompetition(competitionData: InsertCompetition): Promise<Competition> {
    const [competition] = await db
      .insert(competitions)
      .values({
        ...competitionData,
        bandoUrl: competitionData.bandoUrl || null,
        maxParticipants: competitionData.maxParticipants || null,
        registeredParticipants: 0,
        createdAt: new Date()
      })
      .returning();
    return competition;
  }

  async updateCompetition(id: number, updates: Partial<Competition>): Promise<Competition | undefined> {
    const [competition] = await db
      .update(competitions)
      .set(updates)
      .where(eq(competitions.id, id))
      .returning();
    return competition || undefined;
  }

  async deleteCompetition(id: number): Promise<boolean> {
    const result = await db.delete(competitions).where(eq(competitions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Memberships
  async getMembership(id: number): Promise<Membership | undefined> {
    const [membership] = await db.select().from(memberships).where(eq(memberships.id, id));
    return membership || undefined;
  }

  async getAllMemberships(): Promise<Membership[]> {
    return await db.select().from(memberships);
  }

  async createMembership(membershipData: MembershipInput): Promise<Membership> {
    const [membership] = await db
      .insert(memberships)
      .values({
        ...membershipData,
        currentMembers: 0
      })
      .returning();
    return membership;
  }

  // User memberships
  async getUserMembership(userId: number, membershipId: number): Promise<UserMembership | undefined> {
    const [userMembership] = await db
      .select()
      .from(userMemberships)
      .where(eq(userMemberships.userId, userId));
    return userMembership || undefined;
  }

  async createUserMembership(userMembershipData: Omit<UserMembership, 'id' | 'createdAt'>): Promise<UserMembership> {
    const [userMembership] = await db
      .insert(userMemberships)
      .values({
        ...userMembershipData,
        createdAt: new Date()
      })
      .returning();
    return userMembership;
  }

  async getUserMemberships(userId: number): Promise<UserMembership[]> {
    return await db.select().from(userMemberships).where(eq(userMemberships.userId, userId));
  }

  async updateUserMembership(id: number, updates: Partial<UserMembership>): Promise<UserMembership | undefined> {
    const [userMembership] = await db
      .update(userMemberships)
      .set(updates)
      .where(eq(userMemberships.id, id))
      .returning();
    return userMembership || undefined;
  }

  // Contacts
  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async createContact(contactData: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values({
        ...contactData,
        createdAt: new Date()
      })
      .returning();
    return contact;
  }

  async updateContact(id: number, updates: Partial<Contact>): Promise<Contact | undefined> {
    const [contact] = await db
      .update(contacts)
      .set(updates)
      .where(eq(contacts.id, id))
      .returning();
    return contact || undefined;
  }

  // Newsletter
  async getNewsletterSubscriber(email: string): Promise<Newsletter | undefined> {
    const [subscriber] = await db.select().from(newsletter).where(eq(newsletter.email, email));
    return subscriber || undefined;
  }

  async createNewsletterSubscriber(subscriberData: InsertNewsletter): Promise<Newsletter> {
    const [subscriber] = await db
      .insert(newsletter)
      .values({
        ...subscriberData,
        subscribedAt: new Date()
      })
      .returning();
    return subscriber;
  }

  async getAllNewsletterSubscribers(): Promise<Newsletter[]> {
    return await db.select().from(newsletter);
  }
}

export const storage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
