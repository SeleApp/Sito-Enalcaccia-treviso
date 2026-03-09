import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft } from "lucide-react";
import type { News } from "@shared/schema";

export default function NewsDetailPage() {
  const [match, params] = useRoute<{ slug: string }>("/news/:slug");
  const slug = match ? params.slug : "";

  const { data: article, isLoading, isError } = useQuery<News>({
    queryKey: [`/api/news/${slug}`],
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="page-wrap max-w-4xl">
          <Card className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-8 bg-muted rounded w-2/3 mb-4" />
              <div className="h-4 bg-muted rounded w-1/3 mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="page-shell">
        <div className="page-wrap max-w-4xl">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold mb-2">Articolo non trovato</h1>
              <p className="text-muted-foreground mb-6">L'articolo richiesto non è disponibile o non è più pubblicato.</p>
              <Link href="/news">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Torna alle notizie
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isPdfAsset = (assetPath: string) => assetPath.toLowerCase().endsWith(".pdf");

  return (
    <div className="page-shell">
      <div className="page-wrap max-w-4xl">
        <div className="mb-6">
          <Link href="/news">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alle notizie
            </Button>
          </Link>
        </div>

        <article>
          {article.featuredImage && (
            <div className="aspect-video bg-muted overflow-hidden rounded-lg mb-6">
              {isPdfAsset(article.featuredImage) ? (
                <iframe
                  src={`${article.featuredImage}#toolbar=1&navpanes=0`}
                  title={`Locandina ${article.title}`}
                  className="w-full h-full border-0"
                />
              ) : (
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{article.category}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString("it-IT") : "-"}</span>
            </div>
          </div>

          <h1 className="page-title">
            {article.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-8">{article.excerpt}</p>

          <div className="prose prose-neutral max-w-none">
            <p className="whitespace-pre-line text-foreground leading-8">{article.content}</p>
          </div>
        </article>
      </div>
    </div>
  );
}