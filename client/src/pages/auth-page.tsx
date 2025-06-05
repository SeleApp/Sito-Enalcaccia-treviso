import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Target, Users, Trophy, Shield } from "lucide-react";
import { insertPendingUserSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().email("Email non valida"),
  password: z.string().min(1, "Password richiesta"),
});

const registrationSchema = insertPendingUserSchema.extend({
  passwordConfirm: z.string().min(8, "Password deve essere di almeno 8 caratteri"),
  privacy: z.boolean().refine((val) => val === true, "Devi accettare i termini e condizioni"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Le password non corrispondono",
  path: ["passwordConfirm"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registrationForm = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      nome: "",
      cognome: "",
      dataNascita: "",
      luogoNascita: "",
      codiceFiscale: "",
      numeroLicenza: "",
      email: "",
      password: "",
      passwordConfirm: "",
      role: "utente",
      privacy: false,
    },
  });

  const pendingRegistrationMutation = useMutation({
    mutationFn: async (data: Omit<RegistrationFormData, "passwordConfirm" | "privacy">) => {
      const res = await apiRequest("POST", "/api/register-pending", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registrazione inviata!",
        description: "La tua richiesta è in attesa di approvazione da parte degli amministratori.",
      });
      registrationForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Errore nella registrazione",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [user, setLocation]);

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleRegistration = (data: RegistrationFormData) => {
    const { passwordConfirm, privacy, ...registrationData } = data;
    pendingRegistrationMutation.mutate(registrationData);
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Target className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-serif font-bold text-foreground">Enal Caccia</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Unisciti alla più grande associazione venatoria italiana
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Comunità Attiva</h3>
                <p className="text-muted-foreground">
                  Oltre 50.000 membri in tutta Italia condividono la passione per la caccia responsabile
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Gare e Competizioni</h3>
                <p className="text-muted-foreground">
                  Partecipa alle gare cinofile e alle competizioni nazionali
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Formazione e Supporto</h3>
                <p className="text-muted-foreground">
                  Corsi di formazione, assistenza legale e supporto completo per tutti i soci
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300"
              alt="Cacciatori in natura"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Auth Forms */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex lg:hidden items-center justify-center space-x-2 mb-4">
              <Target className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-serif font-bold text-foreground">Enal Caccia</h1>
            </div>
            <CardTitle>Accedi al tuo account</CardTitle>
            <CardDescription>
              Entra nella comunità dei cacciatori responsabili
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Accedi</TabsTrigger>
                <TabsTrigger value="register">Registrati</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="tua@email.com" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="La tua password" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full btn-primary"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Accesso in corso..." : "Accedi"}
                    </Button>
                  </form>
                </Form>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Account demo: admin@enalcaccia.it / admin123</p>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <Form {...registrationForm}>
                  <form onSubmit={registrationForm.handleSubmit(handleRegistration)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registrationForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome *</FormLabel>
                            <FormControl>
                              <Input placeholder="Mario" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registrationForm.control}
                        name="cognome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cognome *</FormLabel>
                            <FormControl>
                              <Input placeholder="Rossi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registrationForm.control}
                        name="dataNascita"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data di Nascita *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registrationForm.control}
                        name="luogoNascita"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Luogo di Nascita *</FormLabel>
                            <FormControl>
                              <Input placeholder="Roma" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registrationForm.control}
                        name="codiceFiscale"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Codice Fiscale *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="RSSMRA80A01H501Z" 
                                className="uppercase"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registrationForm.control}
                        name="numeroLicenza"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numero Licenza *</FormLabel>
                            <FormControl>
                              <Input placeholder="123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registrationForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="mario.rossi@email.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registrationForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password *</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registrationForm.control}
                        name="passwordConfirm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Conferma Password *</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registrationForm.control}
                      name="privacy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              Accetto i{" "}
                              <Button variant="link" className="p-0 h-auto text-primary">
                                termini e condizioni
                              </Button>{" "}
                              e l'{" "}
                              <Button variant="link" className="p-0 h-auto text-primary">
                                informativa sulla privacy
                              </Button>{" "}
                              *
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Shield className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-amber-800 font-medium">
                            Richiesta in Attesa di Approvazione
                          </p>
                          <p className="text-sm text-amber-700 mt-1">
                            La tua registrazione sarà sottoposta a revisione da parte degli amministratori. 
                            Riceverai una conferma via email una volta approvata.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-primary"
                      disabled={pendingRegistrationMutation.isPending}
                    >
                      {pendingRegistrationMutation.isPending ? "Invio in corso..." : "Invia Richiesta di Registrazione"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link href="/">
                <Button variant="link" className="text-muted-foreground">
                  ← Torna alla home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
