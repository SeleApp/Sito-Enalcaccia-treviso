import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cookie, Settings, Shield, BarChart, Target, Globe } from "lucide-react";
import { Link } from "wouter";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-forest mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600">
            Informativa sull'utilizzo dei cookie e tecnologie simili
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
          </p>
        </div>

        {/* Gestione Preferenze */}
        <Card className="mb-8 border-forest">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <Settings className="w-5 h-5 mr-2" />
              Gestisci le tue Preferenze Cookie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Puoi modificare le tue preferenze sui cookie in qualsiasi momento cliccando sul pulsante qui sotto:
            </p>
            <Button 
              onClick={() => {
                // Trigger cookie preferences modal
                if (typeof window !== 'undefined' && (window as any).showCookiePreferences) {
                  (window as any).showCookiePreferences();
                }
              }}
              className="bg-forest hover:bg-forest/90"
            >
              <Settings className="w-4 h-4 mr-2" />
              Gestisci Preferenze Cookie
            </Button>
          </CardContent>
        </Card>

        {/* Cosa sono i Cookie */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <Cookie className="w-5 h-5 mr-2" />
              1. Cosa sono i Cookie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              I cookie sono piccoli file di testo che vengono memorizzati sul dispositivo dell'utente 
              durante la navigazione su un sito web. Permettono al sito di ricordare le azioni e 
              preferenze dell'utente per un periodo di tempo.
            </p>
            <p className="text-gray-700">
              Utilizziamo i cookie per migliorare l'esperienza di navigazione, analizzare il traffico 
              e personalizzare i contenuti secondo le normative vigenti.
            </p>
          </CardContent>
        </Card>

        {/* Tipologie di Cookie */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-forest">2. Tipologie di Cookie Utilizzati</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cookie Tecnici */}
            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                <h4 className="font-semibold text-forest">Cookie Tecnici Necessari</h4>
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                  Sempre Attivi
                </Badge>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                Essenziali per il funzionamento del sito. Non richiedono consenso.
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>connect.sid:</strong> Cookie di sessione per autenticazione (durata: sessione)</li>
                  <li><strong>cookie_consent (localStorage):</strong> Preferenze consenso cookie (durata: 12 mesi)</li>
                  <li><strong>cookie_consent_date (localStorage):</strong> Data del consenso (durata: 12 mesi)</li>
                </ul>
              </div>
            </div>

            {/* Cookie di Preferenze */}
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center mb-2">
                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                <h4 className="font-semibold text-forest">Cookie di Preferenze</h4>
                <Badge variant="outline" className="ml-2">
                  Consenso Richiesto
                </Badge>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                Memorizzano le preferenze dell'utente per migliorare l'esperienza.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>theme_preference:</strong> Tema scuro/chiaro scelto (durata: 1 anno)</li>
                  <li><strong>language_pref:</strong> Lingua selezionata (durata: 1 anno)</li>
                  <li><strong>cookie_consent:</strong> Preferenze cookie salvate (durata: 1 anno)</li>
                </ul>
              </div>
            </div>

            {/* Cookie Analitici */}
            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center mb-2">
                <BarChart className="w-5 h-5 mr-2 text-yellow-600" />
                <h4 className="font-semibold text-forest">Cookie Analitici</h4>
                <Badge variant="outline" className="ml-2">
                  Consenso Richiesto
                </Badge>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                Raccolgono informazioni su come gli utenti utilizzano il sito.
              </p>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>_ga:</strong> Google Analytics (durata tipica: 2 anni, solo se attivato)</li>
                  <li><strong>_ga_*:</strong> Google Analytics sessione/campagne (solo se attivato)</li>
                  <li><strong>_gid:</strong> Google Analytics identificatore giornaliero (solo se attivato)</li>
                </ul>
              </div>
            </div>

            {/* Cookie di Marketing */}
            <div className="border-l-4 border-red-500 pl-4">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 mr-2 text-red-600" />
                <h4 className="font-semibold text-forest">Cookie di Marketing</h4>
                <Badge variant="outline" className="ml-2">
                  Consenso Richiesto
                </Badge>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                Utilizzati per mostrare pubblicità personalizzata e misurarne l'efficacia.
              </p>
              <div className="bg-red-50 p-3 rounded-lg">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>_fbp:</strong> Meta Pixel tracciamento conversioni (durata tipica: 3 mesi, solo se attivato)</li>
                  <li><strong>ads_prefs:</strong> Preferenze pubblicitarie (solo se attivato)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie di Terze Parti */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <Globe className="w-5 h-5 mr-2" />
              3. Cookie di Terze Parti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Eventuali cookie di terze parti vengono installati solo dopo consenso esplicito.
              Al momento non vengono attivati automaticamente strumenti di tracciamento non necessari.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-forest mb-2">Google Analytics</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Servizio di analisi web per comprendere come gli utenti interagiscono con il sito.
                </p>
                <p className="text-xs text-gray-500">
                  Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-forest hover:underline">
                    Google Privacy Policy
                  </a>
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-forest mb-2">Stripe</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Servizio di pagamento sicuro per gestire transazioni e tessere.
                </p>
                <p className="text-xs text-gray-500">
                  Privacy Policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-forest hover:underline">
                    Stripe Privacy Policy
                  </a>
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-forest mb-2">Facebook Pixel</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Strumento di marketing per ottimizzare campagne pubblicitarie.
                </p>
                <p className="text-xs text-gray-500">
                  Privacy Policy: <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-forest hover:underline">
                    Meta Privacy Policy
                  </a>
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-forest mb-2">YouTube</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Video incorporati per contenuti formativi e promozionali.
                </p>
                <p className="text-xs text-gray-500">
                  Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-forest hover:underline">
                    YouTube Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Come Gestire i Cookie */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-forest">4. Come Gestire i Cookie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-forest mb-2">Tramite il nostro Banner</h4>
              <p className="text-gray-700 text-sm">
                Al primo accesso al sito, ti viene mostrato un banner dove puoi scegliere 
                quali categorie di cookie accettare. Puoi modificare le tue scelte in qualsiasi momento.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-forest mb-2">Tramite il Browser</h4>
              <p className="text-gray-700 text-sm mb-2">
                Puoi gestire i cookie direttamente dalle impostazioni del tuo browser:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie</li>
                <li><strong>Firefox:</strong> Impostazioni → Privacy e sicurezza → Cookie</li>
                <li><strong>Safari:</strong> Preferenze → Privacy → Cookie e dati dei siti web</li>
                <li><strong>Edge:</strong> Impostazioni → Privacy → Cookie</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-amber-800 text-sm">
                <strong>Attenzione:</strong> Disabilitare i cookie tecnici necessari può compromettere 
                il corretto funzionamento del sito e dei suoi servizi.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Consenso e Diritti */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-forest">5. Consenso e Diritti dell'Utente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Il consenso per i cookie non tecnici può essere revocato in qualsiasi momento. 
              L'utente ha diritto a:
            </p>
            <ul className="text-gray-700 space-y-1 list-disc list-inside">
              <li>Essere informato chiaramente sull'uso dei cookie</li>
              <li>Prestare o negare il consenso</li>
              <li>Modificare le preferenze in qualsiasi momento</li>
              <li>Cancellare i cookie esistenti</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contatti */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-forest">6. Contatti</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Per domande relative a questa Cookie Policy, contattare:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>ENAL Caccia - Sezione Provinciale di Treviso</strong><br/>
                Tramite modulo contatti del sito<br/>
                Oggetto consigliato: "Richiesta Cookie Policy"<br/>
                Le risposte sono fornite nei tempi previsti dalla normativa applicabile
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Link correlati */}
        <div className="text-center space-x-4">
          <Link href="/privacy-policy">
            <Button variant="outline">
              Privacy Policy
            </Button>
          </Link>
          <Button 
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).showCookiePreferences) {
                (window as any).showCookiePreferences();
              }
            }}
            className="bg-forest hover:bg-forest/90"
          >
            Gestisci Preferenze
          </Button>
        </div>
      </div>
    </div>
  );
}