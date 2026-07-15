import { createClient } from "@supabase/supabase-js";
import handler from "./index";

const DEFAULT_SUPABASE_URL = "https://xunvrmahefvawvydpcom.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_MkHxO9yaa8Iw8N6KKwsE8A_ecjkkmfT";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabasePublishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

function normalizePath(req: any): string {
  const rawPath = req.query?.path;
  if (Array.isArray(rawPath)) return `/${rawPath.join("/")}`;
  if (typeof rawPath === "string" && rawPath.length > 0) {
    return `/${rawPath.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  }
  return "/";
}

function parseBody(req: any): Record<string, any> {
  if (!req.body) return {};
  if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;

  const text = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
  return JSON.parse(text);
}

function createRequestClient(req: any) {
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

export default async function router(req: any, res: any) {
  const path = normalizePath(req);
  const method = String(req.method || "GET").toUpperCase();

  if (method === "POST" && path === "/contacts") {
    try {
      const body = parseBody(req);
      const client = createRequestClient(req);
      const { error } = await client.from("contacts").insert({
        name: String(body.name || "").trim(),
        email: String(body.email || "").trim().toLowerCase(),
        subject: String(body.subject || "").trim(),
        message: String(body.message || "").trim(),
      });

      if (error) return res.status(400).json({ message: error.message });
      return res.status(201).json({ message: "Messaggio inviato con successo" });
    } catch {
      return res.status(400).json({ message: "Dati del messaggio non validi." });
    }
  }

  if (method === "POST" && path === "/newsletter") {
    try {
      const body = parseBody(req);
      const client = createRequestClient(req);
      const { error } = await client.from("newsletter").insert({
        email: String(body.email || "").trim().toLowerCase(),
      });

      if (error?.code === "23505") {
        return res.status(400).json({ message: "Email già iscritta alla newsletter." });
      }
      if (error) return res.status(400).json({ message: error.message });
      return res.status(201).json({ message: "Iscrizione alla newsletter completata" });
    } catch {
      return res.status(400).json({ message: "Email non valida." });
    }
  }

  return handler(req, res);
}
