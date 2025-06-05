import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Link, useParams } from "wouter";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { News } from "@shared/schema";

export default function NewsPage() {
  const { slug } = useParams<{ slug?: string }>();

  const { data: news = [] } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: article } = useQuery<News>({
    queryKey: [`/api/news/${slug}`],
    enabled: !!slug,
  });

  // If viewing a specific article
  if (slug && article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/news">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alle news
            </Button>
          </Link>

          <article>
            {article.featuredImage && (
              <img 
                src={article.featuredImage} 
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div className="mb-6">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('it-IT') : ''}</span>
                <span className="mx-2">•</span>
                <Badge variant="secondary">{article.category}</Badge>
              </div>
              
              <h1 className="text-4xl font-serif font-bold text-neutral-800 mb-4">
                {article.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {article.excerpt}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
            </div>
          </article>
        </div>

        <Footer />
      </div>
    );
  }

  // News listing page
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-neutral-800 mb-4">
            Tutte le Notizie
          </h1>
          <p className="text-lg text-gray-600">
            Rimani aggiornato sulle attività di Enal Caccia
          </p>
        </div>

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
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('it-IT') : ''}</span>
                  <span className="mx-2">•</span>
                  <Badge variant="secondary">{article.category}</Badge>
                </div>
                <CardTitle className="text-xl hover:text-primary">
                  <Link href={`/news/${article.slug}`}>
                    {article.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <Link href={`/news/${article.slug}`}>
                  <Button variant="outline" size="sm">
                    Leggi tutto →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nessuna notizia disponibile al momento.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
