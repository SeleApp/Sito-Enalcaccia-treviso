import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MembershipCards } from "@/components/membership/membership-cards";
import { PaymentForm } from "@/components/membership/payment-form";
import { useQuery } from "@tanstack/react-query";
import { Membership } from "@shared/schema";
import { useState } from "react";

export default function MembershipPage() {
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

  const { data: memberships = [], isLoading } = useQuery<Membership[]>({
    queryKey: ["/api/memberships"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Tesseramento 2024</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Scegli la tessera più adatta alle tue esigenze. Pagamento sicuro garantito.
          </p>
        </div>

        {selectedMembership ? (
          <PaymentForm 
            membership={selectedMembership}
            onBack={() => setSelectedMembership(null)}
          />
        ) : (
          <MembershipCards
            memberships={memberships}
            isLoading={isLoading}
            onSelect={setSelectedMembership}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
