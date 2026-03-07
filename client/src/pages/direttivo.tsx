import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function Direttivo() {
  const membri = [
    {
      nome: "Presidente Provinciale",
      ruolo: "Presidente",
      descrizione: "Coordina le attività istituzionali della sezione e rappresenta l'associazione sul territorio.",
      email: "Contatto tramite segreteria",
      telefono: "Disponibile su richiesta",
      mandato: "In corso"
    },
    {
      nome: "Vicepresidenza",
      ruolo: "Vice Presidente",
      descrizione: "Supporta la Presidenza e segue i progetti operativi della sezione.",
      email: "Contatto tramite segreteria",
      telefono: "Disponibile su richiesta",
      mandato: "In corso"
    },
    {
      nome: "Segreteria",
      ruolo: "Segretario",
      descrizione: "Gestisce comunicazioni, pratiche amministrative e supporto ai soci.",
      email: "Contatto tramite modulo",
      telefono: "Disponibile su richiesta",
      mandato: "In corso"
    },
    {
      nome: "Tesoreria",
      ruolo: "Tesoriere",
      descrizione: "Cura la gestione economica, i bilanci e i flussi amministrativi.",
      email: "Contatto tramite segreteria",
      telefono: "Disponibile su richiesta",
      mandato: "In corso"
    },
    {
      nome: "Consigliere Area Venatoria",
      ruolo: "Consigliere",
      descrizione: "Supporta attività tecniche e iniziative legate al territorio e alla normativa.",
      email: "Contatto tramite segreteria",
      telefono: "Disponibile su richiesta",
      mandato: "In corso"
    },
    {
      nome: "Consigliere Attività Sportive",
      ruolo: "Consigliere",
      descrizione: "Segue progetti legati a cinofilia, pesca sportiva e attività formative.",
      email: "Contatto tramite segreteria",
      telefono: "Disponibile su richiesta",
      mandato: "In corso"
    }
  ];

  const riunioni = [
    {
      data: "Calendario annuale",
      ora: "Comunicata ai soci",
      argomenti: ["Programmazione attività", "Gestione associativa", "Aggiornamenti normativi"]
    },
    {
      data: "Assemblea soci",
      ora: "Convocazione ufficiale",
      argomenti: ["Relazioni annuali", "Bilancio", "Linee guida stagione successiva"]
    },
    {
      data: "Riunioni straordinarie",
      ora: "Quando necessario", 
      argomenti: ["Temi urgenti", "Coordinamento eventi", "Supporto ai soci"]
    }
  ];

  return (
    <div className="page-shell min-h-screen">
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Consiglio Direttivo</h1>
          <p className="page-subtitle">
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
                    <a href="/contact" className="hover:text-forest transition-colors">
                      {membro.email}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-forest" />
                    <a href="/contact" className="hover:text-forest transition-colors">
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
                    <p>Provincia di Treviso (TV)</p>
                    <p>Dettagli disponibili tramite segreteria</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-forest mb-2">Orari di Ricevimento</h4>
                <div className="text-gray-600 space-y-1">
                  <p><strong>Sportello:</strong> su appuntamento</p>
                  <p><strong>Comunicazioni:</strong> tramite modulo contatti</p>
                  <p><strong>Aggiornamenti:</strong> pubblicati sui canali ufficiali</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-forest mb-2">Contatti Generali</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-forest" />
                    <span>Disponibile su richiesta</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-forest" />
                    <span>Usa il modulo nella pagina Contatti</span>
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