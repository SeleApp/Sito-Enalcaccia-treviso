import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEOHead } from "@/components/seo-head";
import { Calendar, MapPin, Euro, Users, Download, Search, Filter, Trophy } from "lucide-react";
import type { Competition } from "@shared/schema";

export default function CompetitionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const { data: competitions = [], isLoading } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  // Get unique disciplines
  const disciplines = Array.from(new Set(competitions.map(comp => comp.discipline)));
  
  // Filter competitions
  const filteredCompetitions = competitions.filter(competition => {
    const matchesSearch = competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competition.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competition.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDiscipline = selectedDiscipline === "all" || competition.discipline === selectedDiscipline;
    
    const competitionMonth = new Date(competition.eventDate).getMonth();
    const matchesMonth = selectedMonth === "all" || 
                        parseInt(selectedMonth) === competitionMonth;
    
    return matchesSearch && matchesDiscipline && matchesMonth;
  });

  const formatDate = (dateValue: string | Date) => {
    return new Date(dateValue).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateValue: string | Date) => {
    return new Date(dateValue).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isRegistrationOpen = (competition: Competition) => {
    return new Date() <= new Date(competition.registrationDeadline);
  };

  const getDisciplineColor = (discipline: string) => {
    const colors = {
      "Caccia al Cinghiale": "bg-forest text-white",
      "Segugio": "bg-saddle text-white", 
      "Pointer": "bg-amber-600 text-white",
      "Setter": "bg-blue-600 text-white",
      "Retriever": "bg-green-600 text-white",
      "Spaniel": "bg-purple-600 text-white",
    };
    return colors[discipline as keyof typeof colors] || "bg-gray-600 text-white";
  };

  return (
    <div className="page-shell">
      <SEOHead
        title="Competizioni"
        description="Calendario competizioni ENAL Caccia Treviso: gare cinofile, pesca e tiro con dettagli su iscrizioni, date e regolamenti."
        url="https://enalcaccia-treviso.replit.app/competitions"
      />
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Gare e Competizioni</h1>
          <p className="page-subtitle">
            Scopri tutte le competizioni organizzate da ENAL Caccia Treviso: gare cinofile, di pesca e di tiro. 
            Partecipa e metti alla prova le tue abilità in diverse discipline sportive.
          </p>
        </div>

        {/* Quick Links to Specific Competitions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/gare-cinofile'}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-forest" />
              </div>
              <CardTitle className="text-forest">Gare Cinofile</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Competizioni per cani da caccia con prove di abilità e addestramento
              </p>
              <Button variant="outline" className="w-full">Vai alle Gare Cinofile</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/gare-pesca'}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <CardTitle className="text-blue-500">Gare di Pesca</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Competizioni di pesca sportiva in laghi e fiumi della provincia
              </p>
              <Button variant="outline" className="w-full">Vai alle Gare Pesca</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/gare-tiro'}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-amber-500" />
              </div>
              <CardTitle className="text-amber-500">Gare di Tiro</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Competizioni di tiro al piattello e tiro a volo per tutte le categorie
              </p>
              <Button variant="outline" className="w-full">Vai alle Gare Tiro</Button>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Filtra le gare</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cerca per titolo, luogo o descrizione..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
              <SelectTrigger>
                <SelectValue placeholder="Disciplina" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le discipline</SelectItem>
                {disciplines.map(discipline => (
                  <SelectItem key={discipline} value={discipline}>
                    {discipline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Mese" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i mesi</SelectItem>
                <SelectItem value="0">Gennaio</SelectItem>
                <SelectItem value="1">Febbraio</SelectItem>
                <SelectItem value="2">Marzo</SelectItem>
                <SelectItem value="3">Aprile</SelectItem>
                <SelectItem value="4">Maggio</SelectItem>
                <SelectItem value="5">Giugno</SelectItem>
                <SelectItem value="6">Luglio</SelectItem>
                <SelectItem value="7">Agosto</SelectItem>
                <SelectItem value="8">Settembre</SelectItem>
                <SelectItem value="9">Ottobre</SelectItem>
                <SelectItem value="10">Novembre</SelectItem>
                <SelectItem value="11">Dicembre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredCompetitions.length} {filteredCompetitions.length === 1 ? 'gara trovata' : 'gare trovate'}
          </p>
        </div>

        {/* Competitions Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 bg-muted rounded w-24" />
                    <div className="h-4 bg-muted rounded w-20" />
                  </div>
                  <div className="h-6 bg-muted rounded w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="flex space-x-3">
                      <div className="h-8 bg-muted rounded flex-1" />
                      <div className="h-8 bg-muted rounded flex-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCompetitions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nessuna gara trovata
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedDiscipline !== "all" || selectedMonth !== "all"
                    ? "Prova a modificare i filtri di ricerca"
                    : "Non ci sono gare programmate al momento"
                  }
                </p>
                {(searchTerm || selectedDiscipline !== "all" || selectedMonth !== "all") && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedDiscipline("all");
                      setSelectedMonth("all");
                    }}
                  >
                    Rimuovi filtri
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompetitions.map((competition) => {
              const registrationOpen = isRegistrationOpen(competition);
              const spotsAvailable = competition.maxParticipants ? 
                competition.maxParticipants - (competition.registeredParticipants ?? 0) : null;

              return (
                <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getDisciplineColor(competition.discipline)}>
                        {competition.discipline}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(competition.eventDate)}
                      </span>
                    </div>
                    
                    <CardTitle className="line-clamp-2">{competition.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2 text-forest" />
                        <span className="text-sm">{formatDate(competition.eventDate)}</span>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 text-forest" />
                        <span className="text-sm">{competition.location}</span>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <Euro className="w-4 h-4 mr-2 text-forest" />
                        <span className="text-sm">€{(competition.cost / 100).toFixed(2)}</span>
                      </div>

                      {competition.maxParticipants && (
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-2 text-forest" />
                          <span className="text-sm">
                            {competition.registeredParticipants} / {competition.maxParticipants} iscritti
                          </span>
                          {spotsAvailable !== null && spotsAvailable <= 5 && spotsAvailable > 0 && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {spotsAvailable} posti rimasti
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {competition.description}
                    </p>

                    {!registrationOpen && (
                      <div className="text-sm text-destructive">
                        Iscrizioni chiuse il {new Date(competition.registrationDeadline).toLocaleDateString('it-IT')}
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-forest hover:bg-forest/90"
                        disabled={!registrationOpen || (spotsAvailable !== null && spotsAvailable <= 0)}
                      >
                        {!registrationOpen ? "Iscrizioni chiuse" : 
                         spotsAvailable !== null && spotsAvailable <= 0 ? "Completo" : "Iscriviti"}
                      </Button>
                      
                      {competition.bandoUrl && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          Bando
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-muted/50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Come Partecipare alle Gare Cinofile
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Le gare cinofile sono competizioni che valorizzano le abilità naturali e l'addestramento 
              dei cani da caccia. Partecipare è un'esperienza formativa per te e il tuo compagno.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Requisiti</h3>
              <p className="text-muted-foreground text-sm">
                Tessera Enal Caccia valida, cane iscritto al libro genealogico e vaccinazioni in regola.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-saddle rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Iscrizione</h3>
              <p className="text-muted-foreground text-sm">
                Iscriviti online entro la data limite. Il pagamento può essere effettuato con carta di credito.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Documentazione</h3>
              <p className="text-muted-foreground text-sm">
                Scarica sempre il bando ufficiale per conoscere regolamento, programma e modalità di svolgimento.
              </p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
