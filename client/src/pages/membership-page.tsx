import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";

import { useAuth } from "@/hooks/use-auth";
import { Shield, CreditCard, Award } from "lucide-react";

const membershipCatalog = [
  { title: "Tessera Caccia Base Nazionale", image: "/attached_assets/Tessera-caccia-base-nazionale.jpg", category: "Caccia", priceLabel: "€85,00" },
  { title: "Tessera Caccia Base Nazionale di Benvenuto", image: "/attached_assets/Tessera-caccia-base-nazionale-di-benvenuto.jpg", category: "Caccia" },
  { title: "Tessera Caccia Semplice", image: "/attached_assets/Tessera-caccia-semplice.jpg", category: "Caccia", priceLabel: "€65,00" },
  { title: "Tessera Caccia Semplice di Benvenuto", image: "/attached_assets/Tessera-caccia-semplice-di-benvenuto.jpg", category: "Caccia" },
  { title: "Tessera Caccia Super", image: "/attached_assets/Tessera-caccia-super.jpg", category: "Caccia", priceLabel: "€110,00" },
  { title: "Tessera Caccia Super di Benvenuto", image: "/attached_assets/Tessera-caccia-super-di-benvenuto.jpg", category: "Caccia" },
  { title: "Tessera Caccia Super 1 Cane", image: "/attached_assets/Tessera-caccia-super-1-cane.jpg", category: "Cinofilia", priceLabel: "€140,00" },
  { title: "Tessera Caccia Super 1 Cane di Benvenuto", image: "/attached_assets/Tessera-caccia-super-1-cane-di-bemvenuto.jpg", category: "Cinofilia" },
  { title: "Tessera Caccia Super 2 Cani", image: "/attached_assets/Tessera-caccia-super-2-cani.jpg", category: "Cinofilia", priceLabel: "€165,00" },
  { title: "Tessera Caccia Super 2 Cani di Benvenuto", image: "/attached_assets/Tessera-caccia-super-2-cani-di-benvenuto.jpg", category: "Cinofilia" },
  { title: "Tessera Pesca Standard", image: "/attached_assets/Tessera-pesca-stamdard.jpg", category: "Pesca", priceLabel: "€80,00" },
  { title: "Tessera Pesca Super 1 Cane", image: "/attached_assets/Tessera-caccia-super-1-cane.jpg", category: "Pesca", priceLabel: "€155,00" },
  { title: "Tessera Pesca", image: "/attached_assets/Tessera-pesca-stamdard.jpg", category: "Pesca", priceLabel: "€20,00" },
  { title: "Tessera Pesca Lago", image: "/attached_assets/Tessera-pesca-lago.jpg", category: "Pesca", priceLabel: "€10,00" },
  { title: "Tessera Pesca Ragazzi 7-14 Anni", image: "/attached_assets/Tessera-pesca-lago.jpg", category: "Pesca", priceLabel: "€6,00" },
  { title: "Tesseramento Amatoriale", image: "/attached_assets/Tesseramento-amatoriale.jpg", category: "Amatoriale", priceLabel: "€30,00" },
  { title: "Capanno Richiami Vivi", image: "/attached_assets/Tessera-caccia-semplice.jpg", category: "Opzioni", priceLabel: "€10,00" },
  { title: "Morte del Cane (Opzione Assicurativa)", image: "/attached_assets/Tessera-caccia-super.jpg", category: "Opzioni", priceLabel: "€30,00" },
  { title: "Tesseramento Tiravolisti", image: "/attached_assets/Tesseramento-tiravolisti.jpg", category: "Tiro" },
];

export default function MembershipPage() {
  const { user } = useAuth();

  return (
    <div className="page-shell">{/* Layout now handles min-h-screen */}
      <SEOHead
        title="Tesseramento"
        description="Catalogo tessere ENAL Caccia Treviso con quote aggiornate per caccia, pesca, cinofilia e opzioni aggiuntive."
        url="https://enalcaccia-treviso.replit.app/membership"
      />
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Tessere ENALCACCIA 2026</h1>
          <p className="page-subtitle">
            Tessere ufficiali ENALCACCIA con coperture assicurative complete per caccia, pesca e attività sportive. 
            Scegli la tessera più adatta alle tue esigenze e attività venatorie.
          </p>
          <div className="mt-6 bg-forest/10 border border-forest/20 rounded-lg p-4">
            <p className="text-forest font-semibold">✓ Prezzi ufficiali ENALCACCIA 2026</p>
            <p className="text-sm text-muted-foreground mt-1">Coperture assicurative complete incluse in ogni tessera</p>
          </div>
        </div>

        <div className="mb-12">
          <Card className="border-forest/20">
            <CardHeader>
              <CardTitle>Catalogo Completo Tessere Associazione</CardTitle>
              <CardDescription>
                Panoramica delle tessere disponibili per caccia, cinofilia, pesca, tiro e formule di benvenuto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {membershipCatalog.map((item) => (
                  <div key={item.title} className="rounded-lg border bg-white overflow-hidden">
                    <div className="aspect-[16/10] bg-muted flex items-center justify-center p-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium leading-snug">{item.title}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        {item.priceLabel && (
                          <Badge className="text-xs bg-forest text-white hover:bg-forest">
                            {item.priceLabel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Status Alert */}
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Registrazione Richiesta
                </h3>
                <p className="text-yellow-700 mb-4">
                  Per acquistare una tessera devi prima registrarti e attendere l'approvazione 
                  da parte degli amministratori. Il processo di registrazione è gratuito e veloce.
                </p>
                <Button asChild>
                  <a href="/auth">Registrati Ora</a>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Security Info */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Pagamento Sicuro e Garantito
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              I tuoi dati di pagamento sono protetti con la crittografia SSL più avanzata. 
              Utilizziamo Stripe per garantire la massima sicurezza nelle transazioni.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sicurezza SSL</h3>
              <p className="text-muted-foreground text-sm">
                Tutti i dati sono crittografati con protocollo SSL a 256-bit per la massima protezione.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Carte Accettate</h3>
              <p className="text-muted-foreground text-sm">
                Accettiamo Visa, Mastercard, American Express e PayPal per la tua comodità.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Attivazione Immediata</h3>
              <p className="text-muted-foreground text-sm">
                La tua tessera viene attivata immediatamente dopo il pagamento confermato.
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-6 mt-8 pt-8 border-t">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-6" />
              <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-6" />
              <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6ef418a24660a4.svg" alt="American Express" className="h-6" />
              <span className="text-xs">Powered by Stripe</span>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-muted/50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Perché Scegliere Enal Caccia Treviso
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Da oltre 50 anni siamo al fianco dei cacciatori veneti, offrendo servizi di qualità 
              nella provincia di Treviso e promuovendo una caccia responsabile e sostenibile.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Tradizione</h3>
              <p className="text-sm text-muted-foreground">
                50 anni di esperienza nella tutela della tradizione venatoria
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-saddle rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Qualità</h3>
              <p className="text-sm text-muted-foreground">
                Servizi di alta qualità riconosciuti a livello nazionale
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 text-white flex items-center justify-center">🌱</div>
              </div>
              <h3 className="font-semibold mb-2">Sostenibilità</h3>
              <p className="text-sm text-muted-foreground">
                Impegno costante per la conservazione ambientale
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 text-white flex items-center justify-center">🤝</div>
              </div>
              <h3 className="font-semibold mb-2">Comunità</h3>
              <p className="text-sm text-muted-foreground">
                Una rete di appassionati che condividono valori comuni
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
