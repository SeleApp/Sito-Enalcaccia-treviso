import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Competition } from "@shared/schema";
import { MapPin, Euro, Calendar, FileText, ArrowLeft } from "lucide-react";

export default function CompetitionsPage() {
  const params = useParams();
  const isDetailView = !!params.id;

  const { data: competitions = [], isLoading: competitionsLoading } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const { data: competition, isLoading: competitionLoading } = useQuery<Competition>({
    queryKey: ["/api/competitions", params.id],
    enabled: isDetailView,
  });

  if (isDetailView) {
    if (competitionLoading) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-1/2 mb-8" />
              <div className="h-32 bg-muted rounded mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    if (!competition) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Gara non trovata</h1>
            <Link href="/competitions">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna alle gare
              </Button>
            </Link>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/competitions">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alle gare
            </Button>
          </Link>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <Badge className="bg-primary text-primary-foreground">
                  {competition.discipline}
                </Badge>
                <span className="text-muted-foreground">
                  {new Date(competition.date).toLocaleDateString('it-IT')}
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-6">{competition.title}</h1>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Data</p>
                      <p>{new Date(competition.date).toLocaleDateString('it-IT')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Luogo</p>
                      <p>{competition.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-muted-foreground">
                    <Euro className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Costo di Iscrizione</p>
                      <p>€{competition.cost}</p>
                    </div>
                  </div>
                  
                  {competition.bandoUrl && (
                    <div className="flex items-center text-muted-foreground">
                      <FileText className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Documentazione</p>
                        <a 
                          href={competition.bandoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Scarica il bando
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Descrizione</h2>
                <p className="text-muted-foreground leading-relaxed">{competition.description}</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Come Partecipare</h3>
                <p className="text-muted-foreground mb-4">
                  Per partecipare a questa gara è necessario essere tesserati Enal Caccia. 
                  Le iscrizioni devono essere effettuate entro i termini specificati nel bando.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/membership">
                    <Button>Tesserati Ora</Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline">Contatta l'Organizzazione</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Gare Cinofile</h1>
          <p className="text-muted-foreground">
            Scopri le prossime competizioni e partecipa con il tuo cane da caccia
          </p>
        </div>

        {competitionsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-muted rounded w-1/3" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                  <div className="flex space-x-2">
                    <div className="h-9 bg-muted rounded flex-1" />
                    <div className="h-9 bg-muted rounded flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : competitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitions.map((competition) => (
              <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {competition.discipline}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(competition.date).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{competition.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{competition.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Euro className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">€{competition.cost}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                    {competition.description}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Link href={`/competitions/${competition.id}`}>
                      <Button className="flex-1 text-sm">Dettagli</Button>
                    </Link>
                    {competition.bandoUrl && (
                      <Button variant="outline" className="flex-1 text-sm" asChild>
                        <a href={competition.bandoUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 mr-1" />
                          Bando
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Nessuna gara programmata</h3>
            <p className="text-muted-foreground">
              Al momento non ci sono gare cinofile in programma. Torna presto per gli aggiornamenti!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
