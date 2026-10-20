import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/seo-head";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, KeyRound, Loader2, ShieldCheck } from "lucide-react";

/**
 * Configurazione iniziale della password dopo un invito Supabase Auth.
 * La sessione è ottenuta SOLO dal link d'invito inviato alla casella email:
 * nessuna possibilità di creare autonomamente privilegi amministrativi.
 */
export default function ActivateAccountPage() {
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    const checkSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!live) return;
      setHasSession(Boolean(data.session));
      setLoading(false);
      if (sessionError) setError("Il collegamento non è valido. Richiedi un nuovo invito alla segreteria.");
    };
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!live) return;
      if (session) {
        setHasSession(true);
        setLoading(false);
        setError("");
      }
    });
    void checkSession();
    return () => {
      live = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const savePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    setError("");
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("La password deve contenere almeno 8 caratteri, una lettera e un numero.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Le due password non corrispondono.");
      return;
    }
    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setPassword("");
      setConfirmPassword("");
      setCompleted(true);
    } catch {
      setError("Non è stato possibile salvare la password. Riapri il link d'invito o contatta la segreteria.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <SEOHead
        title="Attiva il tuo account"
        description="Completa l'attivazione dell'account Enalcaccia Treviso in sicurezza."
        url="https://www.enalcacciatv.it/attiva-account"
        noIndex
      />
      <Card className="border-forest/20 shadow-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <ShieldCheck className="h-9 w-9 text-forest" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold tracking-wide text-forest">ENALCACCIA TREVISO</p>
          <CardTitle className="font-serif text-2xl sm:text-3xl">Attivazione account</CardTitle>
          <CardDescription className="text-base">
            Completa l'attivazione del tuo accesso. Questa pagina è riservata
            a chi ha ricevuto un invito via email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-8 text-base">
              <Loader2 className="h-6 w-6 animate-spin" />
              Verifica del collegamento in corso…
            </div>
          ) : completed ? (
            <div className="space-y-5 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-700" />
              <h2 className="text-xl font-semibold">Password impostata correttamente</h2>
              <p className="text-base leading-7">
                Ora puoi accedere a Enalcaccia Treviso. Se l'accesso amministrativo
                non è ancora abilitato, contatta la segreteria.
              </p>
              <Button asChild size="lg"><Link href="/auth">Vai all'accesso</Link></Button>
            </div>
          ) : !hasSession ? (
            <div className="space-y-4 text-center">
              <p className="text-base leading-7">
                Il collegamento è scaduto o non è valido. Apri il link contenuto
                nell'invito ricevuto via email. Se il problema persiste,
                richiedi un nuovo invito.
              </p>
              <Button variant="outline" asChild><Link href="/auth">Torna al sito</Link></Button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={savePassword}>
              <div className="space-y-2">
                <Label htmlFor="new-account-password" className="text-base">Scegli una password</Label>
                <Input
                  id="new-account-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 text-base"
                  required
                  minLength={8}
                />
                <p className="text-sm text-muted-foreground">Almeno 8 caratteri, una lettera e un numero.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-account-password" className="text-base">Ripeti la password</Label>
                <Input
                  id="confirm-account-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-12 text-base"
                  required
                  minLength={8}
                />
              </div>
              {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-base text-red-800" role="alert">{error}</p>}
              <Button className="h-12 w-full text-base" type="submit" disabled={saving}>
                <KeyRound className="mr-2 h-5 w-5" aria-hidden="true" />
                {saving ? "Salvataggio in corso…" : "Attiva il mio account"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
