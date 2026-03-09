import { useMemo } from "react";
import { MagazineSection } from "@/components/magazine-section";
import { SEOHead } from "@/components/seo-head";

export default function MagazinePage() {
  const initialTab = useMemo(() => {
    if (typeof window === "undefined") return "caccia-e-natura" as const;
    return window.location.hash === "#il-beccaccino" ? "il-beccaccino" as const : "caccia-e-natura" as const;
  }, []);

  return (
    <div className="page-shell">
      <SEOHead
        title="Magazine"
        description="Archivio magazine ENAL Caccia Treviso: Caccia e Natura e Il Beccaccino in formato PDF."
        url="https://enalcaccia-treviso.replit.app/magazine"
      />
      <div className="page-wrap">
        <div className="page-header">
          <h1 className="page-title">Magazine</h1>
          <p className="page-subtitle max-w-2xl">
            Pubblicazioni mensili dell'associazione in formato PDF: Caccia e Natura e Il Beccaccino.
          </p>
        </div>

        <MagazineSection title="Archivio Magazine" initialTab={initialTab} />
      </div>
    </div>
  );
}
