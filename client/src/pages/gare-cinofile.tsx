import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { Calendar, MapPin, Users, Trophy, Clock } from "lucide-react";

const DOG_PHOTO_1 = "/attached_assets/cane-caccia-1.jpg";
const DOG_PHOTO_2 = "/attached_assets/cane-caccia-2.jpg";

export default function GareCinofile() {
  const eventoUfficiale = {
    titolo: "Evento programmato ENAL Caccia Treviso",
    disciplina: "Cinofilia venatoria",
    descrizione:
      "Evento ufficiale confermato dalla sezione. Per programma completo, modalita di partecipazione e dettagli organizzativi, consultare la locandina ufficiale.",
    data: "18/04/2026",
    scadenza: "Come da locandina",
    luogo: "Provincia di Treviso",
    partecipanti: "Disponibilita come da locandina",
  };

  return (
    <div className="page-shell min-h-screen">
      <SEOHead
        title="Gare Cinofile"
        description="Programma gare cinofile ENAL Caccia Treviso: eventi ufficiali, regolamenti e informazioni di partecipazione."
        url="https://enalcaccia-treviso.replit.app/gare-cinofile"
      />
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Gare Cinofile</h1>
          <p className="page-subtitle">
            Competizioni dedicate all'addestramento e alle performance dei cani da caccia. 
            Partecipa alle nostre gare specialistiche e metti alla prova le abilità del tuo compagno a quattro zampe.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <img
              src={DOG_PHOTO_1}
              alt="Cane da caccia in ferma"
              className="w-full h-64 object-cover rounded-xl shadow"
            />
            <img
              src={DOG_PHOTO_2}
              alt="Cane da caccia in campo"
              className="w-full h-64 object-cover rounded-xl shadow"
            />
          </div>
        </div>

        {/* Informazioni Generali */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-forest">
                <Trophy className="w-6 h-6 mr-3" />
                Cosa Sono le Gare Cinofile
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                Le gare cinofile sono competizioni che testano le abilità naturali e addestrate dei cani da caccia. 
                Questi eventi includono prove di ricerca, seguita, riporto e altre discipline specifiche per ogni razza e tipologia di caccia.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-8 h-8 text-forest" />
                  </div>
                  <h3 className="font-semibold text-forest">Competizione</h3>
                  <p className="text-gray-600 text-sm">Prove tecniche e valutazioni specialistiche</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-forest" />
                  </div>
                  <h3 className="font-semibold text-forest">Socializzazione</h3>
                  <p className="text-gray-600 text-sm">Incontro tra appassionati e scambio di esperienze</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-forest" />
                  </div>
                  <h3 className="font-semibold text-forest">Formazione</h3>
                  <p className="text-gray-600 text-sm">Miglioramento continuo delle tecniche</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gare Programmate */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">Gare Programmate</h2>
          <div className="grid lg:grid-cols-1 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-forest">{eventoUfficiale.titolo}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {eventoUfficiale.disciplina}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-gray-600 mt-3">{eventoUfficiale.descrizione}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-forest" />
                    <span>{eventoUfficiale.data}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-forest" />
                    <span>{eventoUfficiale.scadenza}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-forest" />
                    <span>{eventoUfficiale.luogo}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-forest" />
                    <span>{eventoUfficiale.partecipanti}</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex flex-wrap gap-3">
                  <Button className="bg-forest hover:bg-forest/90" asChild>
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
          </div>
        </div>

        {/* Regolamento e Informazioni */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-forest">Regolamento Gare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-forest mb-2">Requisiti di Partecipazione</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Tessera ENAL Caccia in corso di validità</li>
                  <li>• Certificato sanitario del cane</li>
                  <li>• Iscrizione entro i termini stabiliti</li>
                  <li>• Pagamento della quota di partecipazione</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-forest mb-2">Categorie</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Cani da ferma</li>
                  <li>• Cani da seguita</li>
                  <li>• Cani da riporto</li>
                  <li>• Cani da tana</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-forest">Come Partecipare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-forest mb-2">Procedura di Iscrizione</h4>
                <ol className="text-gray-700 space-y-2 text-sm">
                  <li>1. Verifica i requisiti di partecipazione</li>
                  <li>2. Compila il modulo di iscrizione online</li>
                  <li>3. Effettua il pagamento della quota</li>
                  <li>4. Presenta la documentazione richiesta</li>
                  <li>5. Ricevi conferma di partecipazione</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-forest mb-2">Contatti</h4>
                <p className="text-gray-700 text-sm">
                  Per informazioni sulle gare cinofile:<br />
                  <strong>Canale ufficiale:</strong> pagina Contatti del sito<br />
                  <strong>Segreteria:</strong> riscontro tramite modulo online
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}