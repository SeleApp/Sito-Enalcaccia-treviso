import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, BookOpen } from "lucide-react";

export default function ScuolaVenatoria() {
  const corsi = [
    {
      id: 1,
      titolo: "Corso Base di Addestramento Cani",
      descrizione: "Corso introduttivo per l'addestramento dei cani da caccia, rivolto a principianti.",
      durata: "8 settimane",
      frequenza: "2 volte a settimana",
      prossimo: "15 Marzo 2024",
      posti: 20,
      prezzo: "€ 150"
    },
    {
      id: 2,
      titolo: "Addestramento Avanzato - Seguita",
      descrizione: "Corso specialistico per cani da seguita su cinghiale e capriolo.",
      durata: "12 settimane",
      frequenza: "3 volte a settimana",
      prossimo: "1 Aprile 2024",
      posti: 15,
      prezzo: "€ 250"
    },
    {
      id: 3,
      titolo: "Preparazione Esami Patente",
      descrizione: "Corso di preparazione per l'esame della patente di caccia.",
      durata: "4 settimane",
      frequenza: "1 volta a settimana",
      prossimo: "20 Marzo 2024",
      posti: 30,
      prezzo: "€ 80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-forest mb-4">Scuola Venatoria</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                Le iscrizioni devono essere effettuate almeno 7 giorni prima dell'inizio del corso.
              </p>
              <p className="text-gray-700">
                Per informazioni e iscrizioni contattare la segreteria al numero: 
                <strong className="text-forest"> 0422 123456</strong>
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
                Centro Cinofilo ENAL Caccia<br />
                Via dei Cacciatori, 15 - Treviso
              </p>
              <p className="text-gray-700">
                <strong>Orari:</strong><br />
                Mattina: 9:00 - 12:00<br />
                Pomeriggio: 14:00 - 17:00
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}