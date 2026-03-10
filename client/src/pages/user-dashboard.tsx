import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { PendingApprovalState } from "@/components/pending-approval-state";
import { FileText, RefreshCw, ReceiptText, UserCircle2 } from "lucide-react";

function PlaceholderPanel({
  title,
  description,
  emptyText,
  icon: Icon,
}: {
  title: string;
  description: string;
  emptyText: string;
  icon: typeof FileText;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground">
          {emptyText}
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div className="min-h-screen" />;
  }

  if (user.status === "pending") {
    return <PendingApprovalState fullName={user.fullName} email={user.email} />;
  }

  return (
    <div className="page-shell">
      <div className="page-wrap py-10 space-y-8">
        <div className="space-y-3">
          <h1 className="page-title">Area Soci</h1>
          <p className="section-subtitle">Benvenuto, {user.fullName}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-primary" />
              Dati account
            </CardTitle>
            <CardDescription>
              Informazioni principali del tuo profilo socio.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome e cognome</p>
              <p className="font-medium">{user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stato account</p>
              <Badge className="mt-1" variant="secondary">
                {user.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ruolo</p>
              <p className="font-medium">{user.role}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PlaceholderPanel
            title="Documenti"
            description="Archivio documentale personale"
            emptyText="Nessun documento disponibile al momento. Qui troverai tessere, ricevute e allegati caricati dall'amministrazione."
            icon={FileText}
          />

          <PlaceholderPanel
            title="Richieste"
            description="Storico richieste e pratiche"
            emptyText="Non ci sono richieste aperte. In questa sezione compariranno le tue pratiche inviate e il loro avanzamento."
            icon={ReceiptText}
          />

          <PlaceholderPanel
            title="Rinnovi"
            description="Gestione rinnovi annuali"
            emptyText="Nessun rinnovo in scadenza. Quando sara' disponibile il prossimo rinnovo, troverai qui i dettagli operativi."
            icon={RefreshCw}
          />
        </div>
      </div>
    </div>
  );
}
