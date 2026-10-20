import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";
import { Calendar, ArrowLeft } from "lucide-react";
import type { News } from "@shared/schema";
import { ArticleRichContent } from "@/components/article-rich-content";

const originalSources: Record<string, string> = {
  "le-associazioni-venatorie-scrivono-al-presidente-mattarella-rispetto-e-dignita-per-il-mondo-rurale": "https://www.riservaalpinapederobba.it/2026/08/04/le-associazioni-venatorie-scrivono-al-presidente-mattarella-rispetto-e-dignita-per-il-mondo-rurale/",
  "1-trofeo-pedemontana-del-grappa-grande-successo-per-la-prova-nazionale-enci": "https://www.riservaalpinapederobba.it/2026/04/21/1-trofeo-pedemontana-del-grappa-grande-successo-per-la-prova-nazionale-enci/",
  "autoconsumo-carni-di-cinghiale-quali-tesserini-non-valgono-piu": "https://www.riservaalpinapederobba.it/2026/02/03/autoconsumo-carni-di-cinghiale-quali-tesserini-non-valgono-piu/",
  "peste-suina-africana-psa": "https://www.riservaalpinapederobba.it/2026/01/22/peste-suina-africana-psa/",
  "lo-sapevate-che": "https://www.riservaalpinapederobba.it/2026/01/09/lo-sapevate-che/",
  "appostamenti-di-caccia-le-norme-aggiornate-in-veneto": "https://www.riservaalpinapederobba.it/2025/10/17/appostamenti-di-caccia-le-norme-aggiornate-in-veneto/",
};

export default function NewsDetailPage() {
  const [match, params] = useRoute<{ slug: string }>("/news/:slug");
  const slug = match ? params.slug : "";

  const { data: article, isLoading, isError } = useQuery<News>({
    queryKey: [`/api/news/${slug}`],
    enabled: Boolean(slug),
  });

  const pageUrl = slug ? `https://www.enalcacciatv.it/news/${slug}` : "https://www.enalcacciatv.it/news";
  const pageTitle = article?.title || "Dettaglio Notizia";
  const pageDescription = article?.excerpt || "Approfondimento su notizie e comunicati di ENAL Caccia Treviso.";
  const pageImage = article?.featuredImage || "/attached_assets/enalcaccia-associazione-venatoria.png";
  const articleStructuredData = article
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": article.title,
        "description": article.excerpt,
        "image": [
          pageImage.startsWith("http")
            ? pageImage
            : `https://www.enalcacciatv.it${pageImage.startsWith("/") ? pageImage : `/${pageImage}`}`,
        ],
        "datePublished": article.createdAt ? new Date(article.createdAt).toISOString() : undefined,
        "dateModified": (article.updatedAt || article.createdAt)
          ? new Date(article.updatedAt || article.createdAt as Date).toISOString()
          : undefined,
        "mainEntityOfPage": pageUrl,
        "author": {
          "@type": "Organization",
          "name": "ENAL Caccia Treviso",
        },
        "publisher": {
          "@type": "Organization",
          "name": "ENAL Caccia Treviso",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.enalcacciatv.it/attached_assets/logo-enalcaccia-treviso.png?v=20260307",
          },
        },
      }
    : undefined;

  if (isLoading) {
    return (
      <div className="page-shell">
        <SEOHead title={pageTitle} description={pageDescription} type="article" url={pageUrl} image={pageImage} structuredData={articleStructuredData} />
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
        <SEOHead title="Notizia non trovata" description="La notizia richiesta non e disponibile." url={pageUrl} />
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
  const isEnalcacciaPoster = article.featuredImage?.includes("/wp-content/uploads/2026/10/") ?? false;

  return (
    <div className="page-shell">
      <SEOHead title={pageTitle} description={pageDescription} type="article" url={pageUrl} image={pageImage} structuredData={articleStructuredData} />
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
            <div className={isEnalcacciaPoster ? "mb-6 flex justify-center rounded-lg bg-white p-5" : "aspect-video bg-muted overflow-hidden rounded-lg mb-6"}>
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
                  className={isEnalcacciaPoster ? "block max-h-[75vh] w-auto max-w-full object-contain" : "w-full h-full object-cover"}
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
            <ArticleRichContent content={article.content} />
          </div>
          {originalSources[article.slug] && (
            <p className="mt-9 border-t border-border pt-5 text-sm text-muted-foreground">
              Fonte:{" "}
              <a
                href={originalSources[article.slug]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest underline underline-offset-2"
              >
                Riserva Alpina di Pederobba — articolo originale
              </a>
            </p>
          )}
        </article>
      </div>
    </div>
  );
}