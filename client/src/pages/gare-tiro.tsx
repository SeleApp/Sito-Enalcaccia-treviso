import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Target, Clock, Euro, Crosshair } from "lucide-react";

export default function GareTiro() {
  const gareTiro = [
    {
      id: 1,
      titolo: "Campionato Provinciale Tiro a Volo",
      descrizione: "Gara di tiro a volo con piattelli, specialità trap e skeet per tutte le categorie.",
      disciplina: "Tiro a Volo",
      luogo: "Poligono TSN Treviso",
      dataGara: "2024-04-14",
      scadenzaIscrizioni: "2024-04-10",
      costo: 35,
      partecipantiMax: 60,
      partecipantiIscritti: 42,
      categoria: "Tutte le Categorie",
      piattelli: 75
    },
    {
      id: 2,
      titolo: "Gara Tiro di Precisione - 100m",
      descrizione: "Competizione di tiro di precisione a 100 metri con carabina su bersaglio fisso.",
      disciplina: "Tiro di Precisione",
      luogo: "Poligono di Castelfranco",
      dataGara: "2024-04-28",
      scadenzaIscrizioni: "2024-04-25",
      costo: 25,
      partecipantiMax: 30,
      partecipantiIscritti: 18,
      categoria: "Carabina",
      distanza: "100m"
    },
    {
      id: 3,
      titolo: "Trofeo Compak Sporting",
      descrizione: "Gara di compak sporting con percorso a stazioni multiple e tiri variabili.",
      disciplina: "Compak Sporting",
      luogo: "Campo Tiro Montebelluna",
      dataGara: "2024-05-12",
      scadenzaIscrizioni: "2024-05-08",
      costo: 40,
      partecipantiMax: 50,
      partecipantiIscritti: 23,
      categoria: "Open",
      stazioni: 8
    }
  ];

  const categorie = [
    { nome: "Junior", eta: "Under 18", descrizione: "Giovani tiratori fino a 18 anni" },
    { nome: "Senior", eta: "18-65", descrizione: "Categoria principale" },
    { nome: "Veterani", eta: "Over 65", descrizione: "Tiratori esperti over 65" },
    { nome: "Dame", eta: "Tutte", descrizione: "Categoria femminile" }
  ];

  const isRegistrationOpen = (scadenza: string) => {
    const today = new Date();
    const deadline = new Date(scadenza);
    return deadline > today;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-800 mb-4">Gare di Tiro</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Competizioni di tiro sportivo in diverse discipline: tiro a volo, precisione e compak sporting. 
            Testa la tua abilità nei nostri poligoni affiliati.
          </p>
        </div>

        {/* Informazioni Generali */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-red-800">
                <Target className="w-6 h-6 mr-3" />
                Tiro Sportivo ENAL
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                La sezione tiro dell'ENAL Caccia di Treviso organizza competizioni di tiro sportivo in diverse 
                discipline, utilizzando i migliori poligoni della provincia. Tutte le gare si svolgono nel rispetto 
                delle normative di sicurezza e sono aperte a tiratori di ogni livello.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-red-800">Diverse Discipline</h3>
                  <p className="text-gray-600 text-sm">Tiro a volo, precisione e sporting</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Crosshair className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-red-800">Sicurezza</h3>
                  <p className="text-gray-600 text-sm">Massima attenzione alle procedure</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-red-800">Per Tutti</h3>
                  <p className="text-gray-600 text-sm">Dalla categoria junior ai veterani</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gare Programmate */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-red-800 mb-8 text-center">Gare Programmate</h2>
          <div className="space-y-6">
            {gareTiro.map((gara) => (
              <Card key={gara.id} className="hover:shadow-lg transition-shadow border-l-4 border-red-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-red-800">{gara.titolo}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{gara.disciplina}</Badge>
                        <Badge variant="outline">{gara.categoria}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">€{gara.costo}</div>
                      <div className="text-sm text-gray-500">Quota</div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 mt-3">
                    {gara.descrizione}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-red-600" />
                      <span>{new Date(gara.dataGara).toLocaleDateString('it-IT')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-red-600" />
                      <span>Iscrizioni entro: {new Date(gara.scadenzaIscrizioni).toLocaleDateString('it-IT')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-red-600" />
                      <span>{gara.luogo}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-red-600" />
                      <span>{gara.partecipantiIscritti} / {gara.partecipantiMax}</span>
                    </div>
                  </div>

                  {/* Dettagli specifici per disciplina */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {gara.piattelli && (
                        <div className="flex items-center text-gray-600">
                          <Target className="w-4 h-4 mr-2 text-red-600" />
                          <span>{gara.piattelli} piattelli</span>
                        </div>
                      )}
                      {gara.distanza && (
                        <div className="flex items-center text-gray-600">
                          <Crosshair className="w-4 h-4 mr-2 text-red-600" />
                          <span>Distanza: {gara.distanza}</span>
                        </div>
                      )}
                      {gara.stazioni && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-red-600" />
                          <span>{gara.stazioni} stazioni</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(gara.partecipantiIscritti / gara.partecipantiMax) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {isRegistrationOpen(gara.scadenzaIscrizioni) ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Iscrizioni Aperte
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            Iscrizioni Chiuse
                          </Badge>
                        )}
                        {gara.partecipantiIscritti >= gara.partecipantiMax && (
                          <Badge variant="outline">
                            Completa
                          </Badge>
                        )}
                      </div>
                      <Button 
                        variant={isRegistrationOpen(gara.scadenzaIscrizioni) && gara.partecipantiIscritti < gara.partecipantiMax ? "default" : "outline"} 
                        className={isRegistrationOpen(gara.scadenzaIscrizioni) ? "bg-red-600 hover:bg-red-700" : ""}
                        disabled={!isRegistrationOpen(gara.scadenzaIscrizioni) || gara.partecipantiIscritti >= gara.partecipantiMax}
                      >
                        {isRegistrationOpen(gara.scadenzaIscrizioni) 
                          ? (gara.partecipantiIscritti < gara.partecipantiMax ? "Iscriviti" : "Lista d'Attesa")
                          : "Visualizza"
                        }
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categorie e Regolamenti */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-800">Categorie di Gara</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categorie.map((categoria, index) => (
                  <div key={index} className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-red-800">{categoria.nome}</h4>
                    <p className="text-sm text-gray-600">{categoria.eta}</p>
                    <p className="text-sm text-gray-700">{categoria.descrizione}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-800">Regolamento Generale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Requisiti Obbligatori</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Tessera ENAL Caccia valida</li>
                  <li>• Porto d'armi per uso sportivo</li>
                  <li>• Certificato medico sportivo</li>
                  <li>• Armi e munizioni a norma</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Sicurezza</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Rispetto rigoroso delle procedure</li>
                  <li>• Protezioni auricolari obbligatorie</li>
                  <li>• Controllo armi prima della gara</li>
                  <li>• Presenza di ufficiali di tiro</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informazioni Poligoni */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-red-800">Poligoni Affiliati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-red-800 mb-2">TSN Treviso</h4>
                <p className="text-sm text-gray-600 mb-2">Specialità: Tiro a volo</p>
                <p className="text-sm text-gray-700">
                  Via delle Rose, 45<br />
                  31100 Treviso<br />
                  Tel: 0422 456789
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Poligono Castelfranco</h4>
                <p className="text-sm text-gray-600 mb-2">Specialità: Tiro di precisione</p>
                <p className="text-sm text-gray-700">
                  Via del Tiro, 12<br />
                  31033 Castelfranco Veneto<br />
                  Tel: 0423 123456
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Campo Tiro Montebelluna</h4>
                <p className="text-sm text-gray-600 mb-2">Specialità: Compak sporting</p>
                <p className="text-sm text-gray-700">
                  Località Biscani, 8<br />
                  31044 Montebelluna<br />
                  Tel: 0423 987654
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}