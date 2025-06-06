import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Clock, CreditCard, Mail, UserCheck, UserX, Trash2, Eye } from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect if not admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Accesso non autorizzato</h1>
            <p className="text-gray-600 mt-2">Non hai i permessi per accedere a questa pagina.</p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  // Fetch pending users
  const { data: pendingUsers = [] } = useQuery({
    queryKey: ["/api/admin/pending-users"],
  });

  // Fetch all news for admin
  const { data: allNews = [] } = useQuery({
    queryKey: ["/api/admin/news"],
  });

  // Fetch all competitions for admin
  const { data: allCompetitions = [] } = useQuery({
    queryKey: ["/api/admin/competitions"],
  });

  // Fetch all contacts
  const { data: contacts = [] } = useQuery({
    queryKey: ["/api/admin/contacts"],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/admin/approve-user/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Utente approvato",
        description: "L'utente è stato approvato con successo.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'approvazione dell'utente.",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/pending-users/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Richiesta rifiutata",
        description: "La richiesta di registrazione è stata rifiutata.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nel rifiuto della richiesta.",
        variant: "destructive",
      });
    },
  });

  const markContactRespondedMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", `/api/admin/contacts/${id}/respond`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Contatto aggiornato",
        description: "Il contatto è stato marcato come risposto.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Dashboard Amministrativo</h1>
          <p className="text-gray-600">Benvenuto, {user?.nome} {user?.cognome}</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Utenti Approvati</p>
                    <p className="text-2xl font-bold text-primary">{stats.approvedUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="text-primary h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Richieste Pendenti</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="text-yellow-600 h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tesseramenti Totali</p>
                    <p className="text-2xl font-bold text-green-600">{stats.totalMemberships}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-green-600 h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Messaggi Contatti</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.contactMessages}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="text-blue-600 h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Management Tabs */}
        <Tabs defaultValue="pending-users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending-users">Richieste Utenti</TabsTrigger>
            <TabsTrigger value="news">Articoli</TabsTrigger>
            <TabsTrigger value="competitions">Gare</TabsTrigger>
            <TabsTrigger value="contacts">Contatti</TabsTrigger>
            <TabsTrigger value="overview">Panoramica</TabsTrigger>
          </TabsList>

          <TabsContent value="pending-users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Richieste di Registrazione in Attesa</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nessuna richiesta in attesa</p>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((user: any) => (
                      <div key={user.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{user.nome} {user.cognome}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-500">
                              CF: {user.codiceFiscale} | Licenza: {user.numeroLicenza}
                            </p>
                            <p className="text-sm text-gray-500">
                              Nato a {user.luogoNascita} il {new Date(user.dataNascita).toLocaleDateString('it-IT')}
                            </p>
                            <p className="text-xs text-gray-400">
                              Richiesta inviata il {new Date(user.createdAt).toLocaleDateString('it-IT')}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => approveMutation.mutate(user.id)}
                              disabled={approveMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Approva
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectMutation.mutate(user.id)}
                              disabled={rejectMutation.isPending}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Rifiuta
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestione Articoli</CardTitle>
                  <Button>Nuovo Articolo</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titolo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Creazione</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allNews.map((article: any) => (
                      <TableRow key={article.id}>
                        <TableCell>{article.title}</TableCell>
                        <TableCell>
                          <Badge variant={article.published ? "default" : "secondary"}>
                            {article.published ? "Pubblicato" : "Bozza"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(article.createdAt).toLocaleDateString('it-IT')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              Modifica
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestione Gare Cinofile</CardTitle>
                  <Button>Nuova Gara</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titolo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Luogo</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Costo</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allCompetitions.map((competition: any) => (
                      <TableRow key={competition.id}>
                        <TableCell>{competition.title}</TableCell>
                        <TableCell>{new Date(competition.date).toLocaleDateString('it-IT')}</TableCell>
                        <TableCell>{competition.location}</TableCell>
                        <TableCell>
                          <Badge>{competition.discipline}</Badge>
                        </TableCell>
                        <TableCell>€{competition.cost}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Modifica
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Messaggi di Contatto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.map((contact: any) => (
                    <div key={contact.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{contact.name}</h3>
                            <Badge variant={contact.responded ? "default" : "secondary"}>
                              {contact.responded ? "Risposto" : "Non risposto"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                          <p className="text-sm font-medium mt-1">{contact.subject}</p>
                          <p className="text-sm text-gray-700 mt-2">{contact.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(contact.createdAt).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                        {!contact.responded && (
                          <Button
                            size="sm"
                            onClick={() => markContactRespondedMutation.mutate(contact.id)}
                            disabled={markContactRespondedMutation.isPending}
                          >
                            Marca come Risposto
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <UserCheck className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Gestisci Richieste</h3>
                      <p className="text-sm text-gray-600">Approva o rifiuta registrazioni</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Users className="text-secondary h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Gestisci Articoli</h3>
                      <p className="text-sm text-gray-600">Crea e modifica news</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Users className="text-accent h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Gestisci Gare Cinofile</h3>
                      <p className="text-sm text-gray-600">Organizza competizioni</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="text-green-600 h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Gestisci Utenti</h3>
                      <p className="text-sm text-gray-600">Amministra membri</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="text-yellow-600 h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Gestisci Tesseramenti</h3>
                      <p className="text-sm text-gray-600">Monitora pagamenti</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Mail className="text-red-600 h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Gestisci Contatti</h3>
                      <p className="text-sm text-gray-600">Rispondi ai messaggi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
