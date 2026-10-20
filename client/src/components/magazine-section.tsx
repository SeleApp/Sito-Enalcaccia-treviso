import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Eye, BookOpen } from "lucide-react";

type MagazineTab = "caccia-e-natura" | "il-beccaccino";

type MagazineIssue = {
  id: string;
  magazine: "Caccia e Natura" | "Il Beccaccino";
  edition: string;
  file: string;
  cover: string;
  source: string;
};

/**
 * Ultime cinque edizioni di ogni rivista, verificate sull'archivio
 * ufficiale Enalcaccia Nazionale (20 ottobre 2026).
 *
 * I PDF sono ospitati dal sito nazionale: evitiamo duplicazioni
 * non autorizzate e preserviamo i documenti originali.
 */
const officialIssues: MagazineIssue[] = [
  {
    id: "caccia-e-natura-1-2026",
    magazine: "Caccia e Natura",
    edition: "N. 1 · 2026",
    file: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/07/Caccia-e-Natura-N1-2026.pdf",
    cover: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/07/cover-caccia-e-natura-numero-1-2026.jpg",
    source: "https://www.enalcaccianazionale.it/caccia-e-natura/nr-1-2026/",
  },
  {
    id: "caccia-e-natura-3-2025",
    magazine: "Caccia e Natura",
    edition: "N. 3 · 2025",
    file: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/01/37310-Caccia-e-Natura-N.-3-2025-1.pdf",
    cover: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/01/caccia-e-natura-3-gennaio-2026.jpg",
    source: "https://www.enalcaccianazionale.it/caccia-e-natura/nr-3-2025/",
  },
  {
    id: "caccia-e-natura-2-2025",
    magazine: "Caccia e Natura",
    edition: "N. 2 · 2025",
    file: "https://www.enalcaccianazionale.it/wp-content/uploads/2025/08/caccia-e-natura-n2-2025.pdf",
    cover: "https://www.enalcaccianazionale.it/wp-content/uploads/2025/08/caccia-natura-2-2025.jpg",
    source: "https://www.enalcaccianazionale.it/caccia-e-natura/nr-2-2025/",
  },
  {
    id: "caccia-e-natura-1-2025",
    magazine: "Caccia e Natura",
    edition: "N. 1 · 2025",
    file: "https://www.enalcaccianazionale.it/wp-content/uploads/2025/05/rivista-caccia-e-natura-n-1-2025.pdf",
    cover: "https://www.enalcaccianazionale.it/wp-content/uploads/2025/05/cover-caccia-e-natura-2025-1.jpg",
    source: "https://www.enalcaccianazionale.it/caccia-e-natura/nr-1-2025/",
  },
  {
    id: "caccia-e-natura-3-2024",
    magazine: "Caccia e Natura",
    edition: "N. 3 · 2024",
    file: "https://www.enalcaccianazionale.it/wp-content/uploads/2025/03/caccia-e-natura-n-3-2024.pdf",
    cover: "https://www.enalcaccianazionale.it/wp-content/uploads/2025/03/caccia-e-natura-2024-3.jpg",
    source: "https://www.enalcaccianazionale.it/caccia-e-natura/nr-3-2024/",
  },
  {
    id: "il-beccaccino-10-2026",
    magazine: "Il Beccaccino",
    edition: "N. 10 · 2026",
    file: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/09/Notiziario-Il-Beccaccino-n.-10-2026-Apertura-2026.pdf",
    cover: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/09/Cover-Magazine-beccaccino-10.jpg",
    source: "https://www.enalcaccianazionale.it/il-beccaccino/il-beccaccino-nr-10-2026/",
  },
  {
    id: "il-beccaccino-9-2026",
    magazine: "Il Beccaccino",
    edition: "N. 9 · 2026",
    file: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/07/IL-BECCACCINO-n.-9-2026_09.07.2026.pdf",
    cover: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/07/Cover-Magazine.jpg",
    source: "https://www.enalcaccianazionale.it/il-beccaccino/il-beccaccino-nr-9-2026/",
  },
  {
    id: "il-beccaccino-8-2026",
    magazine: "Il Beccaccino",
    edition: "N. 8 · 2026",
    file: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/06/Beccaccino-N.-8-2026-1.pdf",
    cover: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/06/Cover-Magazine.jpg",
    source: "https://www.enalcaccianazionale.it/il-beccaccino/il-beccaccino-nr-8-2026/",
  },
  {
    id: "il-beccaccino-7-2026",
    magazine: "Il Beccaccino",
    edition: "N. 7 · 2026",
    file: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/05/Il-Beccaccino-n.7-2026.pdf",
    cover: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/05/il-beccacciono-n-7-enal-caccia.jpg",
    source: "https://www.enalcaccianazionale.it/il-beccaccino/il-beccaccino-nr-7-2026/",
  },
  {
    id: "il-beccaccino-6-2026",
    magazine: "Il Beccaccino",
    edition: "N. 6 · 2026",
    file: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/05/Beccaccino_n_6_del_9_5_2026.pdf",
    cover: "https://www.enalcaccianazionale.it/wp-content/uploads/2026/05/Cover-Magazine.jpg",
    source: "https://www.enalcaccianazionale.it/il-beccaccino/il-beccaccino/nr-6-2026/",
  },
];

