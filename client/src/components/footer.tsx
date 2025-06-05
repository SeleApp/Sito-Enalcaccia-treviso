import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Facebook, Instagram, Youtube, Twitter, Send } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/newsletter", { email });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Iscrizione completata",
        description: "Ti sei iscritto con successo alla newsletter!",
      });
      setEmail("");
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      newsletterMutation.mutate(email);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mr-3">
                <span className="text-accent-foreground font-bold text-sm">EC</span>
              </div>
              <span className="font-serif font-bold text-xl">Enal Caccia</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Ente Nazionale Associazioni Libere della Caccia - Promuoviamo la caccia responsabile e sostenibile in Italia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Collegamenti Utili */}
          <div>
            <h4 className="font-semibold mb-4">Collegamenti Utili</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <a 
                  href="https://www.enalcaccia.it" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Enalcaccia Nazionale
                </a>
              </li>
              <li>
                <a 
                  href="https://www.regione.veneto.it" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Regione Veneto - Caccia
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-foreground transition-colors">
                  Termini e Condizioni
                </Link>
              </li>
            </ul>
          </div>

          {/* Servizi */}
          <div>
            <h4 className="font-semibold mb-4">Servizi</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link href="/membership" className="hover:text-primary-foreground transition-colors">
                  Tesseramento
                </Link>
              </li>
              <li>
                <Link href="/competitions" className="hover:text-primary-foreground transition-colors">
                  Gare Cinofile
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-primary-foreground transition-colors">
                  Corsi di Formazione
                </Link>
              </li>
              <li>
                <Link href="/reserves" className="hover:text-primary-foreground transition-colors">
                  Riserve Convenzionate
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-primary-foreground/80 mb-4">
              Ricevi aggiornamenti sulle nostre attività
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
              <Input
                type="email"
                placeholder="La tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                required
              />
              <Button 
                type="submit" 
                size="sm" 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={newsletterMutation.isPending}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm mb-4 md:mb-0">
            © 2024 Enal Caccia. Tutti i diritti riservati.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Termini e Condizioni
            </Link>
            <Link href="/cookies" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
