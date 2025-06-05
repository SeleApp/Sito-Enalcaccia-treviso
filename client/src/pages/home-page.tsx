import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { useQuery } from "@tanstack/react-query";
import { News, Competition } from "@shared/schema";
import { Calendar, MapPin, Euro, Trophy, Users, GraduationCap, IdCard } from "lucide-react";

export default function HomePage() {
  const { data: news = [] } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: competitions = [] } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const latestNews = news.slice(0, 3);
  const upcomingCompetitions = competitions.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-96 hero-bg flex items-center justify-center">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Enal Caccia</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Associazione Venatoria per la Promozione della Caccia Responsabile
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership">
              <Button className="btn-accent text-lg px-8 py-3">
                <IdCard className="mr-2 h-5 w-5" />
                Tesseramento
              </Button>
            </Link>
            <Link href="#chi-siamo">
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-forest text-lg px-8 py-3"
              >
                Scopri di più
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="chi-siamo" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Chi Siamo</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              L'Ente Nazionale per l'Assistenza alle Lavoratrici e ai Lavoratori è impegnato nella promozione di una caccia etica e responsabile.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Sede dell'associazione" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-forest rounded-lg flex items-center justify-center">
                    <Trophy className="text-white h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tradizione e Sicurezza</h3>
                  <p className="text-gray-600">Promuoviamo la tradizione venatoria italiana nel rispetto delle normative e della sicurezza.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-forest rounded-lg flex items-center justify-center">
                    <Users className="text-white h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Rispetto Ambientale</h3>
                  <p className="text-gray-600">Sosteniamo la conservazione dell'ambiente e la gestione sostenibile della fauna selvatica.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-forest rounded-lg flex items-center justify-center">
                    <GraduationCap className="text-white h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Comunità Unita</h3>
                  <p className="text-gray-600">Riuniamo cacciatori esperti e principianti in una comunità basata sul rispetto reciproco.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="attivita" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Le Nostre Attività</h2>
            <p className="text-xl text-gray-600">Scopri tutti i servizi e le iniziative che offriamo ai nostri iscritti</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-16 h-16 bg-forest rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="text-white h-8 w-8" />
                </div>
                <CardTitle>Gare Cinofile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Organizziamo competizioni per cani da caccia nelle diverse discipline venatorie.
                </CardDescription>
                <Link href="/competitions">
                  <Button variant="link" className="text-forest hover:text-forest-light p-0">
                    Scopri le gare →
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader>
                <div className="w-16 h-16 bg-saddle rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="text-white h-8 w-8" />
                </div>
                <CardTitle>Corsi di Formazione</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Corsi per ottenere e rinnovare il porto d'armi e licenze di caccia.
                </CardDescription>
                <Button variant="link" className="text-forest hover:text-forest-light p-0">
                  Vedi i corsi →
                </Button>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader>
                <div className="w-16 h-16 bg-goldenrod rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-white h-8 w-8" />
                </div>
                <CardTitle>Assistenza Legale</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Supporto legale e consulenza per questioni relative all'attività venatoria.
                </CardDescription>
                <Button variant="link" className="text-forest hover:text-forest-light p-0">
                  Maggiori info →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Ultime Notizie</h2>
              <p className="text-xl text-gray-600">Rimani aggiornato sulle novità del mondo venatorio</p>
            </div>
            <Link href="/news">
              <Button className="btn-primary">
                Vedi tutte le news
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {latestNews.map((article) => (
              <Card key={article.id} className="card-hover overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300" 
                    alt={article.titolo}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(article.data).toLocaleDateString('it-IT')}</span>
                  </div>
                  <CardTitle className="hover:text-forest transition-colors">
                    {article.titolo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {article.contenuto.substring(0, 150)}...
                  </CardDescription>
                  <Button variant="link" className="text-forest hover:text-forest-light p-0">
                    Leggi tutto →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitions Section */}
      <section id="gare" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Gare Cinofile</h2>
            <p className="text-xl text-gray-600">Prossimi eventi e competizioni per cani da caccia</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingCompetitions.map((competition) => (
              <Card key={competition.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-forest text-white">{competition.disciplina}</Badge>
                    <span className="text-gray-500 text-sm">
                      {new Date(competition.dataEvento).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <CardTitle>{competition.titolo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="mr-2 h-4 w-4 text-forest" />
                      <span>{competition.luogo}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Euro className="mr-2 h-4 w-4 text-forest" />
                      <span>€{competition.costo},00</span>
                    </div>
                  </div>
                  
                  <CardDescription className="mb-4">
                    {competition.descrizione}
                  </CardDescription>
                  
                  <div className="flex space-x-3">
                    <Button className="flex-1 btn-primary text-sm">
                      Dettagli
                    </Button>
                    {competition.bandoUrl && (
                      <Button variant="outline" className="flex-1 border-forest text-forest hover:bg-forest hover:text-white text-sm">
                        Bando
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/competitions">
              <Button className="btn-primary text-lg px-8 py-3">
                Vedi tutte le gare
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contatti" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Contattaci</h2>
            <p className="text-xl text-gray-600">Siamo qui per rispondere alle tue domande</p>
          </div>
          
          <div className="text-center">
            <Link href="/contact">
              <Button className="btn-primary text-lg px-8 py-3">
                Vai alla pagina contatti
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <Trophy className="text-goldenrod h-8 w-8 mr-3" />
                <span className="font-serif font-bold text-xl">Enal Caccia</span>
              </div>
              <p className="text-gray-300 mb-4">
                Associazione Venatoria per la promozione della caccia responsabile e la conservazione dell'ambiente.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Utili</h3>
              <ul className="space-y-2">
                <li><a href="https://www.enalcaccia.it" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-goldenrod transition-colors">Enalcaccia Nazionale</a></li>
                <li><a href="https://www.regione.veneto.it" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-goldenrod transition-colors">Regione Veneto - Caccia</a></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-goldenrod transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-goldenrod transition-colors">Termini e Condizioni</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">I Nostri Servizi</h3>
              <ul className="space-y-2">
                <li><Link href="/membership" className="text-gray-300 hover:text-goldenrod transition-colors">Tesseramento</Link></li>
                <li><Link href="/competitions" className="text-gray-300 hover:text-goldenrod transition-colors">Gare Cinofile</Link></li>
                <li><a href="#corsi" className="text-gray-300 hover:text-goldenrod transition-colors">Corsi di Formazione</a></li>
                <li><a href="#assistenza" className="text-gray-300 hover:text-goldenrod transition-colors">Assistenza Legale</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-300 mb-4">Iscriviti per ricevere news e aggiornamenti</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="tua@email.com"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-goldenrod focus:border-transparent"
                />
                <Button className="bg-goldenrod hover:bg-opacity-90 text-white px-4 py-2 rounded-r-lg">
                  <span>→</span>
                </Button>
              </div>
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
