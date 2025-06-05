import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { News } from "@shared/schema";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsPage() {
  const params = useParams();
  const isDetailView = !!params.slug;

  const { data: news = [], isLoading: newsLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: article, isLoading: articleLoading } = useQuery<News>({
    queryKey: ["/api/news", params.slug],
    enabled: isDetailView,
  });

  if (isDetailView) {
    if (articleLoading) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-1/2 mb-8" />
              <div className="h-64 bg-muted rounded mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    if (!article) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Articolo non trovato</h1>
            <Link href="/news">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna alle news
              </Button>
            </Link>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/news">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alle news
            </Button>
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">{article.category}</Badge>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(article.date).toLocaleDateString('it-IT')}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{article.title}</h1>
            <p className="text-xl text-muted-foreground">{article.excerpt}</p>
          </header>

          {article.featuredImage && (
            <div className="mb-8">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {article.content}
            </div>
          </div>
        </article>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Notizie e Aggiornamenti</h1>
          <p className="text-muted-foreground">
            Rimani aggiornato sulle ultime novità di Enal Caccia
          </p>
        </div>

        {newsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                  <div className="h-4 bg-muted rounded w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {article.featuredImage && (
                  <img 
                    src={article.featuredImage} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{article.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(article.date).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 hover:text-primary">
                    <Link href={`/news/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                  <Link href={`/news/${article.slug}`}>
                    <Button variant="ghost" className="text-primary p-0">
                      Leggi tutto →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Nessuna notizia disponibile</h3>
            <p className="text-muted-foreground">
              Al momento non ci sono notizie da visualizzare. Torna presto per gli aggiornamenti!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
