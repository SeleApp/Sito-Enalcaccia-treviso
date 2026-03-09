import { EventsCalendar } from "@/components/events-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SEOHead } from "@/components/seo-head";
import { Calendar } from "lucide-react";

const eventPosters = [
  {
    id: "locandina-fibec",
    title: "Evento FIBEC",
    dateLabel: "Date da calendario FIBEC",
    image: "/attached_assets/Locandina Fibec.jpg",
    calendarImage: "/attached_assets/Calendario fibec .jpg",
    feeImage: "/attached_assets/Quota partecipazione fibec.jpg",
  },
  {
    id: "locandina-lupo",
    title: "Evento Lupo",
    dateLabel: "Programmazione dedicata",
    image: "/attached_assets/Locandina Lupo.jpg",
  },
  {
    id: "locandina-180426",
    title: "Evento ufficiale ENAL Caccia Treviso",
    dateLabel: "18 aprile 2026",
    image: "/attached_assets/Locandina 18-04-26.png",
    pdf: "/attached_assets/Locandina 18-04-26.pdf",
  },
];

export default function EventsPage() {
  return (
    <div className="page-shell">{/* Layout now handles min-h-screen */}
      <SEOHead
        title="Eventi"
        description="Calendario eventi ufficiali ENAL Caccia Treviso con locandine, date e aggiornamenti organizzativi."
        url="https://enalcaccia-treviso.replit.app/eventi"
      />
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            Calendario Eventi
          </h1>
          <p className="page-subtitle">
            Calendario ufficiale aggiornato con il prossimo evento confermato dalla sezione.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-forest" />
              Locandine eventi
            </CardTitle>
            <CardDescription>
              Sfoglia le locandine degli eventi pubblicati dalla sezione. Il calendario completo si trova subito sotto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-5xl mx-auto px-8 sm:px-10">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {eventPosters.map((poster) => (
                    <CarouselItem key={poster.id} className="md:basis-1/2 lg:basis-1/2">
                      <Card className="overflow-hidden h-full border-forest/20">
                        <div className="aspect-[4/5] bg-muted">
                          <img
                            src={poster.image}
                            alt={poster.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold leading-tight">{poster.title}</h3>
                            <Badge variant="outline" className="whitespace-nowrap">
                              {poster.dateLabel}
                            </Badge>
                          </div>
                          {poster.id === "locandina-fibec" ? (
                            <div className="grid gap-2">
                              <Button asChild size="sm" className="w-full">
                                <a href={poster.image} target="_blank" rel="noopener noreferrer">
                                  Apri locandina FIBEC
                                </a>
                              </Button>
                              <Button asChild size="sm" variant="outline" className="w-full">
                                <a href={poster.calendarImage} target="_blank" rel="noopener noreferrer">
                                  Apri calendario FIBEC
                                </a>
                              </Button>
                              <Button asChild size="sm" variant="outline" className="w-full">
                                <a href={poster.feeImage} target="_blank" rel="noopener noreferrer">
                                  Apri quota iscrizione
                                </a>
                              </Button>
                            </div>
                          ) : poster.pdf ? (
                            <Button asChild size="sm" className="w-full">
                              <a href={poster.pdf} target="_blank" rel="noopener noreferrer">
                                Apri locandina
                              </a>
                            </Button>
                          ) : (
                            <Button asChild size="sm" variant="outline" className="w-full">
                              <a href="/contact">Ricevi aggiornamenti</a>
                            </Button>
                          )}
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

        {/* Main Calendar */}
        <EventsCalendar />

      </div>
    </div>
  );
}