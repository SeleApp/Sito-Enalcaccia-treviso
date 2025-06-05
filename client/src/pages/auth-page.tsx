import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Users, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

const loginSchema = z.object({
  username: z.string().email("Email non valida"),
  password: z.string().min(1, "Password richiesta"),
});

const registrationSchema = insertUserSchema.extend({
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Le password non corrispondono",
  path: ["passwordConfirm"],
}).refine((data) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(data.password);
}, {
  message: "Password deve contenere almeno 8 caratteri, una lettera e un numero",
  path: ["password"],
});

type LoginData = z.infer<typeof loginSchema>;
type RegistrationData = z.infer<typeof registrationSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registrationForm = useForm<RegistrationData>({
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
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationData) => {
      const { passwordConfirm, ...registrationData } = data;
      const res = await apiRequest("POST", "/api/register-pending", registrationData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registrazione inviata",
        description: "La tua richiesta è in attesa di approvazione amministratore.",
      });
      registrationForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Errore registrazione",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegistrationData) => {
    registrationMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-12 w-12 text-forest" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Enal Caccia</h1>
            <p className="text-gray-600 mt-2">Accedi o registrati per continuare</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Accedi</TabsTrigger>
              <TabsTrigger value="register">Registrati</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Accedi al tuo account</CardTitle>
                  <CardDescription>
                    Inserisci le tue credenziali per accedere
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="tua@email.com" {...field} />
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
                              <Input type="password" placeholder="Password" {...field} />
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Registrazione</CardTitle>
                  <CardDescription>
                    Compila tutti i campi per richiedere l'iscrizione
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registrationForm}>
                    <form onSubmit={registrationForm.handleSubmit(onRegister)} className="space-y-4">
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
                                  style={{ textTransform: 'uppercase' }}
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
                              <Input type="email" placeholder="mario.rossi@email.com" {...field} />
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

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <Trophy className="text-yellow-600 h-5 w-5 mr-3 mt-0.5" />
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
                        className="w-full btn-primary"
                        disabled={registrationMutation.isPending}
                      >
                        {registrationMutation.isPending ? "Invio in corso..." : "Invia Richiesta di Registrazione"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 bg-forest relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(45, 80, 22, 0.8), rgba(45, 80, 22, 0.8)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200')"
          }}
        />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h2 className="text-4xl font-serif font-bold mb-6">Unisciti alla Comunità</h2>
          <p className="text-xl mb-8 text-green-100">
            Enal Caccia è la tua porta d'accesso al mondo della caccia responsabile e sostenibile in Italia.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <Trophy className="h-8 w-8 text-goldenrod mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Gare e Competizioni</h3>
                <p className="text-green-100">Partecipa alle gare cinofile organizzate in tutta Italia</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <GraduationCap className="h-8 w-8 text-goldenrod mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Formazione</h3>
                <p className="text-green-100">Accedi a corsi di formazione e aggiornamenti normativi</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="h-8 w-8 text-goldenrod mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Comunità</h3>
                <p className="text-green-100">Entra a far parte di una comunità di cacciatori appassionati</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
