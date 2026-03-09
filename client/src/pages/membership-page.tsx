import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Check, Shield, CreditCard, Star, Gift, Award } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import type { Membership } from "@shared/schema";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('Missing VITE_STRIPE_PUBLIC_KEY - payment functionality will not work');
}

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 
  loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) : null;

const membershipCatalog = [
  { title: "Tessera Caccia Base Nazionale", image: "/attached_assets/Tessera-caccia-base-nazionale.jpg", category: "Caccia" },
  { title: "Tessera Caccia Base Nazionale di Benvenuto", image: "/attached_assets/Tessera-caccia-base-nazionale-di-benvenuto.jpg", category: "Caccia" },
  { title: "Tessera Caccia Semplice", image: "/attached_assets/Tessera-caccia-semplice.jpg", category: "Caccia" },
  { title: "Tessera Caccia Semplice di Benvenuto", image: "/attached_assets/Tessera-caccia-semplice-di-benvenuto.jpg", category: "Caccia" },
  { title: "Tessera Caccia Super", image: "/attached_assets/Tessera-caccia-super.jpg", category: "Caccia" },
  { title: "Tessera Caccia Super di Benvenuto", image: "/attached_assets/Tessera-caccia-super-di-benvenuto.jpg", category: "Caccia" },
  { title: "Tessera Caccia Super 1 Cane", image: "/attached_assets/Tessera-caccia-super-1-cane.jpg", category: "Cinofilia" },
  { title: "Tessera Caccia Super 1 Cane di Benvenuto", image: "/attached_assets/Tessera-caccia-super-1-cane-di-bemvenuto.jpg", category: "Cinofilia" },
  { title: "Tessera Caccia Super 2 Cani", image: "/attached_assets/Tessera-caccia-super-2-cani.jpg", category: "Cinofilia" },
  { title: "Tessera Caccia Super 2 Cani di Benvenuto", image: "/attached_assets/Tessera-caccia-super-2-cani-di-benvenuto.jpg", category: "Cinofilia" },
  { title: "Tessera Pesca Standard", image: "/attached_assets/Tessera-pesca-stamdard.jpg", category: "Pesca" },
  { title: "Tessera Pesca Lago", image: "/attached_assets/Tessera-pesca-lago.jpg", category: "Pesca" },
  { title: "Tesseramento Amatoriale", image: "/attached_assets/Tesseramento-amatoriale.jpg", category: "Amatoriale" },
  { title: "Tesseramento Tiravolisti", image: "/attached_assets/Tesseramento-tiravolisti.jpg", category: "Tiro" },
];

export default function MembershipPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMembership, setSelectedMembership] = useState<number | null>(null);

  const { data: memberships = [], isLoading } = useQuery<Membership[]>({
    queryKey: ["/api/memberships"],
  });

  const paymentMutation = useMutation({
    mutationFn: async (membershipId: number) => {
      const response = await apiRequest("POST", "/api/create-payment-intent", { membershipId });
      return await response.json();
    },
    onSuccess: async (data) => {
      if (!stripePromise) {
        toast({
          title: "Errore di configurazione",
          description: "Il sistema di pagamento non è configurato correttamente.",
          variant: "destructive",
        });
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) return;

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        toast({
          title: "Errore nel pagamento",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante la creazione del pagamento",
        variant: "destructive",
      });
    },
  });

  const handleSelectMembership = (membershipId: number) => {
    if (!user) {
      toast({
        title: "Accesso richiesto",
        description: "Devi essere registrato per acquistare una tessera",
        variant: "destructive",
      });
      return;
    }

    setSelectedMembership(membershipId);
    paymentMutation.mutate(membershipId);
  };

  const getMembershipIcon = (name: string) => {
    if (name.includes("Base")) return Shield;
    if (name.includes("Super")) return Star;
    if (name.includes("Pesca")) return Gift;
    if (name.includes("Amatoriale")) return Award;
    return Shield;
  };

  const getMembershipColor = (name: string) => {
    if (name.includes("Base")) return "border-gray-200 hover:border-gray-300";
    if (name.includes("Super") && !name.includes("2 Cani")) return "border-forest border-2";
    if (name.includes("2 Cani")) return "border-amber-500 hover:border-amber-600";
    if (name.includes("Pesca")) return "border-blue-400 hover:border-blue-500";
    if (name.includes("Amatoriale")) return "border-green-400 hover:border-green-500";
    return "border-gray-200";
  };

  const isMostPopular = (name: string) => name.includes("Super") && !name.includes("2 Cani");

  const getMembershipImage = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("2 cani")) return "/attached_assets/Tessera-caccia-super-2-cani.jpg";
    if (n.includes("super")) return "/attached_assets/Tessera-caccia-super.jpg";
    if (n.includes("base nazionale")) return "/attached_assets/Tessera-caccia-base-nazionale.jpg";
    if (n.includes("pesca") && n.includes("10")) return "/attached_assets/Tessera-pesca-stamdard.jpg";
    if (n.includes("pesca")) return "/attached_assets/Tessera-pesca-lago.jpg";
    return "/attached_assets/Tessera-caccia-semplice.jpg";
  };

  return (
    <div className="page-shell">{/* Layout now handles min-h-screen */}
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
                      <Badge variant="outline" className="mt-2 text-xs">{item.category}</Badge>
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

        {/* Membership Cards */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-8 bg-muted rounded mb-2" />
                  <div className="h-12 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-4 bg-muted rounded" />
                    ))}
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {memberships.map((membership) => {
              const Icon = getMembershipIcon(membership.name);
              const isPopular = isMostPopular(membership.name);
              
              return (
                <Card 
                  key={membership.id} 
                  className={`relative hover:shadow-lg transition-all duration-300 ${getMembershipColor(membership.name)} ${
                    isPopular ? 'transform scale-105' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-accent text-white px-4 py-1">PIÙ POPOLARE</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4 p-2 flex items-center justify-center">
                      <img
                        src={getMembershipImage(membership.name)}
                        alt={membership.name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isPopular ? 'bg-forest' : 'bg-muted'
                      }`}>
                        <Icon className={`w-8 h-8 ${isPopular ? 'text-white' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl">{membership.name}</CardTitle>
                    
                    <div className="py-4">
                      <div className="text-4xl font-bold text-forest">
                        €{(membership.price / 100).toFixed(0)}
                        <span className="text-lg font-normal text-muted-foreground">/anno</span>
                      </div>
                    </div>
                    
                    <CardDescription className="text-base">
                      {membership.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {membership.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {membership.maxMembers && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span>Posti disponibili:</span>
                          <span className="font-semibold">
                            {membership.maxMembers - (membership.currentMembers || 0)} / {membership.maxMembers}
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-forest h-2 rounded-full transition-all"
                            style={{ 
                              width: `${((membership.currentMembers || 0) / membership.maxMembers) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      className={`w-full ${
                        isPopular 
                          ? 'bg-forest hover:bg-forest/90' 
                          : 'bg-secondary hover:bg-secondary/90'
                      }`}
                      onClick={() => handleSelectMembership(membership.id)}
                      disabled={paymentMutation.isPending && selectedMembership === membership.id}
                    >
                      {paymentMutation.isPending && selectedMembership === membership.id ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Elaborazione...
                        </div>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Scegli {membership.name.split(' ')[1]}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
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
