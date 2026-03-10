import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock3, MailCheck } from "lucide-react";

type PendingApprovalStateProps = {
  fullName: string;
  email: string;
};

export function PendingApprovalState({ fullName, email }: PendingApprovalStateProps) {
  return (
    <div className="page-shell">
      <div className="page-wrap py-16">
        <Card className="max-w-2xl mx-auto border-amber-200 shadow-sm">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock3 className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <CardTitle className="text-2xl">Richiesta in attesa di approvazione</CardTitle>
                <CardDescription className="mt-1">
                  Registrazione inviata con successo. La tua richiesta e' in attesa di approvazione da parte dell'amministrazione.
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit bg-amber-100 text-amber-800 hover:bg-amber-100">
              Stato account: pending
            </Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Utente</p>
              <p className="font-medium text-base">{fullName}</p>
              <p className="text-sm text-muted-foreground mt-2">Email</p>
              <p className="font-medium text-base">{email}</p>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <MailCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Cosa succede ora</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Il team verifichera' la tua richiesta. Quando lo stato passera' ad approved, potrai accedere all'area soci completa.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
