import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { MobileExperience, MobileFooter, MobileHeader, hasMobileExperience } from "./mobile-experience";

interface LayoutProps {
  children: ReactNode;
}

const MOBILE_TABLET_QUERY = "(max-width: 1279px)";

function useMobileOrTablet() {
  const [compact, setCompact] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(MOBILE_TABLET_QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_TABLET_QUERY);
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return compact;
}

/** Original desktop stays identical at 1280px and above. */
export function Layout({ children }: LayoutProps) {
  const [path] = useLocation();
  const compact = useMobileOrTablet();

  if (!compact) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="ec-mobile-shell flex min-h-screen flex-col bg-[#F8F7F1]">
      <MobileHeader />
      <main className="min-w-0 flex-1 pb-20 sm:pb-0">
        {hasMobileExperience(path)
          ? <MobileExperience path={path} />
          : <div className="ec-mobile-fallback">{children}</div>}
      </main>
      <MobileFooter />
    </div>
  );
}
