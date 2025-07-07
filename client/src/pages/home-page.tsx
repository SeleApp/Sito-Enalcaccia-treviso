import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { Trophy, Users, GraduationCap, Shield, Leaf, Calendar, MapPin, Euro } from "lucide-react";
import type { News, Competition, Membership } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  
  const { data: news = [] } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: competitions = [] } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const { data: memberships = [] } = useQuery<Membership[]>({
    queryKey: ["/api/memberships"],
  });

  const latestNews = news.slice(0, 3);
  const upcomingCompetitions = competitions.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary to-secondary overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600')"
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            {/* Contenuto testo */}
            <div className="text-white flex-1">
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Enal Caccia, Pesca e Tiro - Treviso</h1>
              <p className="text-xl md:text-2xl mb-2">Sezione Provinciale di Treviso</p>
              <p className="text-lg mb-8 max-w-2xl">Promuoviamo la caccia responsabile e sostenibile nella provincia di Treviso, valorizzando le tradizioni venatorie venete attraverso formazione, competizioni cinofile e salvaguardia della biodiversità.</p>
              <div className="flex flex-wrap gap-4">
                {!user && (
                  <>
                    <Link href="/membership">
                      <Button size="lg" className="bg-white text-forest hover:bg-gray-100 font-semibold px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                        Iscriviti Ora
                      </Button>
                    </Link>
                    <Link href="/auth">
                      <Button size="lg" variant="outline" className="border-2 border-white text-white bg-black/20 hover:bg-white hover:text-forest font-semibold px-8 py-3 shadow-lg transition-colors duration-300">
                        Accedi
                      </Button>
                    </Link>
                  </>
                )}
                {user && (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-white text-forest hover:bg-gray-100 font-semibold px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                      Vai alla Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            
            {/* Logo grande nell'angolo destro */}
            <div className="flex-shrink-0 hidden md:block">
              <img 
                src="/attached_assets/ChatGPT Image 7 lug 2025, 21_18_39_1751916102927.png" 
                alt="Logo ENAL Caccia Treviso" 
                className="w-32 h-32 object-cover rounded-full shadow-2xl border-4 border-white/20"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Services Overview */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">I Nostri Servizi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enal Caccia Treviso offre una gamma completa di servizi per i cacciatori della provincia, dalle licenze alle competizioni cinofile.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Tesseramenti</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Rinnova o ottieni la tua tessera venatoria con procedure semplificate e pagamenti sicuri online.
                </p>
                <Link href="/membership">
                  <Button variant="link" className="p-0">Scopri di più →</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle>Gare e Competizioni</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Scopri tutte le competizioni: cinofile, di pesca e di tiro organizzate nella provincia.
                </p>
                <Link href="/competitions">
                  <Button variant="link" className="p-0">Vedi tutte le gare →</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-accent" />
                </div>
                <CardTitle>Formazione</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Corsi di formazione per cacciatori responsabili e gestione sostenibile della fauna.
                </p>
                <Link href="/scuola-venatoria">
                  <Button variant="link" className="p-0">Iscriviti →</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Chi Siamo</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              L'Ente Nazionale per l'Assistenza alle Lavoratrici e ai Lavoratori è impegnato nella promozione di una caccia etica e responsabile.
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
                    <Shield className="w-6 h-6 text-white" />
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
                    <Leaf className="w-6 h-6 text-white" />
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
                    <Users className="w-6 h-6 text-white" />
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
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Ultime Notizie</h2>
              <p className="text-muted-foreground">Rimani aggiornato sulle novità del mondo venatorio</p>
            </div>
            <Link href="/news">
              <Button variant="outline">Vedi tutte le news</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {latestNews.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                  {article.featuredImage && (
                    <img 
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(article.createdAt).toLocaleDateString('it-IT')}</span>
                    <Badge variant="secondary" className="ml-2">
                      {article.category}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                  <Button variant="link" className="p-0">Leggi tutto →</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Competitions Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Gare Cinofile</h2>
            <p className="text-muted-foreground">Prossimi eventi e competizioni per cani da caccia</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingCompetitions.map((competition) => (
              <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge>{competition.discipline}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(competition.eventDate).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{competition.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{competition.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Euro className="w-4 h-4 mr-2" />
                      <span className="text-sm">€{(competition.cost / 100).toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{competition.description}</p>
                  <div className="flex space-x-3">
                    <Button size="sm" className="flex-1">Dettagli</Button>
                    {competition.bandoUrl && (
                      <Button size="sm" variant="outline" className="flex-1">
                        Bando
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/gare-cinofile">
              <Button>Vedi tutte le gare</Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Membership Tiers */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Tesseramento 2025</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Diventa socio Enal Caccia e accedi a tutti i nostri servizi
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {memberships.map((membership, index) => (
              <Card 
                key={membership.id} 
                className={`hover:shadow-lg transition-shadow ${index === 1 ? 'border-accent scale-105' : ''}`}
              >
                {index === 1 && (
                  <div className="text-center">
                    <Badge className="bg-accent text-white -mt-3">PIÙ POPOLARE</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{membership.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary">
                    €{(membership.price / 100).toFixed(0)}
                    <span className="text-lg font-normal text-muted-foreground">/anno</span>
                  </div>
                  <p className="text-muted-foreground">{membership.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {membership.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/membership">
                    <Button className="w-full">Scegli {membership.name.split(' ')[1]}</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