function IssueCard({ issue, onPreview }: { issue: MagazineIssue; onPreview: (issue: MagazineIssue) => void }) {
  return (
    <Card className="h-full overflow-hidden border-forest/15 transition-shadow hover:shadow-lg">
      <div className="flex h-64 items-center justify-center border-b border-border/60 bg-gray-50 p-3 sm:h-72">
        <img
          src={issue.cover}
          alt={`Copertina di ${issue.magazine} ${issue.edition}`}
          className="max-h-full max-w-full object-contain drop-shadow-md"
          loading="lazy"
        />
      </div>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{issue.edition}</Badge>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardTitle className="font-serif text-xl">{issue.magazine}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Edizione ufficiale in formato PDF, pubblicata da Enalcaccia Nazionale.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => onPreview(issue)}>
            <Eye className="mr-2 h-4 w-4" />
            Sfoglia
          </Button>
          <Button size="sm" asChild>
            <a href={issue.file} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Apri PDF
            </a>
          </Button>
        </div>
        <a
          href={issue.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-forest underline underline-offset-2"
        >
          Pagina ufficiale del numero
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}

export function MagazineSection({
  title = "Magazine",
  initialTab = "caccia-e-natura",
}: {
  title?: string;
  initialTab?: MagazineTab;
}) {
  const [previewIssue, setPreviewIssue] = useState<MagazineIssue | null>(null);
  const [activeTab, setActiveTab] = useState<MagazineTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const cacciaENatura = officialIssues.filter((issue) => issue.magazine === "Caccia e Natura");
  const ilBeccaccino = officialIssues.filter((issue) => issue.magazine === "Il Beccaccino");

  return (
    <Card className="mb-10 border-forest/20">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-muted-foreground">
          Le cinque edizioni più recenti disponibili per ciascuna rivista nell'archivio
          di Enalcaccia Nazionale, consultabili tramite i PDF originali.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MagazineTab)}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="caccia-e-natura">Caccia e Natura (5)</TabsTrigger>
            <TabsTrigger value="il-beccaccino">Il Beccaccino (5)</TabsTrigger>
          </TabsList>
          <TabsContent value="caccia-e-natura" className="mt-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cacciaENatura.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onPreview={setPreviewIssue} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="il-beccaccino" className="mt-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ilBeccaccino.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onPreview={setPreviewIssue} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        <p className="text-xs text-muted-foreground">
          Fonte: Enalcaccia Nazionale. Le riviste e le copertine restano ospitate sul
          sito nazionale. Per salvare un numero, apri il PDF e utilizza il comando
          di download del browser.
        </p>

        <Dialog open={!!previewIssue} onOpenChange={(open) => { if (!open) setPreviewIssue(null); }}>
          <DialogContent className="flex h-[85dvh] max-w-5xl flex-col gap-3">
            <DialogHeader>
              <DialogTitle>
                {previewIssue?.magazine} — {previewIssue?.edition}
              </DialogTitle>
            </DialogHeader>
            {previewIssue && (
              <div className="min-h-0 flex-1">
                <iframe
                  src={`${previewIssue.file}#toolbar=1&navpanes=0`}
                  title={`PDF ${previewIssue.magazine} ${previewIssue.edition}`}
                  className="h-full w-full rounded-md border"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
