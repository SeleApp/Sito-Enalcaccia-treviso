import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, Database, Eye, Users, FileText } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-forest mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR)
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
          </p>
        </div>

        {/* Sezione 1 - Titolare del Trattamento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <Shield className="w-5 h-5 mr-2" />
              1. Titolare del Trattamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-gray-700">
                <strong>ENAL Caccia - Sezione Provinciale di Treviso</strong>
              </p>
              <p className="text-gray-600">
                Sede legale: Via Roma, 123 - 31100 Treviso (TV)<br/>
                Codice Fiscale: 12345678901<br/>
                Telefono: 0422 123456<br/>
                Email: privacy@enalcacciatreviso.it<br/>
                PEC: enalcacciatreviso@pec.it
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sezione 2 - Dati Raccolti */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <Database className="w-5 h-5 mr-2" />
              2. Tipologie di Dati Personali Trattati
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-forest mb-2">Dati Identificativi</h4>
              <p className="text-gray-700">
                Nome, cognome, codice fiscale, data e luogo di nascita, indirizzo di residenza, 
                numero di telefono, indirizzo email.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-forest mb-2">Dati Relativi alle Licenze</h4>
              <p className="text-gray-700">
                Numero porto d'armi, licenza di caccia, certificato medico sportivo, 
                tessera venatoria, documenti di identità.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-forest mb-2">Dati di Pagamento</h4>
              <p className="text-gray-700">
                Informazioni relative ai pagamenti effettuati tramite sistemi di pagamento sicuri 
                (gestiti da fornitori terzi certificati PCI DSS).
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-forest mb-2">Dati di Navigazione</h4>
              <p className="text-gray-700">
                Cookie tecnici, indirizzo IP, tipo di browser, pagine visitate, 
                durata della sessione (solo previo consenso per cookie non essenziali).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sezione 3 - Finalità e Base Giuridica */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <FileText className="w-5 h-5 mr-2" />
              3. Finalità del Trattamento e Base Giuridica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-forest mb-2">Esecuzione del Contratto (Art. 6, par. 1, lett. b GDPR)</h4>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Gestione iscrizioni e tesseramenti</li>
                <li>Organizzazione di gare e competizioni</li>
                <li>Erogazione servizi formativi</li>
                <li>Comunicazioni relative ai servizi richiesti</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-forest mb-2">Adempimento Obblighi di Legge (Art. 6, par. 1, lett. c GDPR)</h4>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Verifiche su licenze e autorizzazioni</li>
                <li>Adempimenti fiscali e contabili</li>
                <li>Comunicazioni ad autorità competenti</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-forest mb-2">Consenso (Art. 6, par. 1, lett. a GDPR)</h4>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Invio newsletter e comunicazioni promozionali</li>
                <li>Cookie di profilazione e marketing</li>
                <li>Pubblicazione foto/video degli eventi (previo consenso specifico)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Sezione 4 - Modalità di Trattamento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <Eye className="w-5 h-5 mr-2" />
              4. Modalità di Trattamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              I dati personali sono trattati con strumenti informatici e/o telematici, 
              con modalità organizzative e con logiche strettamente correlate alle finalità indicate.
            </p>
            <p className="text-gray-700">
              Vengono adottate misure di sicurezza tecniche e organizzative adeguate per 
              prevenire la perdita, l'uso illecito o non corretto e l'accesso non autorizzato ai dati.
            </p>
          </CardContent>
        </Card>

        {/* Sezione 5 - Comunicazione e Diffusione */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <Users className="w-5 h-5 mr-2" />
              5. Comunicazione e Diffusione dei Dati
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-forest mb-2">Soggetti Autorizzati</h4>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Personale interno dell'associazione debitamente autorizzato</li>
                <li>Fornitori di servizi tecnici (hosting, sistemi di pagamento)</li>
                <li>Consulenti legali, fiscali e commerciali</li>
                <li>Autorità competenti (su richiesta o per obbligo di legge)</li>
              </ul>
            </div>
            <p className="text-gray-700">
              I dati non sono oggetto di diffusione, salvo specifico consenso dell'interessato.
            </p>
          </CardContent>
        </Card>

        {/* Sezione 6 - Conservazione */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <Database className="w-5 h-5 mr-2" />
              6. Periodo di Conservazione
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-gray-700 space-y-2 list-disc list-inside">
              <li><strong>Dati contrattuali:</strong> 10 anni dalla cessazione del rapporto</li>
              <li><strong>Dati fiscali:</strong> secondo normativa fiscale vigente</li>
              <li><strong>Dati marketing:</strong> fino a revoca del consenso</li>
              <li><strong>Cookie tecnici:</strong> durata della sessione</li>
              <li><strong>Cookie di marketing:</strong> massimo 24 mesi</li>
            </ul>
          </CardContent>
        </Card>

        {/* Sezione 7 - Diritti dell'Interessato */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <Shield className="w-5 h-5 mr-2" />
              7. Diritti dell'Interessato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              L'interessato ha diritto di ottenere dal titolare, nei casi previsti:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Accesso ai propri dati personali</li>
                <li>Rettifica dei dati inesatti</li>
                <li>Cancellazione dei dati (diritto all'oblio)</li>
                <li>Limitazione del trattamento</li>
              </ul>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Portabilità dei dati</li>
                <li>Opposizione al trattamento</li>
                <li>Revoca del consenso</li>
                <li>Reclamo al Garante</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <p className="text-forest font-semibold mb-2">Come Esercitare i Diritti</p>
              <p className="text-gray-700">
                Per esercitare i diritti sopra elencati, contattare:<br/>
                <strong>Email:</strong> privacy@enalcacciatreviso.it<br/>
                <strong>Telefono:</strong> 0422 123456<br/>
                <strong>Indirizzo:</strong> Via Roma, 123 - 31100 Treviso (TV)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sezione 8 - Reclami */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <Mail className="w-5 h-5 mr-2" />
              8. Diritto di Reclamo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              L'interessato ha il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="text-gray-700">
                <strong>Garante per la Protezione dei Dati Personali</strong><br/>
                Piazza di Monte Citorio, 121 - 00186 Roma<br/>
                Tel: +39 06 69677 1<br/>
                Web: <a href="https://www.gpdp.it" className="text-forest hover:underline">www.gpdp.it</a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sezione 9 - Modifiche */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-forest">9. Modifiche alla Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              La presente informativa può essere modificata nel tempo. Le modifiche saranno 
              pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="text-center text-sm text-gray-500">
          <p>
            Questa informativa è conforme al Regolamento UE 2016/679 (GDPR) e al D.Lgs. 196/2003 
            come modificato dal D.Lgs. 101/2018.
          </p>
        </div>
      </div>
    </div>
  );
}