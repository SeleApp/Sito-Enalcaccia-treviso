import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { IdCard, User, CreditCard, Trophy, Settings } from "lucide-react";
import type { MembershipPurchase } from "@shared/schema";

export default function UserDashboard() {
  const { user } = useAuth();

  const { data: membershipPurchases } = useQuery<MembershipPurchase[]>({
    queryKey: ["/api/user/membership-purchases"],
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  const activeMemberships = membershipPurchases?.filter(p => p.status === "completed") || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Dashboard Utente
            </h1>
            <p className="text-muted-foreground">
              Benvenuto, {user.nome} {user.cognome}
            </p>
          </div>

          {/* User Info Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informazioni Personali
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-foreground">{user.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cognome</p>
                    <p className="text-foreground">{user.cognome}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Numero Licenza</p>
                    <p className="text-foreground">{user.numeroLicenza}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Codice Fiscale</p>
                  <p className="text-foreground">{user.codiceFiscale}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Azioni Rapide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/membership">
                  <Button className="w-full" variant="outline">
                    <IdCard className="w-4 h-4 mr-2" />
                    Tesseramento
                  </Button>
                </Link>
                <Link href="/competitions">
                  <Button className="w-full" variant="outline">
                    <Trophy className="w-4 h-4 mr-2" />
                    Gare Cinofile
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button className="w-full" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Modifica Profilo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Membership Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Tesseramenti Attivi
                </CardTitle>
                <CardDescription>
                  Le tue tessere attualmente valide
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeMemberships.length > 0 ? (
                  <div className="space-y-4">
                    {activeMemberships.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">Tessera #{purchase.membershipId}</p>
                          <p className="text-sm text-muted-foreground">
                            Acquistata il {new Date(purchase.createdAt!).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                        <Badge variant="default">Attiva</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Non hai tessere attive al momento
                    </p>
                    <Link href="/membership">
                      <Button>Acquista Tessera</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiche Personali</CardTitle>
                <CardDescription>
                  Riepilogo delle tue attività
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tessere acquistate</span>
                  <span className="font-semibold">{activeMemberships.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Account attivo da</span>
                  <span className="font-semibold">
                    {new Date(user.createdAt!).toLocaleDateString('it-IT')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Stato account</span>
                  <Badge variant={user.approved ? "default" : "secondary"}>
                    {user.approved ? "Approvato" : "In attesa"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
