import { EventsCalendar } from "@/components/events-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="page-shell">{/* Layout now handles min-h-screen */}
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
              Evento confermato: 18/04/2026
            </CardTitle>
            <CardDescription>
              Consulta la locandina ufficiale per programma e modalita di partecipazione.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Provincia di Treviso
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href="/attached_assets/Locandina 18-04-26.pdf" target="_blank" rel="noopener noreferrer">
                  Apri locandina ufficiale
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/contact">Richiedi informazioni</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Calendar */}
        <EventsCalendar />

      </div>
    </div>
  );
}