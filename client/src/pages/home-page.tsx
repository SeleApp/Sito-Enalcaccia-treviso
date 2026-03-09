import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

import { useAuth } from "@/hooks/use-auth";
import { Trophy, Users, GraduationCap, Shield, Leaf, Calendar, ExternalLink } from "lucide-react";
import type { News } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  
  const { data: news = [] } = useQuery<News[]>({
    queryKey: ["/api/news?v=20260307"],
    staleTime: 0,
    refetchOnMount: "always",
  });

  const latestNews = [...news]
    .filter((article) => article.published)
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 6);

  const newsFallbacks = [
    "/attached_assets/enalcaccia-associazione-venatoria.png",
    "/attached_assets/enalcaccia-cinofilia.jpg",
    "/attached_assets/enalcaccia-estero.jpg",
    "/attached_assets/cane-caccia-1.jpg",
    "/attached_assets/cane-caccia-2.jpg",
  ];

  const getNewsImage = (article: News, index: number) => {
    if (article.featuredImage) return article.featuredImage;
    return newsFallbacks[index % newsFallbacks.length];
  };

  const isPdfAsset = (assetPath: string) => assetPath.toLowerCase().endsWith(".pdf");

  const institutionalPartners = [
    {
      name: "ENALCACCIA Nazionale",
      description: "Associazione venatoria di riferimento a livello nazionale.",
      url: "https://www.enalcaccianazionale.it",
      logoPath: "/attached_assets/logo-enal-caccia.svg",
    },
    {
      name: "ENALPESCA",
      description: "Settore pesca sportiva e iniziative dedicate agli associati.",
      url: "https://www.enalpesca.it",
      logoPath: "/attached_assets/enalpesca.png",
    },
    {
      name: "ENCI",
      description: "Ente Nazionale della Cinofilia Italiana.",
      url: "https://www.enci.it",
      logoPath: "/attached_assets/enci-1882-logo-definitivo.png",
    },
    {
      name: "Regione del Veneto",
      description: "Normativa, calendari e adempimenti regionali.",
      url: "https://www.regione.veneto.it/web/agricoltura-e-foreste/treviso",
      logoPath: "/attached_assets/logo regione veneto.jpg",
    },
    {
      name: "MASAF",
      description: "Ministero dell'Agricoltura, della Sovranita alimentare e delle Foreste.",
      url: "https://www.masaf.gov.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/202",
      logoPath: "/attached_assets/logo.masaf.svg",
    },
    {
      name: "Provincia di Treviso",
      description: "Servizi provinciali e informazioni territoriali.",
      url: "https://www.provincia.treviso.it",
      logoPath: "/attached_assets/logo_provincia_sito_desktop.svg",
    },
    {
      name: "ISPRA",
      description: "Istituto Superiore per la Protezione e la Ricerca Ambientale.",
      url: "https://www.isprambiente.gov.it",
      logoPath: "/attached_assets/ispra-logo-bianco.svg",
    },
  ];

  const getPartnerLogoContainerClass = (partnerName: string) => {
    if (partnerName === "Provincia di Treviso") {
      return "w-full max-w-[220px] h-16 rounded-md bg-white border border-slate-200 mx-auto mb-4 px-3 flex items-center justify-center overflow-hidden";
    }
    if (partnerName === "MASAF" || partnerName === "ISPRA") {
      return "w-20 h-20 rounded-full bg-slate-800 mx-auto mb-4 flex items-center justify-center overflow-hidden";
    }
    return "w-20 h-20 rounded-full bg-forest/10 mx-auto mb-4 flex items-center justify-center overflow-hidden";
  };

  const getPartnerLogoImageClass = (partnerName: string) => {
    if (partnerName === "Provincia di Treviso") {
      return "w-full h-full object-contain";
    }
    return "w-16 h-16 object-contain";
  };

  return (
    <div className="bg-background">{/* Layout now handles min-h-screen */}
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary to-secondary overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/attached_assets/Panorama-Bosco.JPG')"
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            {/* Contenuto testo */}
            <div className="text-white flex-1">
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Enal Caccia, Pesca e Tiro - Treviso</h1>
              <p className="text-xl md:text-2xl mb-2">Sezione Provinciale di Treviso</p>
              <p className="text-lg mb-8 max-w-2xl">Attività associative, supporto ai soci, formazione e iniziative sul territorio: un punto di riferimento per caccia, pesca e tiro nella provincia di Treviso, nel rispetto delle norme e dell'ambiente.</p>
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
                src="/attached_assets/logo-enalcaccia-treviso.png?v=20260307" 
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
            <p className="text-muted-foreground max-w-2xl mx-auto">Enal Caccia Treviso offre una gamma completa di servizi per i soci della provincia.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Notizie e Comunicati</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Aggiornamenti ufficiali su eventi, circolari e attivita della sezione provinciale.
                </p>
                <Link href="/news">
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
          
          <div className="max-w-6xl mx-auto px-10 sm:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: latestNews.length > 3,
              }}
            >
              <CarouselContent>
                {latestNews.map((article, index) => (
                  <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                        {isPdfAsset(getNewsImage(article, index)) ? (
                          <iframe
                            src={`${getNewsImage(article, index)}#toolbar=0&navpanes=0&scrollbar=0`}
                            title={`Locandina ${article.title}`}
                            className="w-full h-full border-0"
                            loading="lazy"
                          />
                        ) : (
                          <img
                            src={getNewsImage(article, index)}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString('it-IT') : '-'}</span>
                          <Badge variant="secondary" className="ml-2">
                            {article.category}
                          </Badge>
                        </div>
                        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt?.trim() || `${article.content.slice(0, 160)}...`}</p>
                        <Link href="/news">
                          <Button variant="link" className="p-0">Vai alle notizie →</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 sm:-left-4" />
              <CarouselNext className="-right-2 sm:-right-4" />
            </Carousel>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <Card className="hover:shadow-lg transition-shadow border-forest/20">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 rounded-xl border bg-white p-2 flex items-center justify-center">
                  <img
                    src="/attached_assets/Logo Beccacino.jpg"
                    alt="Logo Il Beccaccino"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold">Il Beccaccino</h3>
                  <p className="text-sm text-muted-foreground mb-3">Accedi direttamente ai numeri PDF de Il Beccaccino.</p>
                  <Button asChild size="sm">
                    <a href="/magazine#il-beccaccino">Apri sezione Il Beccaccino</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-forest/20">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 rounded-xl border bg-white p-2 flex items-center justify-center">
                  <img
                    src="/attached_assets/logo caccia e natura.jpg"
                    alt="Logo Caccia e Natura"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold">Caccia e Natura</h3>
                  <p className="text-sm text-muted-foreground mb-3">Accedi direttamente ai numeri PDF di Caccia e Natura.</p>
                  <Button asChild size="sm">
                    <a href="/magazine#caccia-e-natura">Apri sezione Caccia e Natura</a>
                  </Button>
                </div>
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
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">La sezione provinciale opera sul territorio con finalità associative, formative e organizzative, promuovendo una pratica responsabile dell'attività venatoria, cinofila, alieutica e sportiva.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/attached_assets/logo-enalcaccia-treviso.png"
                alt="Logo Enalcaccia Treviso"
                className="rounded-lg shadow-lg w-full max-w-md mx-auto h-auto"
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

      {/* Partner Istituzionali */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">I Nostri Partner Istituzionali</h2>
            <p className="text-muted-foreground">In collaborazione con le principali istituzioni del settore venatorio</p>
          </div>
          
          <div className="max-w-6xl mx-auto px-12 sm:px-14">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {institutionalPartners.map((partner) => (
                  <CarouselItem key={partner.name} className="md:basis-1/2 lg:basis-1/3">
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block h-full"
                    >
                      <Card className="h-full p-6 text-center hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-white border-forest/10">
                        <div className={getPartnerLogoContainerClass(partner.name)}>
                          {partner.logoPath ? (
                            <img
                              src={partner.logoPath}
                              alt={`Logo ${partner.name}`}
                              className={getPartnerLogoImageClass(partner.name)}
                            />
                          ) : (
                            <span className="text-forest font-semibold text-sm px-2">{partner.name.slice(0, 3).toUpperCase()}</span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 min-h-12">{partner.description}</p>
                        <div className="flex items-center justify-center text-forest group-hover:text-forest/80">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Visita il sito</span>
                        </div>
                      </Card>
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 sm:-left-6" />
              <CarouselNext className="-right-4 sm:-right-6" />
            </Carousel>
          </div>
        </div>
      </section>

    </div>
  );
}
