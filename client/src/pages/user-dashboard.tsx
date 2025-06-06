import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, CreditCard, Trophy, Settings, AlertCircle, CheckCircle } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Benvenuto, {user.nome} {user.cognome}
          </h1>
          <p className="text-muted-foreground">
            Gestisci il tuo profilo e accedi ai servizi di Enal Caccia
          </p>
        </div>

        {/* Account Status */}
        <div className="mb-8">
          {!user.isApproved ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Il tuo account è in attesa di approvazione da parte degli amministratori. 
                Riceverai una notifica via email una volta approvato.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-success bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Il tuo account è stato approvato! Puoi ora accedere a tutti i servizi.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profilo Utente</span>
              </CardTitle>
              <CardDescription>
                Informazioni del tuo account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Nome Completo</p>
                <p className="text-muted-foreground">{user.nome} {user.cognome}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Numero Licenza</p>
                <p className="text-muted-foreground">{user.numeroLicenza}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant={user.isApproved ? "default" : "secondary"}>
                  {user.isApproved ? "Approvato" : "In attesa"}
                </Badge>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Settings className="w-4 h-4 mr-2" />
                Modifica Profilo
              </Button>
            </CardContent>
          </Card>

          {/* Membership Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Tesseramento</span>
              </CardTitle>
              <CardDescription>
                Gestisci la tua tessera
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.isApproved ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      Non hai ancora una tessera attiva
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => setLocation("/membership")}
                    >
                      Acquista Tessera
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Disponibile dopo l'approvazione dell'account</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Competitions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Gare Cinofile</span>
              </CardTitle>
              <CardDescription>
                Partecipa alle competizioni
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.isApproved ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      Esplora le gare disponibili
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setLocation("/competitions")}
                    >
                      Vedi Gare
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Disponibile dopo l'approvazione dell'account</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Link Rapidi</CardTitle>
            <CardDescription>
              Accesso veloce alle sezioni principali
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setLocation("/news")}
              >
                <span className="text-lg">📰</span>
                <span>Ultime News</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setLocation("/competitions")}
              >
                <span className="text-lg">🏆</span>
                <span>Gare Cinofile</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setLocation("/membership")}
              >
                <span className="text-lg">🎫</span>
                <span>Tesseramento</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setLocation("/#contatti")}
              >
                <span className="text-lg">📞</span>
                <span>Contatti</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
