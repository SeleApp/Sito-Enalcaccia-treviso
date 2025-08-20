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

  const subjectOptions = [
    { value: "tesseramento", label: "Tesseramento" },
    { value: "gare", label: "Gare Cinofile" },
    { value: "corsi", label: "Corsi di Formazione" },
    { value: "assistenza", label: "Assistenza Legale" },
    { value: "generale", label: "Informazioni Generali" },
    { value: "altro", label: "Altro" },
  ];

  return (
    <div className="bg-background">{/* Layout now handles min-h-screen */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Contattaci</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Siamo qui per rispondere alle tue domande e fornirti tutte le informazioni 
            di cui hai bisogno. Non esitare a contattarci!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
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
                  Puoi raggiungerci attraverso questi canali
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
                      Via Roma, 45<br />
                      31100 Treviso (TV)<br />
                      Veneto, Italia
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
                      <a href="tel:+390422785432" className="hover:text-forest transition-colors">
                        +39 0422 785432
                      </a>
                      <br />
                      Lun-Ven: 9:00-17:00<br />
                      Sab: 9:00-12:00
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
                      <a href="mailto:info@enalcaccia-treviso.it" className="hover:text-forest transition-colors">
                        info@enalcaccia-treviso.it
                      </a>
                      <br />
                      <a href="mailto:segretario@enalcaccia-treviso.it" className="hover:text-forest transition-colors">
                        segretario@enalcaccia-treviso.it
                      </a>
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
                      Lunedì - Venerdì: 9:00 - 17:00<br />
                      Sabato: 9:00 - 12:00<br />
                      Domenica: Chiuso
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
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Emergenze Caccia</div>
                      <div className="text-sm text-muted-foreground">
                        Per problemi urgenti durante la stagione venatoria
                      </div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Supporto Tesseramenti</div>
                      <div className="text-sm text-muted-foreground">
                        Assistenza per rinnovi e nuove iscrizioni
                      </div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-semibold">Gare Cinofile</div>
                      <div className="text-sm text-muted-foreground">
                        Informazioni su competizioni e iscrizioni
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Come Raggiungerci</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Mappa interattiva</p>
                    <p className="text-xs">
                      Via Roma, 45 - Treviso (TV)
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>
                    <strong>In auto:</strong> Uscita A27 Treviso Sud, seguire indicazioni centro città.
                  </p>
                  <p className="mt-1">
                    <strong>Trasporto pubblico:</strong> Fermata autobus "Centro" a 200 metri.
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
                    Offriamo diverse tipologie di tessera a partire da €85/anno. 
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
