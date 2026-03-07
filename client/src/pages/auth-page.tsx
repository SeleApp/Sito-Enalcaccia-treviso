import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema } from "@shared/schema";
import { Shield, Users, Trophy } from "lucide-react";

const DOG_PHOTO_1 = "/attached_assets/cane-caccia-1.jpg";

const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "Password richiesta"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof insertUserSchema>;

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

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(insertUserSchema),
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
    },
  });

  const onLogin = async (data: LoginForm) => {
    try {
      await loginMutation.mutateAsync(data);
      toast({
        title: "Accesso effettuato",
        description: "Benvenuto in Enal Caccia!",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Errore di accesso",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onRegister = async (data: RegisterForm) => {
    try {
      await registerMutation.mutateAsync(data);
      toast({
        title: "Registrazione inviata",
        description: "La tua richiesta è in attesa di approvazione da parte degli amministratori.",
      });
      setActiveTab("login");
      registerForm.reset();
    } catch (error: any) {
      toast({
        title: "Errore nella registrazione",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left side - Forms */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-serif font-bold">Enal Caccia</h1>
              <p className="text-muted-foreground">
                Accedi al tuo account o crea un nuovo profilo
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Accedi</TabsTrigger>
                <TabsTrigger value="register">Registrati</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Accesso</CardTitle>
                    <CardDescription>
                      Inserisci le tue credenziali per accedere
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="tua@email.com"
                          {...loginForm.register("email")}
                        />
                        {loginForm.formState.errors.email && (
                          <p className="text-sm text-destructive">
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          {...loginForm.register("password")}
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-destructive">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Accesso in corso..." : "Accedi"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Registrazione</CardTitle>
                    <CardDescription>
                      Compila il modulo per richiedere l'iscrizione
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome *</Label>
                          <Input
                            id="nome"
                            placeholder="Mario"
                            {...registerForm.register("nome")}
                          />
                          {registerForm.formState.errors.nome && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.nome.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cognome">Cognome *</Label>
                          <Input
                            id="cognome"
                            placeholder="Rossi"
                            {...registerForm.register("cognome")}
                          />
                          {registerForm.formState.errors.cognome && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.cognome.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dataNascita">Data di Nascita *</Label>
                          <Input
                            id="dataNascita"
                            type="date"
                            {...registerForm.register("dataNascita")}
                          />
                          {registerForm.formState.errors.dataNascita && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.dataNascita.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="luogoNascita">Luogo di Nascita *</Label>
                          <Input
                            id="luogoNascita"
                            placeholder="Roma"
                            {...registerForm.register("luogoNascita")}
                          />
                          {registerForm.formState.errors.luogoNascita && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.luogoNascita.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="codiceFiscale">Codice Fiscale *</Label>
                          <Input
                            id="codiceFiscale"
                            placeholder="RSSMRA80A01H501Z"
                            className="uppercase"
                            {...registerForm.register("codiceFiscale")}
                          />
                          {registerForm.formState.errors.codiceFiscale && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.codiceFiscale.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="numeroLicenza">Numero Licenza *</Label>
                          <Input
                            id="numeroLicenza"
                            placeholder="123456789"
                            {...registerForm.register("numeroLicenza")}
                          />
                          {registerForm.formState.errors.numeroLicenza && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.numeroLicenza.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email *</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="mario.rossi@email.com"
                          {...registerForm.register("email")}
                        />
                        {registerForm.formState.errors.email && (
                          <p className="text-sm text-destructive">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            {...registerForm.register("password")}
                          />
                          <p className="text-xs text-muted-foreground">
                            Minimo 8 caratteri, almeno un numero e una lettera
                          </p>
                          {registerForm.formState.errors.password && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.password.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="passwordConfirm">Conferma Password *</Label>
                          <Input
                            id="passwordConfirm"
                            type="password"
                            {...registerForm.register("passwordConfirm")}
                          />
                          {registerForm.formState.errors.passwordConfirm && (
                            <p className="text-sm text-destructive">
                              {registerForm.formState.errors.passwordConfirm.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <Shield className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm text-yellow-800 font-medium">
                              Richiesta in Attesa di Approvazione
                            </p>
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
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Invio in corso..." : "Invia Richiesta di Registrazione"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right side - Hero */}
        <div className="hidden lg:block relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${DOG_PHOTO_1}')`
            }}
          />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="relative h-full flex items-center justify-center p-8">
            <div className="text-white text-center max-w-md">
              <h2 className="text-3xl font-serif font-bold mb-6">
                Unisciti alla Comunità Enal Caccia
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Fai parte della più grande associazione venatoria italiana. 
                Accedi a servizi esclusivi, partecipa alle gare cinofile e 
                contribuisci alla conservazione del patrimonio ambientale.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center text-left">
                  <Shield className="w-6 h-6 mr-4 text-accent" />
                  <div>
                    <h3 className="font-semibold">Tradizione e Sicurezza</h3>
                    <p className="text-sm opacity-80">Caccia responsabile nel rispetto delle normative</p>
                  </div>
                </div>
                
                <div className="flex items-center text-left">
                  <Trophy className="w-6 h-6 mr-4 text-accent" />
                  <div>
                    <h3 className="font-semibold">Competizioni</h3>
                    <p className="text-sm opacity-80">Partecipa alle gare cinofile in tutta Italia</p>
                  </div>
                </div>
                
                <div className="flex items-center text-left">
                  <Users className="w-6 h-6 mr-4 text-accent" />
                  <div>
                    <h3 className="font-semibold">Comunità</h3>
                    <p className="text-sm opacity-80">Network di cacciatori esperti e principianti</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
