import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, queryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Clock, 
  IdCard, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  Plus,
  Trophy,
  Newspaper
} from "lucide-react";
import { PendingUser } from "@shared/schema";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user || user.role !== 'admin') {
    return <div>Access denied</div>;
  }

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: pendingUsers = [] } = useQuery<PendingUser[]>({
    queryKey: ["/api/admin/pending-users"],
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["/api/admin/contacts"],
  });

  const { data: news = [] } = useQuery({
    queryKey: ["/api/admin/news"],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/admin/approve-user/${id}`, {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Utente approvato",
        description: "L'utente è stato approvato con successo",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/reject-user/${id}`, {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Richiesta rifiutata",
        description: "La richiesta di registrazione è stata rifiutata",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Dashboard Amministratore
          </h1>
          <p className="text-gray-600">Gestisci utenti, contenuti e attività dell'associazione</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utenti Approvati</p>
                  <p className="text-2xl font-bold text-forest">{stats?.approvedUsers || 0}</p>
                </div>
                <div className="w-12 h-12 bg-forest bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-forest" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Richieste Pendenti</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats?.pendingUsers || 0}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tesseramenti Totali</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.totalMemberships || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <IdCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messaggi Contatti</p>
                  <p className="text-2xl font-bold text-blue-600">{stats?.contactMessages || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending-users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending-users">Richieste Utenti</TabsTrigger>
            <TabsTrigger value="news">Gestione News</TabsTrigger>
            <TabsTrigger value="competitions">Gare Cinofile</TabsTrigger>
            <TabsTrigger value="contacts">Messaggi</TabsTrigger>
          </TabsList>

          <TabsContent value="pending-users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Richieste di Registrazione Pendenti</CardTitle>
                    <CardDescription>Approva o rifiuta le nuove registrazioni</CardDescription>
                  </div>
                  <Badge variant="outline">{pendingUsers.length} in attesa</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nessuna richiesta in attesa</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Codice Fiscale</TableHead>
                        <TableHead>Data Richiesta</TableHead>
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.nome} {user.cognome}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.codiceFiscale}</TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString('it-IT')}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => approveMutation.mutate(user.id)}
                                disabled={approveMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approva
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectMutation.mutate(user.id)}
                                disabled={rejectMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rifiuta
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestione News e Articoli</CardTitle>
                    <CardDescription>Crea e modifica le notizie del sito</CardDescription>
                  </div>
                  <Button className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuovo Articolo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {news.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nessun articolo pubblicato</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titolo</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Autore</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Stato</TableHead>
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {news.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium">{article.titolo}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{article.categoria}</Badge>
                          </TableCell>
                          <TableCell>{article.autore}</TableCell>
                          <TableCell>
                            {new Date(article.data).toLocaleDateString('it-IT')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={article.pubblicato ? "default" : "secondary"}>
                              {article.pubblicato ? "Pubblicato" : "Bozza"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestione Gare Cinofile</CardTitle>
                    <CardDescription>Organizza e gestisci le competizioni</CardDescription>
                  </div>
                  <Button className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuova Gara
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Sezione gare cinofile in sviluppo</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Messaggi di Contatto</CardTitle>
                <CardDescription>Rispondi ai messaggi ricevuti</CardDescription>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nessun messaggio ricevuto</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Oggetto</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Stato</TableHead>
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.nome}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.oggetto}</TableCell>
                          <TableCell>
                            {new Date(contact.createdAt).toLocaleDateString('it-IT')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={contact.risposto ? "default" : "secondary"}>
                              {contact.risposto ? "Risposto" : "Nuovo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              Visualizza
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
