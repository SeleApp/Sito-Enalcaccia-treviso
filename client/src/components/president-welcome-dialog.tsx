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
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border-forest/20 p-0 shadow-2xl">
        <div className="h-2 bg-forest" aria-hidden="true" />
        <div className="px-5 pb-6 pt-5 sm:px-9 sm:pb-9 sm:pt-7">
          <div className="mb-6 flex items-center gap-4 pr-7">
            <img
              src="/attached_assets/logo-enalcaccia-treviso.png"
              alt="Logo Enalcaccia Treviso"
              className="h-16 w-16 shrink-0 rounded-full border border-forest/20 bg-white object-contain p-1"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-forest">
                Enalcaccia Treviso
              </p>
              <DialogTitle className="mt-1 font-serif text-2xl leading-tight text-foreground sm:text-3xl">
                Un messaggio ai soci
              </DialogTitle>
            </div>
          </div>

          <DialogDescription className="sr-only">
            Messaggio di benvenuto del Presidente Franco Ravagnan per il nuovo sito dell'Associazione.
          </DialogDescription>

          <div className="space-y-4 rounded-lg border-l-4 border-forest bg-forest/5 px-5 py-5 text-[15px] leading-7 text-foreground sm:px-6 sm:text-base">
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

          <div className="mt-5 text-right text-foreground">
            <p className="text-sm">Il Presidente</p>
            <p className="font-serif text-lg font-semibold">Franco Ravagnan</p>
          </div>

          <Button
            type="button"
            className="mt-6 w-full bg-forest font-semibold text-white hover:bg-forest/90"
            onClick={() => handleOpenChange(false)}
          >
            Entra nel sito
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
