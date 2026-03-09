import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { Fish, Target, Users, MapPin, Clock, BookOpen } from "lucide-react";

export default function PescaTiro() {
  const strutture = [
    {
      nome: "Laghetto Pesca Sportiva",
      tipo: "pesca",
      descrizione: "Lago artificiale per la pesca di carpe, trote e persici",
      ubicazione: "Castelfranco Veneto",
      servizi: ["Noleggio attrezzature", "Bar/Ristoro", "Parcheggio", "Pulizia pesce"]
    },
    {
      nome: "Poligono di Tiro TSN",
      tipo: "tiro", 
      descrizione: "Poligono per tiro a volo e precisione con 8 piazzole",
      ubicazione: "Treviso Centro",
      servizi: ["Noleggio armi", "Vendita munizioni", "Istruttori", "Bar"]
    },
    {
      nome: "Fiume Piave - Zona Pesca",
      tipo: "pesca",
      descrizione: "Tratto di fiume riservato ai soci per pesca a mosca e spinning",
      ubicazione: "Ponte di Piave",
      servizi: ["Accesso riservato", "Parcheggio", "Sentieri attrezzati"]
    }
  ];

  return (
    <div className="page-shell min-h-screen">
      <SEOHead
        title="Pesca e Tiro"
        description="Attivita pesca e tiro ENAL Caccia Treviso: strutture, servizi e iniziative dedicate agli associati."
        url="https://enalcaccia-treviso.replit.app/pesca-tiro"
      />
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Pesca & Tiro</h1>
          <p className="page-subtitle">
            Scopri le nostre attività di pesca sportiva e tiro, con corsi, eventi e strutture 
            per praticare i tuoi sport preferiti in un ambiente sicuro e professionale.
          </p>
        </div>

        {/* Introduzione Sezioni */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-l-4 border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-blue-800">
                <Fish className="w-6 h-6 mr-3" />
                Sezione Pesca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                La nostra sezione pesca offre opportunità per tutti gli appassionati, 
                dalle tecniche tradizionali come la pesca a mosca e al colpo, fino alle 
                moderne tecniche di spinning e surfcasting.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Pesca in acque interne (fiumi, laghi)
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Pesca in mare (dalla riva e da barca)
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Programmazione eventi comunicata con locandina ufficiale
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Gare e competizioni mensili
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-red-500">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-red-800">
                <Target className="w-6 h-6 mr-3" />
                Sezione Tiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                La sezione tiro promuove la pratica del tiro sportivo in tutte le sue 
                discipline, garantendo la massima sicurezza e il rispetto delle normative 
                vigenti per la gestione delle armi.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Tiro a volo (trap, skeet, sporting)
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Tiro di precisione a varie distanze
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Formazione sicurezza e normative
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Campionati e gare regionali
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attività ed Eventi */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">Programmazione Ufficiale</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-forest">Programmazione in aggiornamento</CardTitle>
              <CardDescription>
                Calendario e comunicazioni ufficiali delle sezioni Pesca e Tiro verranno pubblicati in questa area.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="secondary">In aggiornamento</Badge>
              <div className="flex gap-3 flex-wrap">
                <Button variant="outline" asChild>
                  <a href="/contact">Richiedi informazioni</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strutture e Impianti */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">Strutture e Impianti</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {strutture.map((struttura, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className={`text-lg ${
                    struttura.tipo === 'pesca' ? 'text-blue-800' : 'text-red-800'
                  }`}>
                    {struttura.nome}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {struttura.descrizione}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className={`w-4 h-4 mr-2 ${
                      struttura.tipo === 'pesca' ? 'text-blue-600' : 'text-red-600'
                    }`} />
                    <span>{struttura.ubicazione}</span>
                  </div>
                  
                  <div>
                    <h4 className={`font-semibold mb-2 ${
                      struttura.tipo === 'pesca' ? 'text-blue-800' : 'text-red-800'
                    }`}>
                      Servizi Disponibili
                    </h4>
                    <div className="space-y-1">
                      {struttura.servizi.map((servizio, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-600">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            struttura.tipo === 'pesca' ? 'bg-blue-500' : 'bg-red-500'
                          }`}></span>
                          {servizio}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Informazioni Generali */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-forest">Tesseramento e Accesso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-forest mb-2">Per la Pesca</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Tessera ENAL Caccia valida</li>
                  <li>• Licenza di pesca regionale</li>
                  <li>• Rispetto dei periodi di divieto</li>
                  <li>• Conoscenza regolamenti locali</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-forest mb-2">Per il Tiro</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Tessera ENAL Caccia valida</li>
                  <li>• Porto d'armi per uso sportivo</li>
                  <li>• Certificato medico sportivo</li>
                  <li>• Corso sicurezza completato</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-forest">Contatti Sezioni</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Responsabile Pesca</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Marco Gialli</strong><br />
                  Tel: 331 678 9012<br />
                  Email: pesca@enalcacciatreviso.it<br />
                  Ricevimento: Mer-Ven 18:00-20:00
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Responsabile Tiro</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Giuseppe Bianchi</strong><br />
                  Tel: 347 234 5678<br />
                  Email: tiro@enalcacciatreviso.it<br />
                  Ricevimento: Lun-Mer 18:00-20:00
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-gray-600 text-sm">
                  <strong>Sede:</strong> Via Roma, 123 - Treviso<br />
                  <strong>Orari:</strong> Lun-Ven 18:00-20:00, Sab 9:00-12:00
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}