import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { CalendarDays, Fish, Info, ArrowRight } from "lucide-react";

export default function GarePesca() {
  return (
    <div className="page-shell min-h-screen">
      <SEOHead
        title="Gare Pesca"
        description="Calendario delle gare di pesca di ENAL Caccia Treviso. Al momento non sono previste gare in programma."
        url="https://www.enalcacciatv.it/gare-pesca"
      />
      <div className="page-wrap">
        <div className="page-header">
          <h1 className="page-title">Gare di Pesca</h1>
          <p className="page-subtitle">
            Informazioni e aggiornamenti sulle iniziative della sezione provinciale Enalcaccia Treviso.
          </p>
        </div>

        <Card className="mx-auto max-w-3xl border-forest/20">
          <CardContent className="px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-forest/10">
              <Fish className="h-10 w-10 text-blue-700" aria-hidden="true" />
            </div>
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Non ci sono gare in programma al momento
            </h2>
            <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground">
              Il calendario delle competizioni è in fase di aggiornamento.
              Non appena saranno disponibili appuntamenti confermati, pubblicheremo
              qui le date, le locandine ufficiali e le modalità di partecipazione.
            </p>
            <div className="mt-7 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <span>Programmazione in aggiornamento</span>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-forest text-white hover:bg-forest/90">
                <Link href="/contact">
                  Richiedi informazioni <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/news">
                  <Info className="mr-2 h-4 w-4" />
                  Consulta le notizie
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
