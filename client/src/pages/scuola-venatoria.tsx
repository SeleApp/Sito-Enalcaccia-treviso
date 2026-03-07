import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, BookOpen } from "lucide-react";

export default function ScuolaVenatoria() {
  const corsi = [
    {
      id: 1,
      titolo: "Percorso Base di Formazione Venatoria",
      descrizione: "Modulo introduttivo su sicurezza, etica venatoria, normativa e comportamento sul territorio.",
      durata: "Calendario modulare",
      frequenza: "Lezioni teorico-pratiche",
      prossimo: "In programmazione",
      posti: 25,
      prezzo: "Quote comunicate dalla segreteria"
    },
    {
      id: 2,
      titolo: "Percorso Cinofilo Specialistico",
      descrizione: "Approfondimenti su conduzione, gestione in prova e preparazione dei cani da lavoro.",
      durata: "Calendario modulare",
      frequenza: "Sessioni pratiche guidate",
      prossimo: "In programmazione",
      posti: 18,
      prezzo: "Quote comunicate dalla segreteria"
    },
    {
      id: 3,
      titolo: "Supporto alla Preparazione Abilitazioni",
      descrizione: "Incontri orientativi su iter, documentazione e studio per le prove di abilitazione.",
      durata: "Ciclo di incontri",
      frequenza: "Programmazione periodica",
      prossimo: "In programmazione",
      posti: 30,
      prezzo: "Quote comunicate dalla segreteria"
    }
  ];

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
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">Corsi Disponibili</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {corsi.map((corso) => (
              <Card key={corso.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-forest">{corso.titolo}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {corso.descrizione}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{corso.durata} - {corso.frequenza}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Prossimo: {corso.prossimo}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{corso.posti} posti disponibili</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {corso.prezzo}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      ID Corso: {corso.id}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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