import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Download, Eye, RefreshCw, Search, Users } from "lucide-react";

type MemberStatus = "pending" | "approved" | "rejected" | "unknown";

type RegisteredMember = {
  id: string;
  email: string;
  role: string;
  name: string;
  surname: string;
  birthDate: string | null;
  birthPlace: string | null;
  taxCode: string | null;
  licenseNumber: string | null;
  status: MemberStatus;
  createdAt: string | null;
  updatedAt: string | null;
};

const statusText: Record<MemberStatus, string> = {
  approved: "Approvato",
  pending: "In attesa",
  rejected: "Rifiutato",
  unknown: "Da verificare",
};

function displayDate(value: string | null, isBirthDate = false): string {
  if (!value) return "Non indicata";
  if (isBirthDate && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Non indicata" : date.toLocaleDateString("it-IT");
}

function csvSafe(value: unknown): string {
  let content = String(value ?? "");
  // Evita l'esecuzione di formule all'apertura del CSV in Excel o Calc.
  if (/^\s*[=+@-]/.test(content)) content = "'" + content;
  return '"' + content.replace(/"/g, '""') + '"';
}

function exportMembersCsv(rows: RegisteredMember[]) {
  const columns: Array<[string, (person: RegisteredMember) => string | null]> = [
    ["Nome", (p) => p.name],
    ["Cognome", (p) => p.surname],
    ["Email", (p) => p.email],
    ["Data di nascita", (p) => p.birthDate ? displayDate(p.birthDate, true) : ""],
    ["Luogo di nascita", (p) => p.birthPlace],
    ["Codice fiscale", (p) => p.taxCode],
    ["Numero licenza", (p) => p.licenseNumber],
    ["Stato registrazione", (p) => statusText[p.status]],
    ["Ruolo account", (p) => p.role === "admin" ? "Amministratore" : "Socio"],
    ["Data registrazione", (p) => p.createdAt ? displayDate(p.createdAt) : ""],
    ["Ultimo aggiornamento", (p) => p.updatedAt ? displayDate(p.updatedAt) : ""],
  ];
  const content = [
    columns.map(([name]) => csvSafe(name)).join(";"),
    ...rows.map((person) => columns.map(([, get]) => csvSafe(get(person))).join(";")),
  ].join("\r\n");
  const blob = new Blob(["\ufeff", content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `enalcaccia-treviso-soci-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0 rounded-md border bg-muted/20 p-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-base font-medium">{value?.trim() || "Non indicato"}</dd>
    </div>
  );
}

/** I dati sono caricati da una API riservata che verifica il ruolo amministratore lato server. */
export function AdminMembersRegistry() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<RegisteredMember | null>(null);
  const { data, isPending, isError, refetch, isFetching } = useQuery<RegisteredMember[]>({
    queryKey: ["/api/admin/members"],
    staleTime: 0,
    refetchOnMount: "always",
  });

  const people = data || [];
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("it-IT");
    return people
      .filter((person) => filter === "all" || person.status === filter)
      .filter((person) => {
        if (!term) return true;
        return [person.name, person.surname, person.email, person.taxCode, person.licenseNumber]
          .some((value) => (value || "").toLocaleLowerCase("it-IT").includes(term));
      })
      .sort((a, b) => {
        const byName = `${a.surname} ${a.name}`.localeCompare(`${b.surname} ${b.name}`, "it");
        return byName || a.email.localeCompare(b.email, "it");
      });
  }, [people, search, filter]);

  const approved = people.filter((p) => p.status === "approved").length;
  const pending = people.filter((p) => p.status === "pending").length;

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="h-5 w-5 text-forest" />
          Anagrafica degli utenti registrati
        </CardTitle>
        <CardDescription className="text-base leading-6">
          Consulta i dati dei soci registrati, cerca per nominativo, email o codice fiscale
          ed esporta in CSV compatibile con Microsoft Excel. La lista è riservata agli amministratori.
        </CardDescription>
        {!isPending && !isError && (
          <p className="text-sm text-muted-foreground">
            {people.length} account registrati · {approved} approvati · {pending} in attesa
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_190px_auto] lg:items-end">
          <div className="space-y-2">
            <Label htmlFor="member-search" className="text-base">Cerca un socio</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Input
                id="member-search"
                type="search"
                placeholder="Nome, cognome, email, codice fiscale…"
                className="h-12 pl-10 text-base"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-base" htmlFor="member-status-filter">Stato</Label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger id="member-status-filter" className="h-12 text-base">
                <SelectValue placeholder="Tutti gli stati" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="approved">Approvati</SelectItem>
                <SelectItem value="pending">In attesa</SelectItem>
                <SelectItem value="rejected">Rifiutati</SelectItem>
                <SelectItem value="unknown">Da verificare</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="h-12" onClick={() => void refetch()} disabled={isFetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Aggiorna
            </Button>
            <Button
              type="button"
              className="h-12"
              onClick={() => exportMembersCsv(filtered)}
              disabled={isPending || isError || filtered.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Scarica CSV per Excel
            </Button>
          </div>
        </div>

        {isPending ? (
          <p role="status" className="py-10 text-center text-base">Caricamento dell'anagrafica…</p>
        ) : isError ? (
          <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-base text-red-800">
            Non è stato possibile caricare i dati. Verifica l'accesso amministratore e riprova.
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-md bg-muted/30 px-4 py-10 text-center text-base">
            {people.length === 0 ? "Non ci sono ancora account registrati." : "Nessun socio corrisponde ai filtri selezionati."}
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {filtered.length} risultati. Il file CSV contiene gli stessi utenti visibili con i filtri attuali e tutti i dati disponibili.
            </p>
            <div className="grid gap-3 xl:hidden">
              {filtered.map((person) => (
                <div key={person.id} className="rounded-2xl border border-[#DFE5DA] bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[18px] font-semibold leading-snug text-[#193024]">
                        {`${person.name} ${person.surname}`.trim() || "Dati non compilati"}
                      </h3>
                      <p className="mt-1 break-words text-[15px] text-[#617062]">{person.email}</p>
                    </div>
                    <Badge variant={person.status === "approved" ? "default" : "secondary"}>
                      {statusText[person.status]}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-[#617062]">Registrato il {displayDate(person.createdAt)}</p>
                  {person.role === "admin" && <p className="mt-1 text-sm font-semibold text-[#2D5016]">Amministratore</p>}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 min-h-12 w-full text-base"
                    onClick={() => setSelected(person)}
                  >
                    <Eye className="mr-2 h-5 w-5" aria-hidden="true" />
                    Apri la scheda completa
                  </Button>
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto rounded-lg border xl:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome e cognome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Data registrazione</TableHead>
                    <TableHead className="text-right">Scheda</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium text-base">
                        {`${person.name} ${person.surname}`.trim() || "Dati non compilati"}
                        {person.role === "admin" && <span className="ml-2 text-xs text-muted-foreground">(admin)</span>}
                      </TableCell>
                      <TableCell className="text-sm">{person.email}</TableCell>
                      <TableCell>
                        <Badge variant={person.status === "approved" ? "default" : "secondary"}>
                          {statusText[person.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{displayDate(person.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button type="button" variant="outline" size="sm" className="min-h-10" onClick={() => setSelected(person)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Dettagli
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>

      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Scheda socio</DialogTitle>
            <DialogDescription className="text-base">
              Dati forniti durante la registrazione e stato dell'account.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <dl className="grid gap-3 sm:grid-cols-2">
              <Detail label="Nome" value={selected.name} />
              <Detail label="Cognome" value={selected.surname} />
              <Detail label="Indirizzo email" value={selected.email} />
              <Detail label="Data di nascita" value={selected.birthDate ? displayDate(selected.birthDate, true) : null} />
              <Detail label="Luogo di nascita" value={selected.birthPlace} />
              <Detail label="Codice fiscale" value={selected.taxCode} />
              <Detail label="Numero licenza" value={selected.licenseNumber} />
              <Detail label="Stato" value={statusText[selected.status]} />
              <Detail label="Ruolo" value={selected.role === "admin" ? "Amministratore" : "Socio"} />
              <Detail label="Registrato il" value={selected.createdAt ? displayDate(selected.createdAt) : null} />
              <Detail label="Ultimo aggiornamento" value={selected.updatedAt ? displayDate(selected.updatedAt) : null} />
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
