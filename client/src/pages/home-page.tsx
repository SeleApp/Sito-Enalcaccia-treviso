import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Euro, Trophy, Users, GraduationCap, Shield, Leaf, Clock, Phone, Mail, MapPin as MapPinIcon } from "lucide-react";

export default function HomePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Fetch latest news
  const { data: news = [] } = useQuery({
    queryKey: ["/api/news"],
  });

  // Fetch upcoming competitions
  const { data: competitions = [] } = useQuery({
    queryKey: ["/api/competitions"],
  });

  // Fetch membership types
  const { data: membershipTypes = [] } = useQuery({
    queryKey: ["/api/membership-types"],
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof contactForm) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Messaggio inviato",
        description: "Ti risponderemo il prima possibile.",
      });
      setContactForm({ name: "", email: "", subject: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'invio del messaggio. Riprova.",
        variant: "destructive",
      });
    },
  });

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/newsletter", { email });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Iscrizione completata",
        description: "Ti sei iscritto alla newsletter con successo!",
      });
      setNewsletterEmail("");
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'iscrizione alla newsletter.",
        variant: "destructive",
      });
    },
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(contactForm);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    newsletterMutation.mutate(newsletterEmail);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary to-secondary overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(45, 80, 22, 0.7), rgba(45, 80, 22, 0.7)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600')"
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Enal Caccia</h1>
            <p className="text-xl md:text-2xl mb-2">Associazione Venatoria per la Promozione della Caccia Responsabile</p>
            <p className="text-lg mb-8 max-w-2xl">Promuoviamo la caccia responsabile e sostenibile, valorizzando le tradizioni venatorie italiane attraverso formazione, competizioni cinofile e tesseramenti.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/membership">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  <Trophy className="mr-2 h-5 w-5" />
                  Tesseramento
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Scopri di più
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-neutral mb-4">I Nostri Servizi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enal Caccia offre una gamma completa di servizi per i cacciatori, dalle licenze alle competizioni cinofile.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Tesseramenti</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Rinnova o ottieni la tua tessera venatoria con procedure semplificate e pagamenti sicuri online.
                </p>
                <Link href="/membership">
                  <Button variant="link" className="text-primary">
                    Scopri di più →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Gare Cinofile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Partecipa alle competizioni per cani da caccia organizzate in tutta Italia.
                </p>
                <Link href="/competitions">
                  <Button variant="link" className="text-primary">
                    Vedi calendario →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="text-white h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Formazione</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Corsi di formazione per cacciatori responsabili e gestione sostenibile della fauna.
                </p>
                <Button variant="link" className="text-primary">
                  Iscriviti →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Chi Siamo</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              L'Ente Nazionale per l'Assistenza alle Lavoratrici e ai Lavoratori è impegnato nella promozione di una caccia etica e responsabile.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Sede dell'associazione" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Shield className="text-white h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tradizione e Sicurezza</h3>
                  <p className="text-gray-600">
                    Promuoviamo la tradizione venatoria italiana nel rispetto delle normative e della sicurezza.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Leaf className="text-white h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Rispetto Ambientale</h3>
                  <p className="text-gray-600">
                    Sosteniamo la conservazione dell'ambiente e la gestione sostenibile della fauna selvatica.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Users className="text-white h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Comunità Unita</h3>
                  <p className="text-gray-600">
                    Riuniamo cacciatori esperti e principianti in una comunità basata sul rispetto reciproco.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Ultime Notizie</h2>
              <p className="text-xl text-gray-600">Rimani aggiornato sulle novità del mondo venatorio</p>
            </div>
            <Link href="/news">
              <Button variant="outline">Vedi tutte le news</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {news.slice(0, 3).map((article: any) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video">
                  <img 
                    src={article.featuredImage || "https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3"} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(article.createdAt).toLocaleDateString('it-IT')}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <Button variant="link" className="text-primary p-0">
                    Leggi tutto →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitions Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Gare Cinofile</h2>
            <p className="text-xl text-gray-600">Prossimi eventi e competizioni per cani da caccia</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitions.slice(0, 3).map((competition: any) => (
              <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-primary text-white">{competition.discipline}</Badge>
                    <span className="text-gray-500 text-sm">
                      {new Date(competition.date).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{competition.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      <span className="text-sm">{competition.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Euro className="mr-2 h-4 w-4 text-primary" />
                      <span className="text-sm">€{competition.cost}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{competition.description}</p>
                  <div className="flex space-x-3">
                    <Button size="sm" className="flex-1">Dettagli</Button>
                    {competition.bandoUrl && (
                      <Button variant="outline" size="sm" className="flex-1">
                        Bando
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/competitions">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Vedi tutte le gare
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Tesseramento 2025</h2>
            <p className="text-xl text-gray-600">Diventa socio Enal Caccia e accedi a tutti i nostri servizi</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {membershipTypes.map((membership: any, index: number) => (
              <Card 
                key={membership.id} 
                className={`text-center hover:shadow-lg transition-shadow ${
                  index === 1 ? 'border-2 border-accent transform scale-105 relative' : 'border-2 border-gray-200'
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-white px-4 py-1">PIÙ POPOLARE</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">{membership.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary">
                    €{membership.price}
                    <span className="text-lg font-normal text-gray-600">/anno</span>
                  </div>
                  <p className="text-gray-600">{membership.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8 text-left">
                    {membership.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/membership">
                    <Button className={`w-full ${index === 1 ? 'bg-accent hover:bg-accent/90' : ''}`}>
                      Scegli {membership.name.split(' ')[1]}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Hai bisogno di aiuto nella scelta? <Button variant="link" className="text-primary p-0">Contattaci</Button>
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="text-green-500 mr-2 h-4 w-4" />
                <span>Pagamento sicuro</span>
              </div>
              <div className="flex items-center">
                <span>Stripe SSL</span>
              </div>
              <div className="flex items-center">
                <Clock className="text-green-500 mr-2 h-4 w-4" />
                <span>Attivazione immediata</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Contattaci</h2>
            <p className="text-xl text-gray-600">Siamo qui per rispondere alle tue domande</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <MapPinIcon className="text-white h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sede Principale</h3>
                    <p className="text-gray-600">Via della Caccia, 123<br />31100 Treviso (TV)<br />Veneto, Italia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Phone className="text-white h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Telefono</h3>
                    <p className="text-gray-600">+39 0422 123456<br />Lun-Ven: 9:00-17:00<br />Sab: 9:00-12:00</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Mail className="text-white h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">info@enalcaccia-veneto.it<br />segretario@enalcaccia-veneto.it</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Clock className="text-white h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Orari di Apertura</h3>
                    <p className="text-gray-600">Lunedì - Venerdì: 9:00 - 17:00<br />Sabato: 9:00 - 12:00<br />Domenica: Chiuso</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <Card className="p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Nome *</label>
                    <Input
                      id="name"
                      type="text"
                      required
                      placeholder="Il tuo nome"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="tua@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Oggetto *</label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    placeholder="Di cosa vuoi parlare?"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Messaggio *</label>
                  <Textarea
                    id="message"
                    rows={5}
                    required
                    placeholder="Scrivi qui il tuo messaggio..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={contactMutation.isPending}>
                  <Mail className="mr-2 h-4 w-4" />
                  {contactMutation.isPending ? "Invio..." : "Invia Messaggio"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
