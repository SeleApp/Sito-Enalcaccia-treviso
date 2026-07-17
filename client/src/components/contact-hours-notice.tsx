import { Clock } from "lucide-react";

export function ContactHoursNotice() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="flex items-start gap-3 rounded-lg border border-forest/20 bg-forest/5 p-4">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-forest" aria-hidden="true" />
        <div>
          <p className="font-semibold text-foreground">Orari di apertura della sede</p>
          <p className="text-sm text-muted-foreground">
            Martedì e giovedì, dalle 08:00 alle 12:00.
          </p>
        </div>
      </div>
    </div>
  );
}
