import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { User, CreditCard, Trophy, Settings, Calendar, Mail } from "lucide-react";
import { useState } from "react";

export default function UserDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    toast({
      title: "Profilo aggiornato",
      description: "Le tue informazioni sono state salvate con successo."
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard Utente</h1>
          <p className="text-muted-foreground mt-2">Benvenuto, {user?.nome} {user?.cognome}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/membership">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Tesseramento</h3>
                <p className="text-sm text-muted-foreground">Rinnova o acquista la tua tessera</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/competitions">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Gare Cinofile</h3>
                <p className="text-sm text-muted-foreground">Partecipa alle competizioni</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/contact">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Contatti</h3>
                <p className="text-sm text-muted-foreground">Scrivi all'associazione</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profilo
                </TabsTrigger>
                <TabsTrigger value="memberships" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  I Miei Tesseramenti
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <div className="max-w-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Informazioni Personali</h3>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Annulla" : "Modifica"}
                    </Button>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome</Label>
                        <Input
                          id="nome"
                          name="nome"
                          defaultValue={user?.nome}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cognome">Cognome</Label>
                        <Input
                          id="cognome"
                          name="cognome"
                          defaultValue={user?.cognome}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          defaultValue={user?.email}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dataNascita">Data di Nascita</Label>
                        <Input
                          id="dataNascita"
                          name="dataNascita"
                          type="date"
                          defaultValue={user?.dataNascita}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="luogoNascita">Luogo di Nascita</Label>
                      <Input
                        id="luogoNascita"
                        name="luogoNascita"
                        defaultValue={user?.luogoNascita}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codiceFiscale">Codice Fiscale</Label>
                        <Input
                          id="codiceFiscale"
                          name="codiceFiscale"
                          defaultValue={user?.codiceFiscale}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="numeroLicenza">Numero Licenza</Label>
                        <Input
                          id="numeroLicenza"
                          name="numeroLicenza"
                          defaultValue={user?.numeroLicenza}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Annulla
                        </Button>
                        <Button type="submit">
                          Salva Modifiche
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="memberships" className="mt-6">
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nessun tesseramento attivo</h3>
                  <p className="text-muted-foreground mb-4">
                    Non hai ancora acquistato nessuna tessera. Scopri i nostri piani di tesseramento.
                  </p>
                  <Link href="/membership">
                    <Button>Acquista Tessera</Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
