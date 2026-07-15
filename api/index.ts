import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://xunvrmahefvawvydpcom.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_MkHxO9yaa8Iw8N6KKwsE8A_ecjkkmfT";
const DEFAULT_SITE_URL = "https://www.enalcacciatv.it";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabasePublishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function createRequestClient(req: any): SupabaseClient {
  const rawAuthorization = req.headers?.authorization;
  const authorization = Array.isArray(rawAuthorization) ? rawAuthorization[0] : rawAuthorization;
  const headers = authorization ? { Authorization: authorization } : {};

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { headers },
  });
}

function parseBody(req: any): Record<string, any> {
  if (!req.body) return {};
  if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;

  const text = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(400, "Corpo della richiesta non valido.");
  }
}

function normalizePath(req: any): string {
  const rawPath = req.query?.path;
  if (Array.isArray(rawPath)) return `/${rawPath.join("/")}`;
  if (typeof rawPath === "string" && rawPath.length > 0) {
    return `/${rawPath.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  }

  const url = new URL(req.url || "/api", "https://local.invalid");
  const withoutApi = url.pathname.replace(/^\/api\/?/, "");
  return withoutApi ? `/${withoutApi.replace(/\/+$/, "")}` : "/";
}

function sendJson(res: any, status: number, payload: unknown) {
  return res.status(status).json(payload);
}

function escapeXml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function assertNoError(error: any) {
  if (error) throw new ApiError(500, error.message || "Errore database.");
}

async function requireUser(client: SupabaseClient): Promise<User> {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) throw new ApiError(401, "Autenticazione richiesta.");
  return user;
}

async function requireAdmin(client: SupabaseClient): Promise<User> {
  const user = await requireUser(client);
  const { data, error } = await client
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  assertNoError(error);
  if (data?.role !== "admin") throw new ApiError(403, "Accesso amministratore richiesto.");
  return user;
}

function mapNews(row: any) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt,
    featuredImage: row.featured_image,
    category: row.category,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCompetition(row: any) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    discipline: row.discipline,
    location: row.location,
    eventDate: row.event_date,
    cost: row.cost,
    bandoUrl: row.bando_url,
    maxParticipants: row.max_participants,
    registeredParticipants: row.registered_participants,
    registrationDeadline: row.registration_deadline,
    createdAt: row.created_at,
  };
}

function mapMembership(row: any) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    features: row.features,
    maxMembers: row.max_members,
    currentMembers: row.current_members,
    active: row.active,
  };
}

function mapContact(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    replied: row.replied,
    createdAt: row.created_at,
  };
}

function newsPayload(body: Record<string, any>) {
  return {
    title: body.title,
    slug: body.slug,
    content: body.content,
    excerpt: body.excerpt,
    featured_image: body.featuredImage || null,
    category: body.category,
    published: body.published ?? true,
    updated_at: new Date().toISOString(),
  };
}

function competitionPayload(body: Record<string, any>) {
  return {
    title: body.title,
    description: body.description,
    discipline: body.discipline,
    location: body.location,
    event_date: body.eventDate,
    cost: Number(body.cost || 0),
    bando_url: body.bandoUrl || null,
    max_participants: body.maxParticipants == null ? null : Number(body.maxParticipants),
    registered_participants: Number(body.registeredParticipants || 0),
    registration_deadline: body.registrationDeadline,
  };
}

async function handleSitemap(res: any) {
  const client = createClient(supabaseUrl, supabasePublishableKey);
  const { data, error } = await client
    .from("news")
    .select("slug,updated_at,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });
  assertNoError(error);

  const baseUrl = (process.env.PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
  const staticRoutes = [
    "/",
    "/news",
    "/eventi",
    "/competitions",
    "/magazine",
    "/membership",
    "/contact",
    "/scuola-venatoria",
    "/direttivo",
    "/gare-cinofile",
    "/gare-pesca",
    "/gare-tiro",
    "/privacy-policy",
    "/cookie-policy",
  ];

  const staticXml = staticRoutes
    .map((route) => `<url><loc>${escapeXml(`${baseUrl}${route}`)}</loc><changefreq>weekly</changefreq></url>`)
    .join("");
  const newsXml = (data || [])
    .map((article: any) => {
      const lastmod = article.updated_at || article.created_at;
      return `<url><loc>${escapeXml(`${baseUrl}/news/${encodeURIComponent(article.slug)}`)}</loc><lastmod>${escapeXml(lastmod)}</lastmod><changefreq>weekly</changefreq></url>`;
    })
    .join("");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticXml}${newsXml}</urlset>`);
}

