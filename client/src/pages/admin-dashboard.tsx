import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, Clock, CreditCard, Mail, UserCheck, UserX, Eye, Reply } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect non-admin users
  if (user && user.role !== "admin") {
    setLocation("/dashboard");
    return null;
  }

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"]
  });

  const { data: pendingUsers = [] } = useQuery({
    queryKey: ["/api/admin/pending-users"]
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["/api/admin/contacts"]
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ["/api/admin/memberships"]
  });

  const approveUserMutation = useMutation({
    mutationFn: (userId: number) => apiRequest("POST", `/api/admin/approve-user/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Utente approvato",
        description: "L'utente è stato approvato con successo",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const rejectUserMutation = useMutation({
    mutationFn: (userId: number) => apiRequest("DELETE", `/api/admin/reject-user/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Richiesta rifiutata",
        description: "La richiesta di registrazione è stata rifiutata",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const markContactRepliedMutation = useMutation({
    mutationFn: (contactId: number) => apiRequest("PUT", `/api/admin/contacts/${contactId}`, { replied: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      toast({
        title: "Contatto aggiornato",
        description: "Il contatto è stato segnato come risposto",
      });
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard Amministrativa</h1>
          <p className="text-muted-foreground">Benvenuto, {user?.nome} {user?.cognome}</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Utenti Approvati</p>
                    <p className="text-2xl font-bold text-primary">{stats.approvedUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Richieste Pendenti</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingUsers}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600/60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tesseramenti Totali</p>
                    <p className="text-2xl font-bold text-green-600">{stats.totalMemberships}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-600/60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Messaggi Contatti</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.contactMessages}</p>
                  </div>
                  <Mail className="h-8 w-8 text-orange-600/60" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Richieste Pendenti</TabsTrigger>
            <TabsTrigger value="contacts">Messaggi</TabsTrigger>
            <TabsTrigger value="memberships">Tesseramenti</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Richieste di Registrazione in Attesa</CardTitle>
                <CardDescription>
                  Approva o rifiuta le richieste di registrazione degli utenti
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nessuna richiesta in attesa
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Codice Fiscale</TableHead>
                        <TableHead>Numero Licenza</TableHead>
                        <TableHead>Data Richiesta</TableHead>
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.nome} {user.cognome}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.luogoNascita}, {new Date(user.dataNascita).toLocaleDateString('it-IT')}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="font-mono text-sm">{user.codiceFiscale}</TableCell>
                          <TableCell>{user.numeroLicenza}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString('it-IT')}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => approveUserMutation.mutate(user.id)}
                                disabled={approveUserMutation.isPending}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Approva
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectUserMutation.mutate(user.id)}
                                disabled={rejectUserMutation.isPending}
                              >
                                <UserX className="h-4 w-4 mr-1" />
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

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Messaggi di Contatto</CardTitle>
                <CardDescription>
                  Gestisci i messaggi ricevuti dal modulo di contatto
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
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
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact: any) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.subject}</TableCell>
                          <TableCell>{new Date(contact.createdAt).toLocaleDateString('it-IT')}</TableCell>
                          <TableCell>
                            <Badge variant={contact.replied ? "default" : "secondary"}>
                              {contact.replied ? "Risposto" : "In attesa"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Visualizza
                              </Button>
                              {!contact.replied && (
                                <Button
                                  size="sm"
                                  onClick={() => markContactRepliedMutation.mutate(contact.id)}
                                  disabled={markContactRepliedMutation.isPending}
                                >
                                  <Reply className="h-4 w-4 mr-1" />
                                  Segna come Risposto
                                </Button>
                              )}
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

          <TabsContent value="memberships">
            <Card>
              <CardHeader>
                <CardTitle>Tesseramenti</CardTitle>
                <CardDescription>
                  Gestisci i tesseramenti e i pagamenti degli utenti
                </CardDescription>
              </CardHeader>
              <CardContent>
                {memberships.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nessun tesseramento presente
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Utente</TableHead>
                        <TableHead>Tipo Tessera</TableHead>
                        <TableHead>Importo</TableHead>
                        <TableHead>Stato</TableHead>
                        <TableHead>Validità</TableHead>
                        <TableHead>Data Acquisto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberships.map((membership: any) => (
                        <TableRow key={membership.id}>
                          <TableCell>{membership.userId}</TableCell>
                          <TableCell className="font-medium">{membership.membershipType}</TableCell>
                          <TableCell>€{(membership.amount / 100).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={membership.status === "active" ? "default" : "secondary"}>
                              {membership.status === "active" ? "Attivo" : membership.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {membership.validFrom && membership.validUntil && (
                              <span className="text-sm">
                                {new Date(membership.validFrom).toLocaleDateString('it-IT')} - {new Date(membership.validUntil).toLocaleDateString('it-IT')}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(membership.createdAt).toLocaleDateString('it-IT')}</TableCell>
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
