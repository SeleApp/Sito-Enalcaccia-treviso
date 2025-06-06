import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, Clock, Mail, CreditCard, CheckCircle, XCircle, Calendar } from "lucide-react";
import type { PendingUser, Contact, News, Competition } from "@shared/schema";

interface AdminStats {
  approvedUsers: number;
  pendingUsers: number;
  totalContacts: number;
  totalMemberships: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Accesso Negato</h1>
                <p className="text-muted-foreground">Non hai i permessi per accedere a questa pagina.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: pendingUsers = [] } = useQuery<PendingUser[]>({
    queryKey: ["/api/admin/pending-users"],
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts"],
  });

  const { data: news = [] } = useQuery<News[]>({
    queryKey: ["/api/admin/news"],
  });

  const { data: competitions = [] } = useQuery<Competition[]>({
    queryKey: ["/api/admin/competitions"],
  });

  const approveUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("POST", `/api/admin/approve-user/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Utente approvato",
        description: "L'utente è stato approvato con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'approvazione",
        variant: "destructive",
      });
    },
  });

  const rejectUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("DELETE", `/api/admin/reject-user/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Richiesta rifiutata",
        description: "La richiesta di registrazione è stata rifiutata",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il rifiuto",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Dashboard Amministrativa</h1>
          <p className="text-muted-foreground">Benvenuto, {user.nome} {user.cognome}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utenti Approvati</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.approvedUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Richieste Pendenti</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats?.pendingUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messaggi Contatti</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalContacts || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tesseramenti</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalMemberships || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="pending-users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending-users">Richieste Utenti</TabsTrigger>
            <TabsTrigger value="contacts">Contatti</TabsTrigger>
            <TabsTrigger value="news">Gestione News</TabsTrigger>
            <TabsTrigger value="competitions">Gare Cinofile</TabsTrigger>
          </TabsList>

          <TabsContent value="pending-users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Richieste di Registrazione in Attesa</CardTitle>
                <CardDescription>
                  Approva o rifiuta le richieste di registrazione degli utenti
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nessuna richiesta in attesa
                  </p>
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
                                onClick={() => approveUserMutation.mutate(user.id)}
                                disabled={approveUserMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approva
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectUserMutation.mutate(user.id)}
                                disabled={rejectUserMutation.isPending}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
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

          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Messaggi di Contatto</CardTitle>
                <CardDescription>
                  Visualizza e gestisci i messaggi ricevuti tramite il modulo di contatto
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nessun messaggio ricevuto
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Oggetto</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Stato</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.subject}</TableCell>
                          <TableCell>
                            {new Date(contact.createdAt).toLocaleDateString('it-IT')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={contact.replied ? "default" : "secondary"}>
                              {contact.replied ? "Risposto" : "Nuovo"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Articoli</CardTitle>
                <CardDescription>
                  Crea, modifica e gestisci gli articoli del sito
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    {news.length} articoli totali
                  </p>
                  <Button>Nuovo Articolo</Button>
                </div>
                
                {news.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nessun articolo presente
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titolo</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Stato</TableHead>
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {news.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium">{article.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{article.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(article.createdAt).toLocaleDateString('it-IT')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={article.published ? "default" : "secondary"}>
                              {article.published ? "Pubblicato" : "Bozza"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">Modifica</Button>
                              <Button size="sm" variant="destructive">Elimina</Button>
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

          <TabsContent value="competitions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Gare Cinofile</CardTitle>
                <CardDescription>
                  Organizza e gestisci le competizioni cinofile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    {competitions.length} gare programmate
                  </p>
                  <Button>Nuova Gara</Button>
                </div>
                
                {competitions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nessuna gara programmata
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titolo</TableHead>
                        <TableHead>Disciplina</TableHead>
                        <TableHead>Data Evento</TableHead>
                        <TableHead>Partecipanti</TableHead>
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {competitions.map((competition) => (
                        <TableRow key={competition.id}>
                          <TableCell className="font-medium">{competition.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{competition.discipline}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(competition.eventDate).toLocaleDateString('it-IT')}
                            </div>
                          </TableCell>
                          <TableCell>
                            {competition.registeredParticipants} / {competition.maxParticipants}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">Modifica</Button>
                              <Button size="sm" variant="destructive">Elimina</Button>
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
        </Tabs>
      </div>
    </div>
  );
}
