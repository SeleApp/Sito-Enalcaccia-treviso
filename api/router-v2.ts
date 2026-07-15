import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://xunvrmahefvawvydpcom.supabase.co";

const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_MkHxO9yaa8Iw8N6KKwsE8A_ecjkkmfT";

const SITE_URL = (process.env.PUBLIC_SITE_URL || "https://www.enalcacciatv.it").replace(/\/$/, "");

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function createRequestClient(req: any): SupabaseClient {
  const raw = req.headers?.authorization;
  const authorization = Array.isArray(raw) ? raw[0] : raw;
  const headers: Record<string, string> = {};

  if (typeof authorization === "string" && authorization.length > 0) {
    headers.Authorization = authorization;
  }

  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { headers },
  });
}

function createPublicClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
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

function parseBody(req: any): Record<string, any> {
  if (!req.body) return {};
  if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;

  const raw = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
  try {
    return JSON.parse(raw);
  } catch {
    throw new ApiError(400, "Corpo della richiesta non valido.");
  }
}

function sendJson(res: any, status: number, payload: unknown) {
  return res.status(status).json(payload);
}

function assertNoError(error: any, fallback = "Errore database.") {
  if (error) throw new ApiError(500, error.message || fallback);
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
    id: Number(row.id),
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

function newsPayload(body: Record<string, any>) {
  return {
    title: String(body.title || "").trim(),
    slug: String(body.slug || "").trim(),
    content: String(body.content || "").trim(),
    excerpt: String(body.excerpt || "").trim(),
    featured_image: body.featuredImage || null,
    category: String(body.category || "").trim(),
    published: body.published ?? true,
    updated_at: new Date().toISOString(),
  };
}

function mapCompetition(row: any) {
  return {
    id: Number(row.id),
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

function competitionPayload(body: Record<string, any>) {
  return {
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    discipline: String(body.discipline || "").trim(),
    location: String(body.location || "").trim(),
    event_date: body.eventDate,
    cost: Number(body.cost || 0),
    bando_url: body.bandoUrl || null,
    max_participants: body.maxParticipants == null ? null : Number(body.maxParticipants),
    registered_participants: Number(body.registeredParticipants || 0),
    registration_deadline: body.registrationDeadline,
  };
}

function mapMembership(row: any) {
  return {
    id: Number(row.id),
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
    id: Number(row.id),
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    replied: row.replied,
    createdAt: row.created_at,
  };
}

function escapeXml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function handleSitemap(res: any) {
  const client = createPublicClient();
  const { data, error } = await client
    .from("news")
    .select("slug,updated_at,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });
  assertNoError(error);

  const routes = [
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

  const staticXml = routes
    .map((route) => `<url><loc>${escapeXml(`${SITE_URL}${route}`)}</loc><changefreq>weekly</changefreq></url>`)
    .join("");

  const newsXml = (data || [])
    .map((article: any) => {
      const lastmod = article.updated_at || article.created_at;
      return `<url><loc>${escapeXml(`${SITE_URL}/news/${encodeURIComponent(article.slug)}`)}</loc><lastmod>${escapeXml(lastmod)}</lastmod><changefreq>weekly</changefreq></url>`;
    })
    .join("");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticXml}${newsXml}</urlset>`);
}

async function handleFeed(res: any) {
  const client = createPublicClient();
  const { data, error } = await client
    .from("news")
    .select("title,slug,excerpt,content,category,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(30);
  assertNoError(error);

  const items = (data || [])
    .map((article: any) => {
      const link = `${SITE_URL}/news/${encodeURIComponent(article.slug)}`;
      const description = article.excerpt || String(article.content || "").slice(0, 220);
      return `<item><title>${escapeXml(article.title)}</title><link>${escapeXml(link)}</link><guid isPermaLink="true">${escapeXml(link)}</guid><pubDate>${new Date(article.created_at).toUTCString()}</pubDate><description>${escapeXml(description)}</description><category>${escapeXml(article.category)}</category></item>`;
    })
    .join("");

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>ENAL Caccia Treviso - Notizie</title><link>${escapeXml(`${SITE_URL}/news`)}</link><description>Feed RSS ufficiale delle notizie ENAL Caccia Treviso</description><language>it-IT</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>`);
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

    if (method === "GET" && path === "/news") {
      const { data, error } = await client
        .from("news")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      assertNoError(error);
      return sendJson(res, 200, (data || []).map(mapNews));
    }

    const newsMatch = path.match(/^\/news\/(.+)$/);
    if (method === "GET" && newsMatch) {
      const { data, error } = await client
        .from("news")
        .select("*")
        .eq("slug", decodeURIComponent(newsMatch[1]))
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

    const competitionMatch = path.match(/^\/competitions\/(\d+)$/);
    if (method === "GET" && competitionMatch) {
      const { data, error } = await client
        .from("competitions")
        .select("*")
        .eq("id", Number(competitionMatch[1]))
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
      const { error } = await client.from("contacts").insert({
        name: String(body.name || "").trim(),
        email: String(body.email || "").trim().toLowerCase(),
        subject: String(body.subject || "").trim(),
        message: String(body.message || "").trim(),
      });
      if (error) throw new ApiError(400, error.message);
      return sendJson(res, 201, { message: "Messaggio inviato con successo" });
    }

    if (method === "POST" && path === "/newsletter") {
      const body = parseBody(req);
      const { error } = await client.from("newsletter").insert({
        email: String(body.email || "").trim().toLowerCase(),
      });
      if (error?.code === "23505") throw new ApiError(400, "Email già iscritta alla newsletter.");
      if (error) throw new ApiError(400, error.message);
      return sendJson(res, 201, { message: "Iscrizione alla newsletter completata" });
    }

    if (method === "GET" && path === "/user/profile") {
      const user = await requireUser(client);
      const [{ data: profile, error: profileError }, { data: member, error: memberError }] = await Promise.all([
        client.from("users").select("id,email,role,created_at").eq("id", user.id).single(),
        client.from("members").select("*").eq("user_id", user.id).single(),
      ]);
      assertNoError(profileError);
      assertNoError(memberError);
      return sendJson(res, 200, { ...profile, member });
    }

    if (method === "GET" && path === "/user/memberships") {
      const user = await requireUser(client);
      const { data, error } = await client
        .from("user_memberships")
        .select("*, memberships(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      assertNoError(error);
      return sendJson(res, 200, data || []);
    }

    if (method === "POST" && path === "/create-payment-intent") {
      throw new ApiError(503, "Pagamento online non ancora configurato.");
    }

    if (method === "POST" && path === "/confirm-payment") {
      throw new ApiError(503, "Pagamento online non ancora configurato.");
    }

    if (path.startsWith("/admin/")) {
      await requireAdmin(client);
    }

    if (method === "GET" && path === "/admin/stats") {
      const [membersResult, contactsResult, membershipsResult] = await Promise.all([
        client.from("members").select("status"),
        client.from("contacts").select("id"),
        client.from("memberships").select("id"),
      ]);
      assertNoError(membersResult.error);
      assertNoError(contactsResult.error);
      assertNoError(membershipsResult.error);
      const memberRows = membersResult.data || [];
      return sendJson(res, 200, {
        approvedUsers: memberRows.filter((row: any) => row.status === "approved").length,
        pendingUsers: memberRows.filter((row: any) => row.status === "pending").length,
        totalContacts: (contactsResult.data || []).length,
        totalMemberships: (membershipsResult.data || []).length,
      });
    }

    if (method === "GET" && path === "/admin/pending-users") {
      const { data: members, error: memberError } = await client
        .from("members")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      assertNoError(memberError);

      const ids = (members || []).map((row: any) => row.user_id);
      const { data: users, error: userError } = ids.length
        ? await client.from("users").select("id,email").in("id", ids)
        : { data: [], error: null };
      assertNoError(userError);
      const emails = new Map((users || []).map((row: any) => [row.id, row.email]));

      return sendJson(
        res,
        200,
        (members || []).map((row: any) => ({
          id: Number(row.id),
          userId: row.user_id,
          firstName: row.name,
          lastName: row.surname,
          email: emails.get(row.user_id) || "",
          phone: null,
          address: null,
          city: null,
          zipCode: null,
          dateOfBirth: row.birth_date,
          placeOfBirth: row.birth_place,
          fiscalCode: row.tax_code,
          membershipType: "base",
          notes: row.license_number ? `Licenza: ${row.license_number}` : null,
          pdfExtracted: false,
          createdAt: row.created_at,
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
      return sendJson(res, 200, { message: "Utente approvato con successo", user: data });
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

    if (method === "GET" && path === "/admin/news") {
      const { data, error } = await client.from("news").select("*").order("created_at", { ascending: false });
      assertNoError(error);
      return sendJson(res, 200, (data || []).map(mapNews));
    }

    if (method === "POST" && path === "/admin/news") {
      const { data, error } = await client.from("news").insert(newsPayload(parseBody(req))).select("*").single();
      if (error) throw new ApiError(400, error.message);
      return sendJson(res, 201, mapNews(data));
    }

    const adminNewsMatch = path.match(/^\/admin\/news\/(\d+)$/);
    if (method === "PUT" && adminNewsMatch) {
      const { data, error } = await client
        .from("news")
        .update(newsPayload(parseBody(req)))
        .eq("id", Number(adminNewsMatch[1]))
        .select("*")
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Articolo non trovato.");
      return sendJson(res, 200, mapNews(data));
    }

    if (method === "DELETE" && adminNewsMatch) {
      const { data, error } = await client
        .from("news")
        .delete()
        .eq("id", Number(adminNewsMatch[1]))
        .select("id")
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Articolo non trovato.");
      return sendJson(res, 200, { message: "Articolo eliminato con successo" });
    }

    if (method === "GET" && path === "/admin/competitions") {
      const { data, error } = await client
        .from("competitions")
        .select("*")
        .order("event_date", { ascending: true });
      assertNoError(error);
      return sendJson(res, 200, (data || []).map(mapCompetition));
    }

    if (method === "POST" && path === "/admin/competitions") {
      const { data, error } = await client
        .from("competitions")
        .insert(competitionPayload(parseBody(req)))
        .select("*")
        .single();
      if (error) throw new ApiError(400, error.message);
      return sendJson(res, 201, mapCompetition(data));
    }

    const adminCompetitionMatch = path.match(/^\/admin\/competitions\/(\d+)$/);
    if (method === "PUT" && adminCompetitionMatch) {
      const { data, error } = await client
        .from("competitions")
        .update(competitionPayload(parseBody(req)))
        .eq("id", Number(adminCompetitionMatch[1]))
        .select("*")
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Competizione non trovata.");
      return sendJson(res, 200, mapCompetition(data));
    }

    if (method === "DELETE" && adminCompetitionMatch) {
      const { data, error } = await client
        .from("competitions")
        .delete()
        .eq("id", Number(adminCompetitionMatch[1]))
        .select("id")
        .maybeSingle();
      assertNoError(error);
      if (!data) throw new ApiError(404, "Competizione non trovata.");
      return sendJson(res, 200, { message: "Competizione eliminata con successo" });
    }

    if (method === "GET" && path === "/admin/contacts") {
      const { data, error } = await client
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });
      assertNoError(error);
      return sendJson(res, 200, (data || []).map(mapContact));
    }

    throw new ApiError(404, "Endpoint non trovato.");
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Errore imprevisto.";
    return sendJson(res, status, { message });
  }
}
