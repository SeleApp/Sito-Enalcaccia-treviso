import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import Footer from "@/components/footer";
import { IdCard, Trophy, GraduationCap, Calendar, MapPin, Euro } from "lucide-react";
import type { News, Competition } from "@shared/schema";

export default function HomePage() {
  const { data: news } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: competitions } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const services = [
    {
      icon: IdCard,
      title: "Tesseramenti",
      description: "Rinnova o ottieni la tua tessera venatoria con procedure semplificate e pagamenti sicuri online.",
      href: "/membership",
    },
    {
      icon: Trophy,
      title: "Gare Cinofile",
      description: "Partecipa alle competizioni per cani da caccia organizzate in tutta Italia.",
      href: "/competitions",
    },
    {
      icon: GraduationCap,
      title: "Formazione",
      description: "Corsi di formazione per cacciatori responsabili e gestione sostenibile della fauna.",
      href: "/courses",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">I Nostri Servizi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enal Caccia offre una gamma completa di servizi per i cacciatori, dalle licenze alle competizioni cinofile.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="card-hover text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{service.description}</CardDescription>
                  <Link href={service.href}>
                    <Button variant="link" className="text-primary font-semibold">
                      Scopri di più →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-muted/30">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news?.slice(0, 3).map((article) => (
              <Card key={article.id} className="card-hover overflow-hidden">
                {article.featuredImage && (
                  <div className="aspect-video">
                    <img
                      src={`${article.featuredImage}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(article.createdAt!).toLocaleDateString('it-IT')}</span>
                    <Badge variant="secondary" className="ml-2">
                      {article.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    <Link href={`/news/${article.slug}`}>{article.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{article.excerpt}</CardDescription>
                  <Link href={`/news/${article.slug}`}>
                    <Button variant="link" className="text-primary font-semibold p-0">
                      Leggi tutto →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Competitions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Prossime Gare Cinofile</h2>
              <p className="text-muted-foreground">Competizioni in programma per i prossimi mesi</p>
            </div>
            <Link href="/competitions">
              <Button variant="outline">Vedi tutte le gare</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitions?.slice(0, 3).map((competition) => (
              <Card key={competition.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default">{competition.discipline}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(competition.eventDate).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{competition.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{competition.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Euro className="w-4 h-4 mr-2" />
                      <span className="text-sm">€{competition.cost}</span>
                    </div>
                  </div>
                  <CardDescription className="mb-4">{competition.description}</CardDescription>
                  <Link href={`/competitions/${competition.id}`}>
                    <Button size="sm" className="w-full">
                      Dettagli
                    </Button>
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
