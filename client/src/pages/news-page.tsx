import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function NewsPage() {
  const [match, params] = useRoute("/news/:slug");
  
  const { data: news = [] } = useQuery({
    queryKey: ["/api/news"]
  });

  const { data: article } = useQuery({
    queryKey: [`/api/news/${params?.slug}`],
    enabled: !!params?.slug
  });

  if (match && params?.slug) {
    // Individual article view
    if (!article) {
      return (
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Articolo non trovato</h1>
              <Button asChild>
                <Link href="/news">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Torna alle News
                </Link>
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alle News
            </Link>
          </Button>

          <article className="prose prose-lg max-w-none">
            <div className="mb-8">
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Clock className="mr-2 h-4 w-4" />
                <span>{new Date(article.publishedAt).toLocaleDateString('it-IT')}</span>
                <span className="mx-2">•</span>
                <Badge variant="secondary">{article.category}</Badge>
              </div>
              <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
              {article.excerpt && (
                <p className="text-xl text-muted-foreground mb-8">{article.excerpt}</p>
              )}
            </div>
            
            <div 
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
            />
          </article>
        </div>
        <Footer />
      </div>
    );
  }

  // News list view
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Notizie e Aggiornamenti</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rimani sempre aggiornato sulle attività di Enal Caccia, le novità del settore venatorio e gli eventi in programma.
          </p>
        </div>

        {news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Nessuna notizia disponibile al momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article: any) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{new Date(article.publishedAt).toLocaleDateString('it-IT')}</span>
                    <span className="mx-2">•</span>
                    <Badge variant="secondary">{article.category}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">
                    <Link href={`/news/${article.slug}`} className="hover:text-primary">
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/news/${article.slug}`}>
                      Leggi tutto
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
