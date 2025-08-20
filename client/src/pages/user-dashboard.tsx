import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { User, CreditCard, Trophy, Calendar, Settings } from "lucide-react";
import type { UserMembership, User as UserType } from "@shared/schema";

export default function UserDashboard() {
  const { user } = useAuth();

  const { data: userProfile } = useQuery<UserType>({
    queryKey: ["/api/user/profile"],
  });

  const { data: userMemberships = [] } = useQuery<UserMembership[]>({
    queryKey: ["/api/user/memberships"],
  });

  if (!user) {
    return null; // This should be handled by ProtectedRoute
  }

  const activeMemberships = userMemberships.filter(m => 
    m.status === 'paid' && new Date(m.expiresAt) > new Date()
  );

  return (
    <div className="bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Benvenuto, {user.nome} {user.cognome}
          </h1>
          <p className="text-muted-foreground">
            Gestisci il tuo profilo e i tuoi tesseramenti
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profilo</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gestisci</div>
              <p className="text-xs text-muted-foreground">
                Aggiorna i tuoi dati personali
              </p>
            </CardContent>
          </Card>

          <Link href="/membership">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tesseramento</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rinnova</div>
                <p className="text-xs text-muted-foreground">
                  Acquista o rinnova la tessera
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/competitions">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gare</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Partecipa</div>
                <p className="text-xs text-muted-foreground">
                  Iscriviti alle gare cinofile
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventi</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Calendario</div>
              <p className="text-xs text-muted-foreground">
                Visualizza prossimi eventi
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informazioni Profilo
              </CardTitle>
              <CardDescription>
                I tuoi dati personali registrati
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProfile && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-base">{userProfile.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cognome</p>
                    <p className="text-base">{userProfile.cognome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base">{userProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Codice Fiscale</p>
                    <p className="text-base">{userProfile.codiceFiscale}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Numero Licenza</p>
                    <p className="text-base">{userProfile.numeroLicenza}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data di Nascita</p>
                    <p className="text-base">
                      {new Date(userProfile.dataNascita).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                </div>
              )}
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Modifica Profilo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Membership Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Stato Tesseramento
              </CardTitle>
              <CardDescription>
                Le tue tessere attive e scadute
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeMemberships.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Non hai tessere attive al momento
                  </p>
                  <Link href="/membership">
                    <Button>Acquista Tessera</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeMemberships.map((membership) => (
                    <div key={membership.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Tessera Premium</p>
                          <p className="text-sm text-muted-foreground">
                            Scade il {new Date(membership.expiresAt).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                        <Badge variant="default">Attiva</Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Pagato: €{(membership.amount / 100).toFixed(2)}</span>
                        <span className="text-muted-foreground">
                          {new Date(membership.paidAt || '').toLocaleDateString('it-IT')}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <Link href="/membership">
                      <Button variant="outline" className="w-full">
                        Rinnova o Aggiorna Tessera
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Attività Recente</CardTitle>
            <CardDescription>
              Le tue ultime azioni e partecipazioni
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Nessuna attività recente da mostrare</p>
              <p className="text-sm mt-2">
                Partecipa alle gare cinofile o acquista una tessera per vedere la tua attività qui
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
