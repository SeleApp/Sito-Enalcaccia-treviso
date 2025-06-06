import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Calendar, MapPin, Euro, Users, Search, FileText } from "lucide-react";
import type { Competition } from "@shared/schema";

export default function CompetitionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");

  const { data: competitions = [], isLoading } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const filteredCompetitions = competitions.filter(competition => {
    const matchesSearch = competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competition.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = selectedDiscipline === "" || competition.discipline === selectedDiscipline;
    return matchesSearch && matchesDiscipline;
  });

  const disciplines = Array.from(new Set(competitions.map(c => c.discipline)));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="gradient-bg text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            Gare Cinofile
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Partecipa alle competizioni per cani da caccia organizzate in tutta Italia. 
            Trova l'evento perfetto per te e il tuo compagno a quattro zampe.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cerca per nome o località..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Tutte le discipline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tutte le discipline</SelectItem>
                {disciplines.map(discipline => (
                  <SelectItem key={discipline} value={discipline}>
                    {discipline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Competitions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompetitions.map((competition) => (
              <Card key={competition.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{competition.discipline}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(competition.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{competition.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(competition.eventDate).toLocaleDateString('it-IT', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{competition.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Euro className="w-4 h-4 mr-2" />
                      <span>€{competition.cost}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      <span>
                        {competition.currentParticipants}/{competition.maxParticipants} partecipanti
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {competition.description}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Dettagli
                    </Button>
                    {competition.bandoUrl && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        Bando
                      </Button>
                    )}
                  </div>
                  
                  {/* Registration deadline warning */}
                  {new Date(competition.registrationDeadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                    <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded text-sm text-warning">
                      ⚠️ Iscrizioni chiudono il {new Date(competition.registrationDeadline).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nessuna gara trovata
            </h3>
            <p className="text-muted-foreground">
              Prova a modificare i filtri di ricerca
            </p>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Come Partecipare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <h4 className="font-semibold">Registrazione</h4>
                  <p className="text-sm text-muted-foreground">Assicurati di avere un account approvato</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <h4 className="font-semibold">Tessera Valida</h4>
                  <p className="text-sm text-muted-foreground">Acquista una tessera Premium o Elite</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <h4 className="font-semibold">Iscrizione</h4>
                  <p className="text-sm text-muted-foreground">Iscriviti entro la scadenza indicata</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regolamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Tutti i cani devono essere registrati e microchippati</li>
                <li>• Certificato sanitario obbligatorio</li>
                <li>• Assicurazione di responsabilità civile</li>
                <li>• Equipaggiamento di sicurezza richiesto</li>
                <li>• Rispetto delle normative ENCI</li>
              </ul>
              <Button variant="outline" className="w-full mt-4">
                Scarica Regolamento Completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
