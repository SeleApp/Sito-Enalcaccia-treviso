import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function Direttivo() {
  const membri = [
    {
      nome: "Mario Rossi",
      ruolo: "Presidente",
      descrizione: "Guida l'associazione dal 2018, con oltre 30 anni di esperienza nella caccia.",
      email: "presidente@enalcacciatreviso.it",
      telefono: "339 123 4567",
      mandato: "2022-2025"
    },
    {
      nome: "Giuseppe Bianchi",
      ruolo: "Vice Presidente",
      descrizione: "Esperto in cinofilia, responsabile dei corsi di addestramento.",
      email: "vicepresidente@enalcacciatreviso.it",
      telefono: "347 234 5678",
      mandato: "2022-2025"
    },
    {
      nome: "Anna Verdi",
      ruolo: "Segretario",
      descrizione: "Gestisce la parte amministrativa e i rapporti con gli enti.",
      email: "segretario@enalcacciatreviso.it",
      telefono: "333 345 6789",
      mandato: "2022-2025"
    },
    {
      nome: "Franco Neri",
      ruolo: "Tesoriere",
      descrizione: "Responsabile della gestione finanziaria dell'associazione.",
      email: "tesoriere@enalcacciatreviso.it",
      telefono: "338 456 7890",
      mandato: "2022-2025"
    },
    {
      nome: "Luca Blu",
      ruolo: "Consigliere",
      descrizione: "Esperto in normative venatorie e gestione del territorio.",
      email: "consigliere1@enalcacciatreviso.it",
      telefono: "349 567 8901",
      mandato: "2022-2025"
    },
    {
      nome: "Marco Gialli",
      ruolo: "Consigliere",
      descrizione: "Specialista in pesca sportiva e organizzazione eventi.",
      email: "consigliere2@enalcacciatreviso.it",
      telefono: "331 678 9012",
      mandato: "2022-2025"
    }
  ];

  const riunioni = [
    {
      data: "15 Marzo 2024",
      ora: "20:30",
      argomenti: ["Bilancio 2023", "Programmazione gare primaverili", "Manutenzione strutture"]
    },
    {
      data: "20 Aprile 2024", 
      ora: "20:30",
      argomenti: ["Risultati gare", "Nuove iscrizioni", "Progetti estivi"]
    },
    {
      data: "18 Maggio 2024",
      ora: "20:30", 
      argomenti: ["Assemblea soci", "Elezioni cariche", "Bilancio preventivo"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-forest mb-4">Consiglio Direttivo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Il nostro team di dirigenti lavora con passione per promuovere le attività venatorie 
            e sportive nella provincia di Treviso.
          </p>
        </div>

        {/* Membri del Direttivo */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">Membri del Consiglio</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {membri.map((membro, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-forest">{membro.nome}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {membro.ruolo}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 mt-3">
                    {membro.descrizione}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-forest" />
                    <a href={`mailto:${membro.email}`} className="hover:text-forest transition-colors">
                      {membro.email}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-forest" />
                    <a href={`tel:${membro.telefono}`} className="hover:text-forest transition-colors">
                      {membro.telefono}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-forest" />
                    <span>Mandato: {membro.mandato}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Prossime Riunioni */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-forest">Prossime Riunioni</CardTitle>
              <CardDescription>
                Calendario delle riunioni del consiglio direttivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {riunioni.map((riunione, index) => (
                <div key={index} className="border-l-4 border-forest pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-forest">{riunione.data}</h4>
                    <Badge variant="outline">{riunione.ora}</Badge>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {riunione.argomenti.map((argomento, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-forest rounded-full mr-2"></span>
                        {argomento}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-forest">Informazioni Generali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-forest mb-2">Sede Legale</h4>
                <div className="flex items-start text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-1 text-forest" />
                  <div>
                    <p>Via Roma, 123</p>
                    <p>31100 Treviso (TV)</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-forest mb-2">Orari di Ricevimento</h4>
                <div className="text-gray-600 space-y-1">
                  <p><strong>Lunedì - Venerdì:</strong> 18:00 - 20:00</p>
                  <p><strong>Sabato:</strong> 9:00 - 12:00</p>
                  <p><strong>Domenica:</strong> Chiuso</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-forest mb-2">Contatti Generali</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-forest" />
                    <span>0422 123456</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-forest" />
                    <span>info@enalcacciatreviso.it</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}