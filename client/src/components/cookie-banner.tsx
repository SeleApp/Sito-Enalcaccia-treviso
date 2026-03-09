import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Cookie, Settings } from "lucide-react";
import { Link } from "wouter";

interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true, // Always true, cannot be changed
  preferences: false,
  analytics: false,
  marketing: false,
};

const COOKIE_CONSENT_VERSION = "2026-03-09";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem('cookie_consent');
    const savedVersion = localStorage.getItem('cookie_consent_version');

    if (!savedConsent || savedVersion !== COOKIE_CONSENT_VERSION) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(savedConsent);
      setPreferences(savedPreferences);
    }

    // Make showCookiePreferences available globally for cookie policy page
    (window as any).showCookiePreferences = () => setShowPreferences(true);

    return () => {
      delete (window as any).showCookiePreferences;
    };
  }, []);

  const savePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify(newPreferences));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    localStorage.setItem('cookie_consent_version', COOKIE_CONSENT_VERSION);
    setPreferences(newPreferences);
    
    // Apply cookie preferences
    applyCookiePreferences(newPreferences);
    
    setShowBanner(false);
    setShowPreferences(false);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Remove existing cookies based on preferences
    if (!prefs.analytics) {
      // Remove Google Analytics cookies
      document.cookie = '_ga=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = '_ga_*=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = '_gid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    if (!prefs.marketing) {
      // Remove marketing cookies
      document.cookie = '_fbp=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'ads_prefs=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // Set preferences cookies (these are always allowed)
    if (prefs.preferences) {
      document.cookie = `theme_preference=${localStorage.getItem('theme') || 'light'}; Path=/; Max-Age=${365 * 24 * 60 * 60};`;
      document.cookie = `language_pref=it; Path=/; Max-Age=${365 * 24 * 60 * 60};`;
    }
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessaryOnly = () => {
    savePreferences(DEFAULT_PREFERENCES);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Cannot change necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <Card className="mx-auto max-w-4xl border-forest shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-6 h-6 text-forest mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-forest mb-2">
                    Utilizziamo i Cookie per Migliorare la Tua Esperienza
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Utilizziamo cookie tecnici necessari per il funzionamento del sito e, 
                    previo tuo consenso, eventuali cookie per analisi e marketing. Puoi gestire le tue 
                    preferenze in qualsiasi momento.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Link href="/privacy-policy">
                      <span className="text-forest hover:underline cursor-pointer">
                        Privacy Policy
                      </span>
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link href="/cookie-policy">
                      <span className="text-forest hover:underline cursor-pointer">
                        Cookie Policy
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 lg:flex-col xl:flex-row">
                <Button
                  onClick={() => setShowPreferences(true)}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Gestisci Preferenze
                </Button>
                <Button
                  onClick={acceptNecessaryOnly}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Solo Necessari
                </Button>
                <Button
                  onClick={acceptAll}
                  className="bg-forest hover:bg-forest/90 w-full sm:w-auto"
                  size="sm"
                >
                  Accetta Tutti
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferences Modal */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-forest">
              <Settings className="w-5 h-5 mr-2" />
              Preferenze Cookie
            </DialogTitle>
            <DialogDescription>
              Gestisci le tue preferenze sui cookie. I cookie necessari sono sempre abilitati 
              per garantire il corretto funzionamento del sito.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Cookie Necessari */}
            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-forest">Cookie Necessari</h4>
                  <p className="text-sm text-gray-600">
                    Essenziali per il funzionamento del sito. Non possono essere disabilitati.
                  </p>
                </div>
                <Switch 
                  checked={true} 
                  disabled 
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
              <div className="text-xs text-gray-500">
                Include: autenticazione, sicurezza, stato della sessione
              </div>
            </div>

            {/* Cookie di Preferenze */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-forest">Cookie di Preferenze</h4>
                  <p className="text-sm text-gray-600">
                    Memorizzano le tue preferenze (tema, lingua) per migliorare l'esperienza.
                  </p>
                </div>
                <Switch 
                  checked={preferences.preferences}
                  onCheckedChange={(checked) => handlePreferenceChange('preferences', checked)}
                />
              </div>
              <div className="text-xs text-gray-500">
                Include: tema scuro/chiaro, preferenze lingua, layout personalizzato
              </div>
            </div>

            {/* Cookie Analitici */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-forest">Cookie Analitici</h4>
                  <p className="text-sm text-gray-600">
                    Ci aiutano a capire come gli utenti interagiscono con il sito per migliorarlo.
                  </p>
                </div>
                <Switch 
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
                />
              </div>
              <div className="text-xs text-gray-500">
                Include: eventuali strumenti statistici attivati solo dopo consenso esplicito
              </div>
            </div>

            {/* Cookie di Marketing */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-forest">Cookie di Marketing</h4>
                  <p className="text-sm text-gray-600">
                    Utilizzati per mostrare pubblicità pertinente e misurarne l'efficacia.
                  </p>
                </div>
                <Switch 
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => handlePreferenceChange('marketing', checked)}
                />
              </div>
              <div className="text-xs text-gray-500">
                Include: eventuali strumenti pubblicitari attivati solo dopo consenso esplicito
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              onClick={() => savePreferences(DEFAULT_PREFERENCES)}
              variant="outline"
              className="flex-1"
            >
              Solo Necessari
            </Button>
            <Button
              onClick={() => savePreferences(preferences)}
              className="bg-forest hover:bg-forest/90 flex-1"
            >
              Salva Preferenze
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Puoi modificare queste impostazioni in qualsiasi momento dalla Cookie Policy
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}