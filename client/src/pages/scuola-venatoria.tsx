import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";
import { BookOpen } from "lucide-react";

export default function ScuolaVenatoria() {
  return (
    <div className="page-shell min-h-screen">
      <SEOHead
        title="Scuola Venatoria"
        description="Scuola venatoria ENAL Caccia Treviso: formazione teorica e pratica per cacciatori e percorsi di aggiornamento."
        url="https://enalcaccia-treviso.replit.app/scuola-venatoria"
      />
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Scuola Venatoria</h1>
          <p className="page-subtitle">
            Percorsi formativi dedicati ai soci per aggiornamento normativo, sicurezza operativa 
            e cultura venatoria responsabile.
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
                completa per chi desidera consolidare competenze tecniche, normative e organizzative 
                legate all'attivita venatoria sul territorio provinciale.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mt-4">
                I moduli formativi vengono pubblicati con comunicazioni ufficiali e possono includere 
                aggiornamenti su sicurezza, gestione faunistica, adempimenti amministrativi e pratica responsabile.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Corsi Disponibili */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">Programmazione Corsi</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-forest">Calendario formativo</CardTitle>
              <CardDescription>
                Il calendario viene aggiornato periodicamente in base alle disponibilita organizzative e ai fabbisogni della sezione.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="secondary">Pubblicazione periodica</Badge>
              <p className="text-sm text-muted-foreground">
                Le date confermate vengono comunicate tramite notizie, avvisi e canali ufficiali della sezione.
              </p>
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