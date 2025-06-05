import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Target, 
  Trophy, 
  GraduationCap, 
  Shield, 
  Leaf, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Send,
  ArrowRight
} from "lucide-react";

export default function HomePage() {
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Fetch news
  const { data: news = [] } = useQuery({
    queryKey: ["/api/news"],
  });

  // Fetch competitions
  const { data: competitions = [] } = useQuery({
    queryKey: ["/api/competitions"],
  });

  // Fetch memberships
  const { data: memberships = [] } = useQuery({
    queryKey: ["/api/memberships"],
  });

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/newsletter", { email });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Iscrizione completata!",
        description: "Ti sei iscritto con successo alla newsletter.",
      });
      setNewsletterEmail("");
    },
    onError: (error: Error) => {
      toast({
        title: "Errore nell'iscrizione",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      newsletterMutation.mutate(newsletterEmail);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-96 gradient-primary text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600')"
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 mr-3" />
              <h1 className="text-4xl md:text-6xl font-serif font-bold">Enal Caccia</h1>
            </div>
            <p className="text-xl md:text-2xl mb-2">Ente Nazionale Associazioni Libere della Caccia</p>
            <p className="text-lg mb-8 max-w-2xl">
              Promuoviamo la caccia responsabile e sostenibile, valorizzando le tradizioni venatorie italiane 
              attraverso formazione, competizioni cinofile e tesseramenti.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/membership">
                <Button className="btn-accent text-white px-8 py-3 text-lg">
                  Iscriviti Ora
                </Button>
              </Link>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
                Scopri di Più
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">I Nostri Servizi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enal Caccia offre una gamma completa di servizi per i cacciatori, dalle licenze alle competizioni cinofile.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Tesseramenti</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Rinnova o ottieni la tua tessera venatoria con procedure semplificate e pagamenti sicuri online.
                </CardDescription>
                <Link href="/membership">
                  <Button variant="link" className="text-primary p-0">
                    Scopri di più <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Gare Cinofile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Partecipa alle competizioni per cani da caccia organizzate in tutta Italia.
                </CardDescription>
                <Link href="/competitions">
                  <Button variant="link" className="text-primary p-0">
                    Vedi calendario <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Formazione</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Corsi di formazione per cacciatori responsabili e gestione sostenibile della fauna.
                </CardDescription>
                <Button variant="link" className="text-primary p-0">
                  Iscriviti <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Chi Siamo</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              L'Ente Nazionale per l'Assistenza alle Lavoratrici e ai Lavoratori è impegnato 
              nella promozione di una caccia etica e responsabile.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Sede dell'associazione" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Tradizione e Sicurezza</h3>
                  <p className="text-muted-foreground">
                    Promuoviamo la tradizione venatoria italiana nel rispetto delle normative e della sicurezza.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Rispetto Ambientale</h3>
                  <p className="text-muted-foreground">
                    Sosteniamo la conservazione dell'ambiente e la gestione sostenibile della fauna selvatica.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Comunità Unita</h3>
                  <p className="text-muted-foreground">
                    Riuniamo cacciatori esperti e principianti in una comunità basata sul rispetto reciproco.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Ultime News</h2>
              <p className="text-muted-foreground">Rimani aggiornato sulle attività di Enal Caccia</p>
            </div>
            <Link href="/news">
              <Button variant="outline">
                Vedi tutte <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.slice(0, 3).map((article: any) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300"
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(article.publishedAt).toLocaleDateString('it-IT')}</span>
                    {article.category && (
                      <>
                        <span className="mx-2">•</span>
                        <Badge variant="secondary">{article.category}</Badge>
                      </>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {article.excerpt || article.content.substring(0, 150) + "..."}
                  </CardDescription>
                  <Link href={`/news/${article.slug}`}>
                    <Button variant="link" className="text-primary p-0">
                      Leggi tutto <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitions Preview */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Prossime Gare Cinofile</h2>
            <p className="text-muted-foreground">Eventi e competizioni per cani da caccia</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitions.slice(0, 3).map((competition: any) => (
              <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-primary text-white">{competition.discipline}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(competition.eventDate).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{competition.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{competition.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <span className="text-sm font-medium">€{competition.cost}</span>
                    </div>
                  </div>
                  
                  {competition.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {competition.description}
                    </p>
                  )}
                  
                  <div className="flex space-x-3">
                    <Button size="sm" className="flex-1">
                      Dettagli
                    </Button>
                    {competition.registrationDocument && (
                      <Button variant="outline" size="sm" className="flex-1">
                        Bando PDF
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/competitions">
              <Button className="btn-primary text-white px-8 py-3 text-lg">
                Vedi tutte le gare
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Contattaci</h2>
            <p className="text-muted-foreground">Siamo qui per rispondere alle tue domande</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Sede Principale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Via della Caccia, 123<br />
                  31100 Treviso (TV)<br />
                  Veneto, Italia
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Telefono</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  +39 0422 123456<br />
                  Lun-Ven: 9:00-17:00<br />
                  Sab: 9:00-12:00
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  info@enalcaccia-veneto.it<br />
                  segretario@enalcaccia-veneto.it
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/contact">
              <Button className="btn-primary px-8 py-3 text-lg">
                <Send className="mr-2 h-5 w-5" />
                Invia un Messaggio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 mr-2" />
                <span className="font-serif font-bold text-xl">Enal Caccia</span>
              </div>
              <p className="text-gray-300 mb-4">
                Associazione Venatoria per la promozione della caccia responsabile 
                e la conservazione dell'ambiente.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Youtube className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Utili</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.enalcaccia.it" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    Enalcaccia Nazionale
                  </a>
                </li>
                <li>
                  <a href="https://www.regione.veneto.it" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    Regione Veneto - Caccia
                  </a>
                </li>
                <li>
                  <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                    Privacy Policy
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                    Termini e Condizioni
                  </Button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">I Nostri Servizi</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/membership">
                    <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                      Tesseramento
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/competitions">
                    <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                      Gare Cinofile
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                    Corsi di Formazione
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="text-gray-300 hover:text-white p-0 h-auto">
                    Assistenza Legale
                  </Button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-300 mb-4">Iscriviti per ricevere news e aggiornamenti</p>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <Input
                  type="email"
                  placeholder="tua@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="rounded-r-none bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <Button 
                  type="submit" 
                  className="btn-accent rounded-l-none"
                  disabled={newsletterMutation.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 Enal Caccia Veneto. Tutti i diritti riservati. | P.IVA: 12345678901
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
