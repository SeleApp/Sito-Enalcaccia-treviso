import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Calendar, MapPin, Euro, FileText } from "lucide-react";
import type { Competition } from "@shared/schema";

export default function CompetitionsPage() {
  const { data: competitions, isLoading } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Gare Cinofile</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Scopri tutte le competizioni cinofile in programma e partecipa con il tuo cane
          </p>
        </div>

        {/* Competitions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {competitions?.map((competition) => {
            const eventDate = new Date(competition.eventDate);
            const isUpcoming = eventDate > new Date();
            
            return (
              <Card key={competition.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      className={`${
                        competition.discipline === "Caccia al Cinghiale" 
                          ? "bg-primary text-primary-foreground" 
                          : competition.discipline === "Segugio"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-accent text-accent-foreground"
                      }`}
                    >
                      {competition.discipline}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{eventDate.toLocaleDateString('it-IT')}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {competition.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      <span className="text-sm">{competition.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Euro className="mr-2 h-4 w-4 text-primary" />
                      <span className="text-sm">€{competition.cost}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                    {competition.description}
                  </p>
                  
                  {isUpcoming && (
                    <div className="mb-4">
                      <Badge variant="outline" className="text-green-700 border-green-200">
                        Iscrizioni Aperte
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      disabled={!isUpcoming}
                    >
                      {isUpcoming ? "Dettagli" : "Conclusa"}
                    </Button>
                    {competition.bandoUrl && (
                      <Button variant="outline" className="flex-1" size="sm">
                        <FileText className="mr-1 h-4 w-4" />
                        Bando
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {competitions && competitions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-trophy text-2xl text-muted-foreground"></i>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nessuna gara in programma</h3>
            <p className="text-muted-foreground">Le gare cinofile verranno pubblicate qui quando programmate.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-muted/50 rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Come Partecipare</h2>
            <p className="text-muted-foreground">Informazioni per iscriversi alle gare cinofile</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-user-check text-primary-foreground"></i>
              </div>
              <h3 className="font-semibold text-foreground mb-2">1. Tessera Valida</h3>
              <p className="text-sm text-muted-foreground">
                Assicurati di avere una tessera Enal Caccia valida per l'anno corrente
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-file-alt text-secondary-foreground"></i>
              </div>
              <h3 className="font-semibold text-foreground mb-2">2. Documentazione</h3>
              <p className="text-sm text-muted-foreground">
                Consulta il bando della gara e prepara la documentazione richiesta
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-calendar-plus text-accent-foreground"></i>
              </div>
              <h3 className="font-semibold text-foreground mb-2">3. Iscrizione</h3>
              <p className="text-sm text-muted-foreground">
                Iscriviti entro i termini previsti dal bando di gara
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
