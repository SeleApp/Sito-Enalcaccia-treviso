import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen } from "lucide-react";

export default function ScuolaVenatoria() {
  return (
    <div className="page-shell min-h-screen">
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Scuola Venatoria</h1>
          <p className="page-subtitle">
            Formazione professionale per cacciatori e addestratori, con corsi teorici e pratici 
            per tutti i livelli di esperienza.
          </p>
        </div>

        {/* Introduzione */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-forest">
                <BookOpen className="w-6 h-6 mr-3" />
                La Nostra Scuola
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                La Scuola Venatoria dell'ENAL Caccia - Sezione Provinciale di Treviso offre una formazione 
                completa e professionale per tutti coloro che desiderano approfondire le proprie conoscenze 
                nel mondo venatorio. I nostri corsi coprono tutti gli aspetti della caccia moderna, 
                dall'addestramento cinofilo alla preparazione per gli esami di abilitazione.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mt-4">
                Con istruttori qualificati e strutture all'avanguardia, garantiamo un'esperienza formativa 
                di alta qualità, rispettosa dell'ambiente e della tradizione venatoria italiana.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Corsi Disponibili */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">Programmazione Corsi</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-forest">Corsi in aggiornamento</CardTitle>
              <CardDescription>
                Al momento non sono pubblicati corsi attivi. E disponibile un solo evento ufficiale confermato.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Evento confermato: 18/04/2026
              </p>
              <Badge variant="secondary">Locandina ufficiale disponibile</Badge>
              <div>
                <a
                  href="/attached_assets/Locandina 18-04-26.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest hover:underline"
                >
                  Apri locandina evento
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informazioni Aggiuntive */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-forest">Iscrizioni</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Per iscriversi ai corsi è necessario essere tesserati ENAL Caccia. 
                Le modalità di adesione e i documenti richiesti vengono comunicati dalla segreteria.
              </p>
              <p className="text-gray-700">
                Per informazioni e iscrizioni utilizza la pagina contatti del sito:
                <strong className="text-forest"> modulo contatti</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-forest">Sede e Orari</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                <strong>Sede Corsi:</strong><br />
                Strutture convenzionate sul territorio provinciale<br />
                (dettagli comunicati in fase di iscrizione)
              </p>
              <p className="text-gray-700">
                <strong>Orari:</strong><br />
                Definiti in base al calendario del corso<br />
                e alle disponibilità delle strutture
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}