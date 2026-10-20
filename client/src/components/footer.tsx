import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, ExternalLink, Send, Clock, FileText, Smartphone } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest("POST", "/api/newsletter", { email });
    },
    onSuccess: () => {
      toast({
        title: "Iscrizione completata",
        description: "Ti sei iscritto con successo alla nostra newsletter!",
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Errore nell'iscrizione",
        description: error.message || "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      newsletterMutation.mutate(email);
    }
  };

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/news", label: "Notizie" },
    { href: "/eventi", label: "Eventi" },
    { href: "/membership", label: "Tesseramento" },
    { href: "/contact", label: "Contatti" },
    { href: "/auth", label: "Area riservata" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/attached_assets/logo-enalcaccia-treviso.png?v=20260307" 
                alt="Logo ENAL Caccia Treviso" 
                className="w-10 h-10 object-cover rounded-full"
              />
              <span className="font-serif font-bold text-xl">Enal Caccia</span>
            </div>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Associazione venatoria attiva sul territorio provinciale, con iniziative dedicate
              a caccia, pesca sportiva, tiro, cinofilia e formazione dei soci.
            </p>
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-3 text-sm text-gray-300">
              Canali social ufficiali in aggiornamento.
              <br />
              Per comunicazioni rapide usa la sezione <Link href="/contact" className="text-white underline underline-offset-2">Contatti</Link>.
            </div>
          </div>

          {/* Collegamenti Utili */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Collegamenti Utili</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://www.enalcaccianazionale.it" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  ENALCACCIA Nazionale
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.regione.veneto.it/web/agricoltura-e-foreste/treviso" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  Regione Veneto - Caccia
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.enci.it" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  ENCI
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.masaf.gov.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/202" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  MASAF - Caccia e Attivita Venatorie
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigazione Rapida */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigazione Rapida</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Iscriviti per ricevere news e aggiornamenti sulle nostre attività
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="tua@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-forest focus:ring-forest rounded-r-none"
                />
                <Button 
                  type="submit" 
                  disabled={newsletterMutation.isPending}
                  className="bg-forest hover:bg-forest/90 rounded-l-none px-3"
                >
                  {newsletterMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>


        {/* Orari e risorse venatorie - collegamenti ufficiali */}
        <div className="mt-10 border-t border-gray-800 pt-8">
          <h3 className="mb-5 font-serif text-xl font-semibold text-white">Informazioni utili per i soci</h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <section className="rounded-lg border border-gray-700 bg-gray-800/50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-400" aria-hidden="true" />
                <h4 className="font-semibold text-white">Orari di ricevimento</h4>
              </div>
              <p className="text-sm leading-6 text-gray-200">
                <strong>Martedì e giovedì</strong>
                <span className="block text-lg font-semibold text-white">08:00 – 11:30</span>
              </p>
              <Link href="/contact" className="mt-3 inline-block text-sm text-green-300 underline underline-offset-2 hover:text-white">
                Contatti e sede
              </Link>
            </section>

            <section className="rounded-lg border border-gray-700 bg-gray-800/50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-400" aria-hidden="true" />
                <h4 className="font-semibold text-white">Vigilanza e cani da traccia</h4>
              </div>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://www.riservaalpinapederobba.it/wp-content/uploads/2025/05/2284_001.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-2 text-gray-200 underline underline-offset-2 hover:text-white"
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    Mappa vigilanza (PDF)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.riservaalpinapederobba.it/wp-content/uploads/2025/01/ALBO-PROVINCIALE-CANI-DA-TRACCIA-TREVISO-gennaio-2025-TEL.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-2 text-gray-200 underline underline-offset-2 hover:text-white"
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    Albo provinciale conduttori cani da traccia — Treviso, gennaio 2025 (PDF)
                  </a>
                </li>
              </ul>
              <p className="mt-3 text-xs text-gray-400">
                Fonte: Riserva Alpina di Pederobba. Consulta sempre gli elenchi ufficiali per eventuali aggiornamenti.
              </p>
            </section>

            <section className="rounded-lg border border-gray-700 bg-gray-800/50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-400" aria-hidden="true" />
                <h4 className="font-semibold text-white">App VenetoCaccia</h4>
              </div>
              <p className="mb-3 text-sm leading-6 text-gray-200">
                Il tesserino venatorio digitale della Regione del Veneto, disponibile per smartphone.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <a
                  href="https://play.google.com/store/apps/details?id=it.exetesis.tesserinovenatorioveneto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 underline underline-offset-2 hover:text-white"
                >
                  Google Play
                </a>
                <a
                  href="https://apps.apple.com/it/app/venetocaccia/id6590635232"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 underline underline-offset-2 hover:text-white"
                >
                  App Store
                </a>
                <a
                  href="https://www.regione.veneto.it/web/agricoltura-e-foreste/app-venetocaccia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 underline underline-offset-2 hover:text-white"
                >
                  Regione del Veneto
                </a>
              </div>
            </section>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-forest mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Sede Principale</h4>
                <p className="text-gray-300 text-sm">
                  Sezione Provinciale Treviso<br />
                  Via C. Cattaneo, 28<br />
                  31100 Treviso (TV)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-forest mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Telefono</h4>
                <p className="text-gray-300 text-sm">
                  <a href="tel:0422545237" className="hover:text-white transition-colors">0422 545237</a>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-forest mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Email</h4>
                <p className="text-gray-300 text-sm">
                  <a href="mailto:treviso@enalcaccianazionale.it" className="hover:text-white transition-colors">treviso@enalcaccianazionale.it</a><br />
                  <a href="mailto:f.ravagnan@alice.it" className="hover:text-white transition-colors">f.ravagnan@alice.it</a>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-800/40 p-4 text-sm text-gray-200">
            <span className="font-semibold">Presidente:</span> Dr. Franco Ravagnan
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2026 ENAL Caccia - Sezione Provinciale di Treviso. Tutti i diritti riservati.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Supporto
              </Link>
            </div>
          </div>
          
          {/* Developer Credits */}
          <div className="border-t border-gray-700 pt-4 text-center">
            <p className="text-gray-500 text-xs">
              Sito web sviluppato da <span className="font-medium text-gray-400">Alessandro Favero</span> © 2026
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Tutti i diritti di sviluppo e design riservati
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}