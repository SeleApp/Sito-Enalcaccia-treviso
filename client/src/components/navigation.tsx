import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Target, Menu, LogOut } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "News", href: "/news" },
    { name: "Gare Cinofile", href: "/competitions" },
    { name: "Tesseramento", href: "/membership" },
    { name: "Contatti", href: "/contact" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Target className="h-8 w-8 text-primary mr-3" />
              <span className="font-serif font-bold text-xl text-foreground">Enal Caccia</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`${
                    location === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Ciao, {user.nome}
                </span>
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button variant="outline">
                    {user.role === "admin" ? "Admin" : "Dashboard"}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth">
                  <Button className="btn-primary">Registrazione</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                          location === item.href ? "text-primary bg-primary/10" : ""
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4">
                    {user ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground px-3">
                          Ciao, {user.nome}
                        </p>
                        <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setMobileOpen(false)}
                          >
                            {user.role === "admin" ? "Admin Dashboard" : "Il Mio Dashboard"}
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            handleLogout();
                            setMobileOpen(false);
                          }}
                          disabled={logoutMutation.isPending}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/auth">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setMobileOpen(false)}
                          >
                            Login
                          </Button>
                        </Link>
                        <Link href="/auth">
                          <Button
                            className="w-full justify-start btn-primary"
                            onClick={() => setMobileOpen(false)}
                          >
                            Registrazione
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
