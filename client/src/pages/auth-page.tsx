import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertUserSchema } from "@shared/schema";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Crosshair, Shield, Users, Leaf } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username richiesto"),
  password: z.string().min(1, "Password richiesta"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      nome: "",
      cognome: "",
      dataNascita: "",
      luogoNascita: "",
      codiceFiscale: "",
      numeroLicenza: "",
    },
  });

  const pendingRegistrationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertUserSchema>) => {
      const res = await apiRequest("POST", "/api/auth/register-pending", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registrazione inviata",
        description: "La tua richiesta è stata inviata e sarà valutata dall'amministratore. Riceverai una conferma via email.",
      });
      registerForm.reset();
      setActiveTab("login");
    },
    onError: (error: Error) => {
      toast({
        title: "Errore nella registrazione",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: z.infer<typeof insertUserSchema>) => {
    pendingRegistrationMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Section */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                  <Crosshair className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Unisciti a Enal Caccia</h1>
              </div>
              
              <p className="text-xl text-muted-foreground mb-8">
                Diventa parte della più grande associazione italiana per la promozione della caccia responsabile e sostenibile.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Tradizione e Sicurezza</h3>
                    <p className="text-muted-foreground">
                      Promuoviamo la tradizione venatoria italiana nel rispetto delle normative e della sicurezza.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                    <Leaf className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Rispetto Ambientale</h3>
                    <p className="text-muted-foreground">
                      Sosteniamo la conservazione dell'ambiente e la gestione sostenibile della fauna selvatica.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Comunità Unita</h3>
                    <p className="text-muted-foreground">
                      Riuniamo cacciatori esperti e principianti in una comunità basata sul rispetto reciproco.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Forms */}
            <div>
              <Card className="w-full max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-center">Accesso</CardTitle>
                  <CardDescription className="text-center">
                    Accedi al tuo account o registrati per diventare socio
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
                        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username o Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Inserisci username o email" {...field} />
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
                                  <Input type="password" placeholder="Inserisci password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? "Accesso in corso..." : "Accedi"}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-4">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
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
                              control={registerForm.control}
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
                              control={registerForm.control}
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
                              control={registerForm.control}
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
                              control={registerForm.control}
                              name="codiceFiscale"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Codice Fiscale *</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="RSSMRA80A01H501Z" 
                                      {...field} 
                                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
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
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username *</FormLabel>
                                <FormControl>
                                  <Input placeholder="username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="mario.rossi@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password *</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="passwordConfirm"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Conferma Password *</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="w-5 h-5 text-yellow-600 mt-0.5 mr-3">ℹ️</div>
                              <div>
                                <p className="text-sm text-yellow-800 font-medium">Richiesta in Attesa di Approvazione</p>
                                <p className="text-sm text-yellow-700 mt-1">
                                  La tua registrazione sarà sottoposta a revisione da parte degli amministratori. 
                                  Riceverai una conferma via email una volta approvata.
                                </p>
                              </div>
                            </div>
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={pendingRegistrationMutation.isPending}
                          >
                            {pendingRegistrationMutation.isPending ? "Invio in corso..." : "Invia Richiesta di Registrazione"}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
