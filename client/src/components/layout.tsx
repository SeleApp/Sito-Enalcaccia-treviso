import { ReactNode } from "react";
import { useLocation } from "wouter";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { MobileExperience, MobileFooter, MobileHeader, hasMobileExperience } from "./mobile-experience";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Desktop >= 1280px: keep the original layout and navigation unchanged.
 * Below 1280px: dedicated Figma mobile/tablet shell.
 * Unmigrated routes continue to use their original components, restyled
 * only inside .ec-mobile-fallback; no database or authentication is replaced.
 */
export function Layout({ children }: LayoutProps) {
  const [path] = useLocation();
  const redesigned = hasMobileExperience(path);
  return (
    <>
      <div className="hidden min-h-screen flex-col bg-background xl:flex">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <div className="ec-mobile-shell flex min-h-screen flex-col bg-[#F8F7F1] xl:hidden">
        <MobileHeader />
        <main className="min-w-0 flex-1 pb-20 sm:pb-0">
          {redesigned
            ? <MobileExperience path={path} />
            : <div className="ec-mobile-fallback">{children}</div>}
        </main>
        <MobileFooter />
      </div>
    </>
  );
}
