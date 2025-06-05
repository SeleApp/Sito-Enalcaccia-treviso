import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative h-96 hero-gradient overflow-hidden">
      {/* Background overlay with forest image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600')"
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Enal Caccia</h1>
          <p className="text-xl md:text-2xl mb-2">Ente Nazionale Associazioni Libere della Caccia</p>
          <p className="text-lg mb-8 max-w-2xl">
            Promuoviamo la caccia responsabile e sostenibile, valorizzando le tradizioni venatorie italiane 
            attraverso formazione, competizioni cinofile e tesseramenti.
          </p>
          <div className="flex flex-wrap gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 py-3 text-lg">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/membership">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 py-3 text-lg">
                  Iscriviti Ora
                </Button>
              </Link>
            )}
            <Link href="/news">
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-3 text-lg"
              >
                Scopri di Più
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