async function handleFeed(res: any) {
  const client = createClient(supabaseUrl, supabasePublishableKey);
  const { data, error } = await client
    .from("news")
    .select("title,slug,excerpt,content,category,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(30);
  assertNoError(error);

  const baseUrl = (process.env.PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
  const items = (data || [])
    .map((article: any) => {
      const link = `${baseUrl}/news/${encodeURIComponent(article.slug)}`;
      const description = article.excerpt || String(article.content || "").slice(0, 220);
      return `<item><title>${escapeXml(article.title)}</title><link>${escapeXml(link)}</link><guid isPermaLink="true">${escapeXml(link)}</guid><pubDate>${new Date(article.created_at).toUTCString()}</pubDate><description>${escapeXml(description)}</description><category>${escapeXml(article.category)}</category></item>`;
    })
    .join("");

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>ENAL Caccia Treviso - Notizie</title><link>${escapeXml(`${baseUrl}/news`)}</link><description>Feed RSS ufficiale delle notizie ENAL Caccia Treviso</description><language>it-IT</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>`);
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "OPTIONS") return res.status(204).end();

    const specialRoute = Array.isArray(req.query?.route) ? req.query.route[0] : req.query?.route;
    if (specialRoute === "sitemap") return await handleSitemap(res);
    if (specialRoute === "feed") return await handleFeed(res);
    if (specialRoute === "rss") {
      res.setHeader("Location", "/feed.xml");
      return res.status(301).end();
    }

    const method = String(req.method || "GET").toUpperCase();
    const path = normalizePath(req);
    const client = createRequestClient(req);

    if (method === "GET" && path === "/health") {
      return sendJson(res, 200, { ok: true, service: "enalcaccia-api" });
    }

    if (method === "GET" && path === "/news") {
      const { data, error } = await client
        .from("news")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      assertNoError(error);
      return sendJson(res, 200, (data || []).map(mapNews));
    }

    const publicNewsMatch = path.match(/^\/news\/(.+)$/);
    if (method === "GET" && publicNewsMatch) {
      const slug = decodeURIComponent(publicNewsMatch[1]);
      const { data, error } = await client
        .from("news")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Articolo non trovato.");
      return sendJson(res, 200, mapNews(data));
    }

    if (method === "GET" && path === "/competitions") {
      const { data, error } = await client
        .from("competitions")
        .select("*")
        .order("event_date", { ascending: true });
      assertNoError(error);
      return sendJson(res, 200, (data || []).map(mapCompetition));
    }

    const publicCompetitionMatch = path.match(/^\/competitions\/(\d+)$/);
    if (method === "GET" && publicCompetitionMatch) {
      const { data, error } = await client
        .from("competitions")
        .select("*")
        .eq("id", Number(publicCompetitionMatch[1]))
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Competizione non trovata.");
      return sendJson(res, 200, mapCompetition(data));
    }

    if (method === "GET" && path === "/memberships") {
      const { data, error } = await client
        .from("memberships")
        .select("*")
        .eq("active", true)
        .order("price", { ascending: true });
      assertNoError(error);
      return sendJson(res, 200, (data || []).map(mapMembership));
    }

    if (method === "GET" && path === "/magazines") {
      return sendJson(res, 200, [
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
    }

    if (method === "POST" && path === "/contacts") {
      const body = parseBody(req);
      const { data, error } = await client
        .from("contacts")
        .insert({
          name: body.name,
          email: body.email,
          subject: body.subject,
          message: body.message,
        })
        .select("*")
        .single();
      assertNoError(error);
      return sendJson(res, 201, { message: "Messaggio inviato con successo", contact: mapContact(data) });
    }

    if (method === "POST" && path === "/newsletter") {
      const body = parseBody(req);
      const { data, error } = await client
        .from("newsletter")
        .insert({ email: String(body.email || "").trim().toLowerCase() })
        .select("*")
        .single();
      if (error?.code === "23505") throw new ApiError(400, "Email già iscritta alla newsletter.");
      assertNoError(error);
      return sendJson(res, 201, { message: "Iscrizione alla newsletter completata", subscriber: data });
    }

    if (method === "GET" && path === "/user/profile") {
      const user = await requireUser(client);
      const [{ data: publicUser, error: userError }, { data: member, error: memberError }] = await Promise.all([
        client.from("users").select("id,email,role,created_at").eq("id", user.id).single(),
        client.from("members").select("*").eq("user_id", user.id).single(),
      ]);
      assertNoError(userError);
      assertNoError(memberError);
      return sendJson(res, 200, { ...publicUser, member });
    }

    if (method === "GET" && path === "/user/memberships") {
      const user = await requireUser(client);
      const { data, error } = await client
        .from("user_memberships")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      assertNoError(error);
      return sendJson(res, 200, data || []);
    }

    if (path.startsWith("/admin/")) await requireAdmin(client);

    if (method === "GET" && path === "/admin/stats") {
      const [approved, pending, contacts, memberships] = await Promise.all([
        client.from("members").select("id", { count: "exact", head: true }).eq("status", "approved"),
        client.from("members").select("id", { count: "exact", head: true }).eq("status", "pending"),
        client.from("contacts").select("id", { count: "exact", head: true }),
        client.from("memberships").select("id", { count: "exact", head: true }).eq("active", true),
      ]);
      [approved.error, pending.error, contacts.error, memberships.error].forEach(assertNoError);
      return sendJson(res, 200, {
        approvedUsers: approved.count || 0,
        pendingUsers: pending.count || 0,
        totalContacts: contacts.count || 0,
        totalMemberships: memberships.count || 0,
      });
    }

    if (method === "GET" && path === "/admin/pending-users") {
      const { data: members, error: membersError } = await client
        .from("members")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      assertNoError(membersError);

      const userIds = (members || []).map((member: any) => member.user_id);
      let profiles: any[] = [];
      if (userIds.length > 0) {
        const { data, error } = await client.from("users").select("id,email").in("id", userIds);
        assertNoError(error);
        profiles = data || [];
      }
      const emailById = new Map(profiles.map((profile: any) => [profile.id, profile.email]));

      return sendJson(
        res,
        200,
        (members || []).map((member: any) => ({
          id: member.id,
          firstName: member.name,
          lastName: member.surname,
          email: emailById.get(member.user_id) || "",
          phone: null,
          address: null,
          city: null,
          zipCode: null,
          dateOfBirth: member.birth_date,
          placeOfBirth: member.birth_place,
          fiscalCode: member.tax_code,
          membershipType: "base",
          notes: `Licenza: ${member.license_number || "da verificare"}`,
          pdfExtracted: false,
          createdAt: member.created_at,
        })),
      );
    }

    const approveMatch = path.match(/^\/admin\/approve-user\/(\d+)$/);
    if (method === "POST" && approveMatch) {
      const { data, error } = await client
        .from("members")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq("id", Number(approveMatch[1]))
        .select("*")
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Utente in attesa non trovato.");
      return sendJson(res, 200, { message: "Utente approvato", user: data });
    }

    const rejectMatch = path.match(/^\/admin\/reject-user\/(\d+)$/);
    if (method === "DELETE" && rejectMatch) {
      const { data, error } = await client
        .from("members")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .eq("id", Number(rejectMatch[1]))
        .select("id")
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Utente in attesa non trovato.");
      return sendJson(res, 200, { message: "Richiesta rifiutata" });
    }

    if (method === "GET" && path === "/admin/contacts") {
      const { data, error } = await client
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });
      assertNoError(error);
      return sendJson(res, 200, (data || []).map(mapContact));
    }

    if (method === "GET" && path === "/admin/news") {
      const { data, error } = await client.from("news").select("*").order("created_at", { ascending: false });
      assertNoError(error);
      return sendJson(res, 200, (data || []).map(mapNews));
    }

    if (method === "POST" && path === "/admin/news") {
      const body = parseBody(req);
      const { data, error } = await client.from("news").insert(newsPayload(body)).select("*").single();
      assertNoError(error);
      return sendJson(res, 201, mapNews(data));
    }

    const adminNewsMatch = path.match(/^\/admin\/news\/(\d+)$/);
    if (adminNewsMatch && method === "PUT") {
      const body = parseBody(req);
      const { data, error } = await client
        .from("news")
        .update(newsPayload(body))
        .eq("id", Number(adminNewsMatch[1]))
        .select("*")
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Articolo non trovato.");
      return sendJson(res, 200, mapNews(data));
    }
    if (adminNewsMatch && method === "DELETE") {
      const { data, error } = await client
        .from("news")
        .delete()
        .eq("id", Number(adminNewsMatch[1]))
        .select("id")
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Articolo non trovato.");
      return sendJson(res, 200, { message: "Articolo eliminato" });
    }

    if (method === "GET" && path === "/admin/competitions") {
      const { data, error } = await client.from("competitions").select("*").order("event_date", { ascending: true });
      assertNoError(error);
      return sendJson(res, 200, (data || []).map(mapCompetition));
    }

    if (method === "POST" && path === "/admin/competitions") {
      const body = parseBody(req);
      const { data, error } = await client
        .from("competitions")
        .insert(competitionPayload(body))
        .select("*")
        .single();
      assertNoError(error);
      return sendJson(res, 201, mapCompetition(data));
    }

    const adminCompetitionMatch = path.match(/^\/admin\/competitions\/(\d+)$/);
    if (adminCompetitionMatch && method === "PUT") {
      const body = parseBody(req);
      const { data, error } = await client
        .from("competitions")
        .update(competitionPayload(body))
        .eq("id", Number(adminCompetitionMatch[1]))
        .select("*")
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Competizione non trovata.");
      return sendJson(res, 200, mapCompetition(data));
    }
    if (adminCompetitionMatch && method === "DELETE") {
      const { data, error } = await client
        .from("competitions")
        .delete()
        .eq("id", Number(adminCompetitionMatch[1]))
        .select("id")
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Competizione non trovata.");
      return sendJson(res, 200, { message: "Competizione eliminata" });
    }

    throw new ApiError(404, "Endpoint non trovato.");
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Errore interno del server.";
    console.error("API error", { status, message });
    return sendJson(res, status, { message });
  }
}
