import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink, Eye } from "lucide-react";

type MagazineIssue = {
  id: string;
  magazine: "Caccia e Natura" | "Il Beccaccino";
  monthLabel: string;
  file: string;
  cover: string;
  note: string;
};

function IssueCard({ issue, onPreview }: { issue: MagazineIssue; onPreview: (issue: MagazineIssue) => void }) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-muted overflow-hidden rounded-t-lg">
        <img src={issue.cover} alt={`${issue.magazine} ${issue.monthLabel}`} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{issue.monthLabel}</Badge>
          <FileText className="w-4 h-4 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl">{issue.magazine}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{issue.note}</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => onPreview(issue)}>
            <Eye className="w-4 h-4 mr-2" />
            Anteprima
          </Button>
          <Button size="sm" asChild>
            <a href={issue.file} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Leggi online
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={issue.file} download>
              <Download className="w-4 h-4 mr-2" />
              Scarica PDF
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type MagazineTab = "caccia-e-natura" | "il-beccaccino";

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

  const { data: magazineIssues = [] } = useQuery<MagazineIssue[]>({
    queryKey: ["/api/magazines"],
  });

  const grouped = useMemo(
    () => ({
      cacciaENatura: magazineIssues.filter((issue) => issue.magazine === "Caccia e Natura"),
      ilBeccaccino: magazineIssues.filter((issue) => issue.magazine === "Il Beccaccino"),
    }),
    [magazineIssues]
  );

  return (
    <Card className="mb-10 border-forest/20">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-muted-foreground">
          Archivio mensile dei periodici associativi in PDF: <strong>Caccia e Natura</strong> e <strong>Il Beccaccino</strong>.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MagazineTab)} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="caccia-e-natura">Caccia e Natura</TabsTrigger>
            <TabsTrigger value="il-beccaccino">Il Beccaccino</TabsTrigger>
          </TabsList>

          <TabsContent value="caccia-e-natura" className="mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {grouped.cacciaENatura.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onPreview={setPreviewIssue} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="il-beccaccino" className="mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {grouped.ilBeccaccino.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onPreview={setPreviewIssue} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Accordion type="single" collapsible>
          <AccordionItem value="archive-info">
            <AccordionTrigger>Come funziona l'archivio mensile</AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>Ogni mese vengono pubblicati due nuovi PDF, uno per ciascun magazine.</p>
              <p>Puoi visualizzare l'anteprima nel sito, leggere online in nuova scheda o scaricare il file.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Dialog open={!!previewIssue} onOpenChange={() => setPreviewIssue(null)}>
          <DialogContent className="max-w-4xl h-[85vh]">
            <DialogHeader>
              <DialogTitle>
                {previewIssue?.magazine} - {previewIssue?.monthLabel}
              </DialogTitle>
            </DialogHeader>
            {previewIssue && (
              <iframe
                src={`${previewIssue.file}#toolbar=1&navpanes=0`}
                title={`${previewIssue.magazine} ${previewIssue.monthLabel}`}
                className="w-full h-full border rounded-md"
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
