import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { User, IdCard, Trophy, Settings, LogOut } from "lucide-react";

export default function UserDashboard() {
  const { user, logoutMutation } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Benvenuto, {user.nome} {user.cognome}
          </h1>
          <p className="text-gray-600">Gestisci il tuo profilo e le tue attività</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle>Il Tuo Profilo</CardTitle>
                    <CardDescription>Informazioni personali e licenze</CardDescription>
                  </div>
                </div>
                <Badge variant={user.approved ? "default" : "secondary"}>
                  {user.approved ? "Approvato" : "In Attesa"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                  <p className="text-lg">{user.nome} {user.cognome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Codice Fiscale</p>
                  <p className="text-lg">{user.codiceFiscale}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Numero Licenza</p>
                  <p className="text-lg">{user.numeroLicenza}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <Button variant="outline" className="mr-4">
                  <Settings className="mr-2 h-4 w-4" />
                  Modifica Profilo
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Azioni Rapide</CardTitle>
              <CardDescription>Accesso veloce ai servizi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/membership">
                <Button className="w-full btn-primary">
                  <IdCard className="mr-2 h-4 w-4" />
                  Tesseramento
                </Button>
              </Link>
              <Link href="/competitions">
                <Button variant="outline" className="w-full">
                  <Trophy className="mr-2 h-4 w-4" />
                  Gare Cinofile
                </Button>
              </Link>
              <Link href="/news">
                <Button variant="outline" className="w-full">
                  News & Aggiornamenti
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Attività Recente</CardTitle>
            <CardDescription>Le tue ultime azioni e notifiche</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Account approvato</p>
                  <p className="text-sm text-gray-600">Il tuo account è stato approvato dall'amministratore</p>
                </div>
                <span className="text-sm text-gray-500">
                  {user.approvedAt ? new Date(user.approvedAt).toLocaleDateString('it-IT') : ''}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Registrazione completata</p>
                  <p className="text-sm text-gray-600">Benvenuto in Enal Caccia!</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('it-IT')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hai bisogno di aiuto?</CardTitle>
            <CardDescription>Contattaci per qualsiasi domanda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">Supporto Tecnico</h3>
                <p className="text-sm text-gray-600 mb-4">Per problemi con il sito o l'account</p>
                <Link href="/contact">
                  <Button variant="outline" size="sm">Contatta Supporto</Button>
                </Link>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">Informazioni Generali</h3>
                <p className="text-sm text-gray-600 mb-4">Per domande su servizi e attività</p>
                <Button variant="outline" size="sm">
                  <a href="tel:+390612345678">Chiama +39 06 1234567</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
