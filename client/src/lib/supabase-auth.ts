import { AuthError, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type MemberStatus = "pending" | "approved" | "rejected";

export type PublicUserRow = {
  id: string;
  email: string;
  role: string;
  created_at?: string;
};

export type MemberRow = {
  user_id: string;
  name: string;
  surname: string;
  birth_date: string;
  birth_place: string;
  tax_code: string;
  license_number: string;
  status: MemberStatus;
  created_at?: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  surname: string;
  birthDate: string;
  birthPlace: string;
  taxCode: string;
  licenseNumber: string;
};

export type ResolvedAuthProfile = {
  authUser: User;
  publicUser: PublicUserRow;
  member: MemberRow;
};

function normalizeAuthError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error("Si e' verificato un errore imprevisto.");
}

export async function signOutSupabase(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw normalizeAuthError(error);
}

export async function registerWithSupabase(payload: RegisterPayload): Promise<{ message: string }> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
  });

  if (authError) {
    throw normalizeAuthError(authError);
  }

  const authUserId = authData.user?.id;
  if (!authUserId) {
    throw new Error("Impossibile completare la registrazione in questo momento.");
  }

  const { error: userInsertError } = await supabase.from("users").upsert(
    {
      id: authUserId,
      email: payload.email,
      role: "member",
    },
    { onConflict: "id" },
  );

  if (userInsertError) {
    throw normalizeAuthError(userInsertError);
  }

  const { error: memberInsertError } = await supabase.from("members").insert({
    user_id: authUserId,
    name: payload.name,
    surname: payload.surname,
    birth_date: payload.birthDate,
    birth_place: payload.birthPlace,
    tax_code: payload.taxCode,
    license_number: payload.licenseNumber,
    status: "pending",
  });

  if (memberInsertError) {
    throw normalizeAuthError(memberInsertError);
  }

  return {
    message:
      "Registrazione inviata con successo. La tua richiesta e' in attesa di approvazione da parte dell'amministrazione.",
  };
}

export async function signInWithSupabase(email: string, password: string): Promise<ResolvedAuthProfile> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw normalizeAuthError(error);
  if (!data.user) throw new Error("Login non completato. Riprova.");

  return resolveUserProfile(data.user);
}

export async function getSessionUser(): Promise<ResolvedAuthProfile | null> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw normalizeAuthError(error);
  if (!session?.user) return null;

  return resolveUserProfile(session.user);
}

export async function resolveUserProfile(authUser: User): Promise<ResolvedAuthProfile> {
  const userId = authUser.id;

  const [{ data: publicUser, error: userError }, { data: member, error: memberError }] = await Promise.all([
    supabase
      .from("users")
      .select("id,email,role,created_at")
      .eq("id", userId)
      .maybeSingle<PublicUserRow>(),
    supabase
      .from("members")
      .select("user_id,name,surname,birth_date,birth_place,tax_code,license_number,status,created_at")
      .eq("user_id", userId)
      .maybeSingle<MemberRow>(),
  ]);

  if (userError) throw normalizeAuthError(userError);
  if (memberError) throw normalizeAuthError(memberError);

  if (!publicUser) {
    throw new Error("Profilo utente non trovato in public.users.");
  }

  if (!member) {
    throw new Error("Record socio non trovato in public.members. Contatta l'amministrazione.");
  }

  return {
    authUser,
    publicUser,
    member,
  };
}

export function getReadableAuthError(error: unknown): string {
  if (error instanceof AuthError) {
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      return "Email o password non corretti.";
    }
    return error.message;
  }

  if (error instanceof Error) return error.message;
  return "Operazione non riuscita. Riprova tra qualche minuto.";
}
