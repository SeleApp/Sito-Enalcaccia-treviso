import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const WELCOME_SESSION_KEY = "enalcaccia-president-welcome-2026-10";

export function PresidentWelcomeDialog() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(WELCOME_SESSION_KEY) !== "seen";
    } catch {
      return true;
    }
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      try {
        window.sessionStorage.setItem(WELCOME_SESSION_KEY, "seen");
      } catch {
        // Il messaggio resta comunque chiudibile se lo storage non è disponibile.
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-1.5rem)] w-[calc(100%-2rem)] max-w-[360px] overflow-y-auto rounded-2xl border-forest/20 p-0 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:max-w-xl">
        <div className="h-1.5 bg-forest sm:h-2" aria-hidden="true" />
        <div className="px-4 pb-4 pt-4 sm:px-9 sm:pb-9 sm:pt-7">
          <div className="mb-3 flex items-center gap-3 pr-7 sm:mb-6 sm:gap-4">
            <img
              src="/attached_assets/logo-enalcaccia-treviso.png"
              alt="Logo Enalcaccia Treviso"
              className="h-11 w-11 shrink-0 rounded-full border border-forest/20 bg-white object-contain p-1 sm:h-16 sm:w-16"
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-forest sm:text-xs sm:tracking-widest">
                Enalcaccia Treviso
              </p>
              <DialogTitle className="mt-1 font-serif text-xl leading-tight text-foreground sm:text-3xl">
                Un messaggio ai soci
              </DialogTitle>
            </div>
          </div>

          <DialogDescription className="sr-only">
            Messaggio di benvenuto del Presidente Franco Ravagnan per il nuovo sito dell'Associazione.
          </DialogDescription>

          <div className="hidden space-y-4 rounded-lg border-l-4 border-forest bg-forest/5 px-5 py-5 text-[15px] leading-7 text-foreground sm:block sm:px-6 sm:text-base">
            <p className="font-semibold">Cari Soci,</p>
            <p>abbiamo creato il sito della nostra Associazione.</p>
            <p>
              L'obiettivo è quello di avere uno strumento, aggregante ed informativo,
              che possa contribuire a ravvivare la nostra passione e tenerci aggiornati.
            </p>
            <p>
              Inoltre la speranza è che con questo sistema di comunicazione si possa
              contribuire maggiormente nel coinvolgere i giovani.
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-forest bg-forest/5 px-3 py-3 text-[15px] leading-[1.5] text-foreground sm:hidden">
            <p className="font-semibold">Cari Soci,</p>
            <p className="mt-2">
              abbiamo creato il sito della nostra Associazione per restare più uniti e informati,
              condividere la nostra passione e coinvolgere anche i giovani.
            </p>
          </div>

          <div className="mt-3 text-right text-foreground sm:mt-5">
            <p className="text-xs sm:text-sm">Il Presidente</p>
            <p className="font-serif text-base font-semibold sm:text-lg">Franco Ravagnan</p>
          </div>

          <Button
            type="button"
            className="mt-4 h-12 w-full bg-forest text-base font-semibold text-white hover:bg-forest/90 sm:mt-6"
            onClick={() => handleOpenChange(false)}
          >
            Entra nel sito
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
