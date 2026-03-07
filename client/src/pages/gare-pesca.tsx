import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Fish, Clock, Euro, Waves } from "lucide-react";

export default function GarePesca() {
  const garePesca = [
    {
      id: 1,
      titolo: "Campionato Provinciale di Pesca a Mosca",
      descrizione: "Gara di pesca a mosca nelle acque del fiume Piave, riservata ai tesserati ENAL.",
      disciplina: "Pesca a Mosca",
      luogo: "Fiume Piave - Ponte di Piave",
      dataGara: "2024-04-20",
      scadenzaIscrizioni: "2024-04-15",
      costo: 25,
      partecipantiMax: 50,
      partecipantiIscritti: 32,
      categoria: "Acque Interne"
    },
    {
      id: 2,
      titolo: "Gara di Pesca al Colpo - Lago",
      descrizione: "Competizione di pesca al colpo presso il lago di pesca sportiva di Castelfranco.",
      disciplina: "Pesca al Colpo",
      luogo: "Lago Sportivo Castelfranco Veneto",
      dataGara: "2024-05-05",
      scadenzaIscrizioni: "2024-04-30",
      costo: 20,
      partecipantiMax: 40,
      partecipantiIscritti: 18,
      categoria: "Acque Chiuse"
    },
    {
      id: 3,
      titolo: "Trofeo Spinning Mare - Jesolo",
      descrizione: "Gara di pesca spinning dalla riva nelle acque del litorale di Jesolo.",
      disciplina: "Spinning Mare",
      luogo: "Litorale di Jesolo",
      dataGara: "2024-05-18",
      scadenzaIscrizioni: "2024-05-12",
      costo: 30,
      partecipantiMax: 35,
      partecipantiIscritti: 14,
      categoria: "Acque Marine"
    }
  ];

  const isRegistrationOpen = (scadenza: string) => {
    const today = new Date();
    const deadline = new Date(scadenza);
    return deadline > today;
  };

  return (
    <div className="page-shell min-h-screen">
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Gare di Pesca</h1>
          <p className="page-subtitle">
            Partecipa alle nostre competizioni di pesca sportiva in acque interne e marine. 
            Eventi per tutti i livelli, dalla pesca a mosca allo spinning.
          </p>
        </div>

        {/* Informazioni Generali */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-blue-800">
                <Fish className="w-6 h-6 mr-3" />
                Pesca Sportiva ENAL
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                La sezione pesca dell'ENAL Caccia di Treviso organizza regolarmente gare di pesca sportiva 
                in diverse discipline e location. Le nostre competizioni si svolgono nel rispetto dell'ambiente 
                e seguendo le normative vigenti per la pesca sostenibile.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Waves className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-800">Acque Diverse</h3>
                  <p className="text-gray-600 text-sm">Fiumi, laghi e mare del Veneto</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Fish className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-800">Tecniche Varie</h3>
                  <p className="text-gray-600 text-sm">Mosca, spinning, colpo e surfcasting</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-800">Tutti i Livelli</h3>
                  <p className="text-gray-600 text-sm">Dalle categorie junior agli esperti</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gare Programmate */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Gare Programmate</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {garePesca.map((gara) => (
              <Card key={gara.id} className="hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-blue-800">{gara.titolo}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{gara.disciplina}</Badge>
                        <Badge variant="outline">{gara.categoria}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">€{gara.costo}</div>
                      <div className="text-sm text-gray-500">Quota</div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 mt-3">
                    {gara.descrizione}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{new Date(gara.dataGara).toLocaleDateString('it-IT')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      <span>Iscrizioni entro: {new Date(gara.scadenzaIscrizioni).toLocaleDateString('it-IT')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{gara.luogo}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{gara.partecipantiIscritti} / {gara.partecipantiMax} partecipanti</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
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
                        className={isRegistrationOpen(gara.scadenzaIscrizioni) ? "bg-blue-600 hover:bg-blue-700" : ""}
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

        {/* Regolamento e Informazioni */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">Regolamento Gare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Requisiti Generali</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Tessera ENAL Caccia valida</li>
                  <li>• Licenza di pesca in corso</li>
                  <li>• Rispetto orari di gara</li>
                  <li>• Attrezzatura personale</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Classifiche</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Classifica generale per peso</li>
                  <li>• Premio miglior esemplare</li>
                  <li>• Categoria Under 18</li>
                  <li>• Categoria Over 65</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Tecniche Ammesse</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Esche naturali e artificiali</li>
                  <li>• Catch & Release</li>
                  <li>• No kill per specie protette</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">Informazioni Pratiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Orari Standard</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Ritrovo: ore 6:00</li>
                  <li>• Inizio gara: ore 7:00</li>
                  <li>• Fine gara: ore 12:00</li>
                  <li>• Premiazioni: ore 13:00</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Cosa Portare</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Attrezzatura da pesca completa</li>
                  <li>• Sedia e parasole</li>
                  <li>• Contenitori per il pescato</li>
                  <li>• Tessera e documenti</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Contatti Sezione Pesca</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Responsabile:</strong> Marco Gialli<br />
                  <strong>Tel:</strong> 331 678 9012<br />
                  <strong>Email:</strong> pesca@enalcacciatreviso.it
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}