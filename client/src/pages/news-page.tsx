import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { News } from "@shared/schema";

export default function NewsPage() {
  const { slug } = useParams();
  
  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: article, isLoading: isLoadingArticle } = useQuery<News>({
    queryKey: [`/api/news/${slug}`],
    enabled: !!slug,
  });

  if (slug) {
    // Single article view
    if (isLoadingArticle) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    if (!article) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Articolo non trovato</h1>
              <Link href="/news">
                <Button>Torna alle notizie</Button>
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link href="/news">
              <Button variant="outline" size="sm">
                <i className="fas fa-arrow-left mr-2"></i>
                Torna alle notizie
              </Button>
            </Link>
          </div>

          <header className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-neutral mb-4">
              {article.title}
            </h1>
            <div className="flex items-center text-gray-600 mb-6">
              <i className="far fa-calendar mr-2"></i>
              <span>{new Date(article.publishedAt).toLocaleDateString('it-IT')}</span>
            </div>
            {article.featuredImage && (
              <img 
                src={article.featuredImage} 
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
              />
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {article.content}
            </div>
          </div>
        </article>
        <Footer />
      </div>
    );
  }

  // News list view
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-neutral mb-4">Notizie</h1>
          <p className="text-xl text-gray-600">Rimani aggiornato sulle attività di Enal Caccia</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-newspaper text-gray-400 text-6xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessuna notizia disponibile</h3>
            <p className="text-gray-600">Le notizie verranno pubblicate qui non appena disponibili.</p>
          </div>
        ) : (
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
                <CardHeader>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <i className="far fa-calendar mr-2"></i>
                    <span>{new Date(article.publishedAt).toLocaleDateString('it-IT')}</span>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    <Link href={`/news/${article.slug}`}>
                      {article.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <Link href={`/news/${article.slug}`} className="text-primary hover:text-accent font-semibold">
                    Leggi tutto →
                  </Link>
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
