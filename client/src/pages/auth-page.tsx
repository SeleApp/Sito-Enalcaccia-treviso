import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    nome: "",
    cognome: "",
    dataNascita: "",
    luogoNascita: "",
    codiceFiscale: "",
    numeroLicenza: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.passwordConfirm) {
      return;
    }

    const { passwordConfirm, ...userData } = registerForm;
    registerMutation.mutate({
      ...userData,
      username: userData.email, // Use email as username
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        {/* Left side - Forms */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-between mb-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Torna al sito
                </Button>
              </Link>
            </div>
            <CardTitle className="text-2xl font-serif">Enal Caccia</CardTitle>
            <p className="text-gray-600">Accedi al tuo account o registrati</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Registrazione</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Email</Label>
                    <Input
                      id="username"
                      type="email"
                      placeholder="tua@email.com"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Accesso...
                      </>
                    ) : (
                      "Accedi"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        type="text"
                        placeholder="Mario"
                        value={registerForm.nome}
                        onChange={(e) => setRegisterForm({ ...registerForm, nome: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cognome">Cognome *</Label>
                      <Input
                        id="cognome"
                        type="text"
                        placeholder="Rossi"
                        value={registerForm.cognome}
                        onChange={(e) => setRegisterForm({ ...registerForm, cognome: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataNascita">Data di Nascita *</Label>
                      <Input
                        id="dataNascita"
                        type="date"
                        value={registerForm.dataNascita}
                        onChange={(e) => setRegisterForm({ ...registerForm, dataNascita: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="luogoNascita">Luogo di Nascita *</Label>
                      <Input
                        id="luogoNascita"
                        type="text"
                        placeholder="Roma"
                        value={registerForm.luogoNascita}
                        onChange={(e) => setRegisterForm({ ...registerForm, luogoNascita: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codiceFiscale">Codice Fiscale *</Label>
                      <Input
                        id="codiceFiscale"
                        type="text"
                        placeholder="RSSMRA80A01H501Z"
                        value={registerForm.codiceFiscale}
                        onChange={(e) => setRegisterForm({ ...registerForm, codiceFiscale: e.target.value.toUpperCase() })}
                        pattern="[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]"
                        maxLength={16}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroLicenza">Numero Licenza *</Label>
                      <Input
                        id="numeroLicenza"
                        type="text"
                        placeholder="123456789"
                        value={registerForm.numeroLicenza}
                        onChange={(e) => setRegisterForm({ ...registerForm, numeroLicenza: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="mario.rossi@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password-reg">Password *</Label>
                      <Input
                        id="password-reg"
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        minLength={8}
                        required
                      />
                      <p className="text-xs text-gray-500">Minimo 8 caratteri, almeno un numero e una lettera</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordConfirm">Conferma Password *</Label>
                      <Input
                        id="passwordConfirm"
                        type="password"
                        value={registerForm.passwordConfirm}
                        onChange={(e) => setRegisterForm({ ...registerForm, passwordConfirm: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {registerForm.password !== registerForm.passwordConfirm && registerForm.passwordConfirm && (
                    <Alert>
                      <AlertDescription>Le password non corrispondono</AlertDescription>
                    </Alert>
                  )}

                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertDescription className="text-yellow-800">
                      <strong>Richiesta in Attesa di Approvazione:</strong> La tua registrazione sarà sottoposta a revisione da parte degli amministratori. Riceverai una conferma via email una volta approvata.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={registerMutation.isPending || registerForm.password !== registerForm.passwordConfirm}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registrazione...
                      </>
                    ) : (
                      "Registrati"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right side - Hero section */}
        <div className="hidden lg:flex lg:items-center lg:justify-center">
          <div className="max-w-md text-center">
            <div 
              className="w-full h-96 bg-cover bg-center rounded-lg mb-6"
              style={{
                backgroundImage: "linear-gradient(rgba(45, 80, 22, 0.7), rgba(45, 80, 22, 0.7)), url('https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600')"
              }}
            />
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Benvenuti in Enal Caccia
            </h2>
            <p className="text-gray-600 mb-6">
              L'associazione italiana dedicata alla promozione della caccia responsabile, 
              della cinofilia e della tutela del patrimonio ambientale.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Tesseramento online</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Gare cinofile</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Formazione specializzata</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Comunità attiva</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
