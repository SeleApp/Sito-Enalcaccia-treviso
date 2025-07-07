import { EventsCalendar } from "@/components/events-calendar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Target, GraduationCap, Users } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Calendario Eventi
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Resta aggiornato su tutte le attività dell'associazione: gare, corsi di formazione, 
            riunioni e eventi speciali. Iscriviti direttamente dal calendario.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Prossimi Eventi
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-forest">12</div>
              <p className="text-xs text-muted-foreground">
                Nei prossimi 30 giorni
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Gare Attive
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">5</div>
              <p className="text-xs text-muted-foreground">
                Iscrizioni aperte
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Corsi Disponibili
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">3</div>
              <p className="text-xs text-muted-foreground">
                Posti ancora liberi
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                Gare e Competizioni
              </CardTitle>
              <CardDescription>
                Partecipa alle nostre gare di caccia, pesca sportiva e tiro a volo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Gare cinofile con prove di addestramento</li>
                <li>• Competizioni di pesca sportiva nei migliori laghi</li>
                <li>• Tornei di tiro a volo e precisione</li>
                <li>• Iscrizioni online con pagamento sicuro</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-500" />
                Corsi di Formazione
              </CardTitle>
              <CardDescription>
                Impara dalle migliori guide esperte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Corso base caccia</li>
                <li>• Addestramento cani</li>
                <li>• Sicurezza e primo soccorso</li>
                <li>• Certificazioni ufficiali</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Calendar */}
        <EventsCalendar />

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Azioni Rapide</CardTitle>
            <CardDescription>
              Gestisci la tua partecipazione agli eventi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Visualizza le Mie Iscrizioni
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Eventi Passati
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Trova Eventi Vicini
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}