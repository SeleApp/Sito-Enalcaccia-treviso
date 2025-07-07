import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Menu, User, LogOut, Shield, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Home & News" },
    { href: "/scuola-venatoria", label: "Scuola Venatoria" },
    { href: "/direttivo", label: "Direttivo" },
    { 
      label: "Gare", 
      submenu: [
        { href: "/gare-cinofile", label: "Gare Cinofile" },
        { href: "/gare-pesca", label: "Gare Pesca" },
        { href: "/gare-tiro", label: "Gare Tiro" }
      ]
    },
    { href: "/pesca-tiro", label: "Pesca & Tiro" },
    { href: "/membership", label: "Tesseramento" },
    { href: "/contact", label: "Contatti" },
  ];

  const isActivePath = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/attached_assets/ChatGPT Image 7 lug 2025, 21_18_39_1751916102927.png" 
                alt="Logo ENAL Caccia Treviso" 
                className="w-12 h-12 object-cover rounded-full"
              />
              <span className="font-serif font-bold text-xl text-forest">Enal Caccia, Pesca e Tiro - Treviso</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.submenu ? (
                  <>
                    <button
                      className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                        item.submenu.some(subItem => isActivePath(subItem.href))
                          ? "text-forest"
                          : "text-gray-700 hover:text-forest"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown menu */}
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActivePath(subItem.href)
                                ? "text-forest bg-forest/10"
                                : "text-gray-700 hover:text-forest hover:bg-forest/5"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`block px-3 py-2 text-sm font-medium transition-colors ${
                      isActivePath(item.href!)
                        ? "text-forest border-b-2 border-forest"
                        : "text-gray-700 hover:text-forest"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{user.nome}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.nome} {user.cognome}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center w-full">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center w-full">
                        <Shield className="w-4 h-4 mr-2" />
                        Amministrazione
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center w-full text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth">
                  <Button variant="ghost" className="text-forest hover:text-forest hover:bg-forest/10">
                    Login
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-forest hover:bg-forest/90 text-white">
                    Registrazione
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-3">
                    <img 
                      src="/attached_assets/ChatGPT Image 7 lug 2025, 21_18_39_1751916102927.png" 
                      alt="Logo ENAL Caccia Treviso" 
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <span className="font-serif font-bold text-forest">Enal Caccia</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* User Info (Mobile) */}
                  {user && (
                    <div className="border-b pb-4">
                      <p className="font-medium">{user.nome} {user.cognome}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <div key={item.label}>
                        {item.submenu ? (
                          <>
                            <div className="px-3 py-2 text-base font-medium text-gray-900 border-b border-gray-200">
                              {item.label}
                            </div>
                            <div className="ml-4 space-y-1">
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                    isActivePath(subItem.href)
                                      ? "text-forest bg-forest/10"
                                      : "text-gray-600 hover:text-forest hover:bg-forest/5"
                                  }`}
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : (
                          <Link
                            href={item.href!}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              isActivePath(item.href!)
                                ? "text-forest bg-forest/10"
                                : "text-gray-700 hover:text-forest hover:bg-forest/5"
                            }`}
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* User Actions (Mobile) */}
                  {user ? (
                    <div className="space-y-2 border-t pt-4">
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-forest hover:bg-forest/5 rounded-md"
                      >
                        <User className="w-5 h-5 mr-3" />
                        Dashboard
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-forest hover:bg-forest/5 rounded-md"
                        >
                          <Shield className="w-5 h-5 mr-3" />
                          Amministrazione
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-base font-medium text-destructive hover:bg-destructive/5 rounded-md"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 border-t pt-4">
                      <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-center">
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full justify-center bg-forest hover:bg-forest/90">
                          Registrazione
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
