import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/seo-head";

import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema } from "@shared/schema";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";
import type { InsertContact } from "@shared/schema";

export default function ContactPage() {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("");

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      await apiRequest("POST", "/api/contacts", data);
    },
    onSuccess: () => {
      toast({
        title: "Messaggio inviato",
        description: "Grazie per averci contattato! Ti risponderemo il prima possibile.",
      });
      form.reset();
      setSelectedSubject("");
    },
    onError: (error: any) => {
      toast({
        title: "Errore nell'invio",
        description: error.message || "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  const setSubjectAndFocusForm = (subject: string) => {
    setSelectedSubject(subject);
    form.setValue("subject", subject, { shouldValidate: true });
    const formTop = document.getElementById("contact-form-top");
    formTop?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const subjectOptions = [
    { value: "Tesseramento", label: "Tesseramento" },
    { value: "Eventi e Gare", label: "Eventi e Gare" },
    { value: "Scuola Venatoria", label: "Scuola Venatoria" },
    { value: "Area riservata", label: "Area riservata" },
    { value: "Informazioni Generali", label: "Informazioni Generali" },
    { value: "Altro", label: "Altro" },
  ];

  return (
    <div className="page-shell">{/* Layout now handles min-h-screen */}
      <SEOHead
        title="Contatti"
        description="Contatta ENAL Caccia Treviso per tesseramento, eventi, scuola venatoria e informazioni generali."
        url="https://enalcaccia-treviso.replit.app/contact"
      />
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Contattaci</h1>
          <p className="page-subtitle">
            Siamo qui per rispondere alle tue domande e fornirti tutte le informazioni 
            di cui hai bisogno. Non esitare a contattarci!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card id="contact-form-top">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Invia un Messaggio
              </CardTitle>
              <CardDescription>
                Compila il modulo sottostante e ti risponderemo il prima possibile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      placeholder="Il tuo nome"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tua@email.com"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Oggetto *</Label>
                  <Select
                    value={selectedSubject}
                    onValueChange={(value) => {
                      setSelectedSubject(value);
                      form.setValue("subject", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona un oggetto" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.subject && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Messaggio *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder="Scrivi qui il tuo messaggio..."
                    {...form.register("message")}
                  />
                  {form.formState.errors.message && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-forest hover:bg-forest/90"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Invio in corso...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Invia Messaggio
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Main Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informazioni di Contatto</CardTitle>
                <CardDescription>
                  Sezione Provinciale Treviso - Presidente Dr. Franco Ravagnan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Sede Principale</h3>
                    <p className="text-muted-foreground">
                      Via C. Cattaneo, 28<br />
                      31100 Treviso (TV)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Telefono</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:0422545237" className="hover:underline">0422 545237</a><br />
                      <a href="tel:3474296905" className="hover:underline">347 4296905</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:treviso@enalcaccianazionale.it" className="hover:underline">treviso@enalcaccianazionale.it</a><br />
                      <a href="mailto:f.ravagnan@alice.it" className="hover:underline">f.ravagnan@alice.it</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Orari di Apertura</h3>
                    <p className="text-muted-foreground">
                      Contattare telefonicamente o via email<br />
                      per appuntamenti e ricevimento in sede
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Options */}
            <Card>
              <CardHeader>
                <CardTitle>Contatto Rapido</CardTitle>
                <CardDescription>
                  Per richieste urgenti o informazioni specifiche
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-forest/20 bg-forest/5 p-3 text-sm text-foreground">
                  Tempo medio di risposta: <span className="font-semibold">1-3 giorni lavorativi</span>.
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => setSubjectAndFocusForm("Informazioni Generali")}
                    >
                    <div className="text-left">
                        <div className="font-semibold">Informazioni Generali</div>
                      <div className="text-sm text-muted-foreground">
                          Domande su sedi, orari e servizi disponibili
                      </div>
                    </div>
                  </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => setSubjectAndFocusForm("Tesseramento")}
                    >
                    <div className="text-left">
                      <div className="font-semibold">Supporto Tesseramenti</div>
                      <div className="text-sm text-muted-foreground">
                        Assistenza per rinnovi e nuove iscrizioni
                      </div>
                    </div>
                  </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => setSubjectAndFocusForm("Eventi e Gare")}
                    >
                    <div className="text-left">
                        <div className="font-semibold">Eventi e Gare</div>
                      <div className="text-sm text-muted-foreground">
                          Informazioni su calendario, bandi e iscrizioni
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Come Raggiungerci */}
            <Card>
              <CardHeader>
                <CardTitle>Come Raggiungerci</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/30 p-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 text-forest" />
                    <div>
                      <p className="font-semibold text-foreground">Sezione Provinciale Treviso</p>
                      <p className="text-sm text-muted-foreground">Via C. Cattaneo, 28 - 31100 Treviso (TV)</p>
                      <p className="text-xs text-muted-foreground mt-1">Ricevimento su appuntamento</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>
                    <strong>In auto:</strong> imposta il navigatore su Via C. Cattaneo 28, Treviso.
                  </p>
                  <p className="mt-1">
                    <strong>Trasporto pubblico:</strong> verificare linee urbane con fermata in zona centro Treviso.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Domande Frequenti</CardTitle>
              <CardDescription>
                Le risposte alle domande più comuni dei nostri associati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Come posso iscrivermi all'associazione?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Puoi registrarti online attraverso il nostro sito. La registrazione 
                    richiede l'approvazione degli amministratori prima dell'attivazione.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Quanto costa il tesseramento annuale?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Offriamo diverse tipologie di tessera a partire da €6/anno. 
                    Visita la sezione tesseramento per tutti i dettagli.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Come posso partecipare alle gare cinofile?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    È necessario essere soci attivi con tessera valida. Le iscrizioni 
                    si aprono solitamente 30 giorni prima dell'evento.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Che assistenza legale fornite?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Offriamo consulenza su normative venatorie, contenziosi e 
                    pratiche amministrative legate alla caccia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      
    </div>
  );
}
