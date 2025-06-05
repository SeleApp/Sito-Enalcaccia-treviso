import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/newsletter", { email });
      toast({
        title: "Iscrizione completata!",
        description: "Ti sei iscritto alla newsletter con successo.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante l'iscrizione alla newsletter.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-crosshairs text-primary text-2xl mr-3"></i>
              <span className="font-serif font-bold text-xl">Enal Caccia</span>
            </div>
            <p className="text-slate-300 mb-4 text-sm">
              Ente Nazionale Associazioni Libere della Caccia - Promuoviamo la caccia responsabile e sostenibile in Italia.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>

          {/* Links Utili */}
          <div>
            <h4 className="font-semibold mb-4">Collegamenti Utili</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.enalcaccia.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Enalcaccia Nazionale
                </a>
              </li>
              <li>
                <a
                  href="https://www.regione.veneto.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Regione Veneto - Caccia
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Federazione Italiana Caccia
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Normative Venatorie
                </a>
              </li>
            </ul>
          </div>

          {/* Servizi */}
          <div>
            <h4 className="font-semibold mb-4">Servizi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/membership"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Tesseramenti
                </a>
              </li>
              <li>
                <a
                  href="/competitions"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Gare Cinofile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Corsi di Formazione
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Riserve Convenzionate
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-slate-300 mb-4 text-sm">
              Ricevi aggiornamenti sulle nostre attività
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
              <Input
                type="email"
                placeholder="La tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                <i className="fas fa-arrow-right"></i>
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-300 text-sm mb-4 md:mb-0">
            &copy; 2024 Enal Caccia. Tutti i diritti riservati.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-slate-300 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-300 hover:text-white text-sm transition-colors"
            >
              Termini e Condizioni
            </a>
            <a
              href="#"
              className="text-slate-300 hover:text-white text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
