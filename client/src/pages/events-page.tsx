import { EventsCalendar } from "@/components/events-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SEOHead } from "@/components/seo-head";
import { Calendar, ExternalLink } from "lucide-react";

import { eventPosters } from "@/lib/event-posters";

export default function EventsPage() {
  return (
    <div className="page-shell">
      <SEOHead
        title="Eventi"
        description="Locandine ufficiali e calendario delle iniziative di Enalcaccia Treviso e delle realtà venatorie del territorio, con date e articoli di approfondimento."
        url="https://www.enalcacciatv.it/eventi"
      />
      <div className="page-wrap">
        <div className="page-header">
          <h1 className="page-title">Calendario Eventi</h1>
          <p className="page-subtitle">
            Le iniziative del territorio, le locandine originali e gli approfondimenti pubblicati
            nelle Notizie. Gli appuntamenti già trascorsi rimangono consultabili nell’archivio.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-forest" />
              Locandine eventi
            </CardTitle>
            <CardDescription>
              Una raccolta delle locandine delle iniziative documentate: apri il manifesto
              originale oppure leggi l’articolo collegato. Le date indicate si riferiscono
              agli eventi, non al giorno di caricamento delle immagini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto max-w-6xl px-7 sm:px-10">
              <Carousel opts={{ align: "start", loop: false }}>
                <CarouselContent className="py-1">
                  {eventPosters.map((poster) => (
                    <CarouselItem
                      key={poster.id}
                      className="basis-full md:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="flex h-full flex-col overflow-hidden border-forest/20">
                        <a
                          href={poster.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Apri la locandina: ${poster.title}`}
                          className="flex aspect-[4/5] items-center justify-center bg-white p-3"
                        >
                          <img
                            src={poster.image}
                            alt={`Locandina: ${poster.title}, ${poster.dateLabel}`}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                        </a>
                        <CardContent className="flex flex-1 flex-col gap-3 p-4">
                          <div className="space-y-2">
                            <Badge variant="secondary">{poster.dateLabel}</Badge>
                            <h3 className="font-semibold leading-snug">{poster.title}</h3>
                          </div>
                          <div className="mt-auto flex flex-wrap gap-2 pt-2">
                            <Button asChild size="sm" variant="outline">
                              <a href={poster.document || poster.image} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Apri locandina
                              </a>
                            </Button>
                            {poster.article && (
                              <Button asChild size="sm">
                                <a href={poster.article}>Leggi la notizia</a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-2 sm:-left-4" />
                <CarouselNext className="-right-2 sm:-right-4" />
              </Carousel>
            </div>
          </CardContent>
        </Card>

        <EventsCalendar />
      </div>
    </div>
  );
}
