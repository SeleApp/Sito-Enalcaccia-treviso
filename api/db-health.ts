import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://xunvrmahefvawvydpcom.supabase.co";
const supabaseKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_MkHxO9yaa8Iw8N6KKwsE8A_ecjkkmfT";

export default async function handler(_req: any, res: any) {
  try {
    const client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { error } = await client.from("news").select("id").limit(1);
    if (error) {
      return res.status(500).json({ ok: false, service: "supabase", message: error.message });
    }

    return res.status(200).json({ ok: true, service: "supabase" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore Supabase non identificato";
    return res.status(500).json({ ok: false, service: "supabase", message });
  }
}
