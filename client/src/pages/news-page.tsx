import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Calendar, Search, Tag } from "lucide-react";
import type { News } from "@shared/schema";

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news?v=20260307"],
    staleTime: 0,
    refetchOnMount: "always",
  });

  const publishedNews = news.filter((article) => article.published);
  const sortedNews = [...publishedNews].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

  // Get unique categories
  const categories = Array.from(new Set(sortedNews.map(article => article.category)));
  
  // Filter news based on search and category
  const filteredNews = sortedNews.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const newsFallbacks = [
    "/attached_assets/enalcaccia-associazione-venatoria.png",
    "/attached_assets/enalcaccia-cinofilia.jpg",
    "/attached_assets/enalcaccia-estero.jpg",
    "/attached_assets/cane-caccia-1.jpg",
    "/attached_assets/cane-caccia-2.jpg",
  ];

  const getNewsImage = (article: News, index: number) => {
    if (article.featuredImage) return article.featuredImage;
    return newsFallbacks[index % newsFallbacks.length];
  };

  const isPdfAsset = (assetPath: string) => assetPath.toLowerCase().endsWith(".pdf");

  return (
    <div className="page-shell">{/* Layout now handles min-h-screen */}
      <div className="page-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Notizie</h1>
          <p className="page-subtitle max-w-2xl">
            Rimani aggiornato sulle ultime novità del mondo venatorio e delle attività di Enal Caccia
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cerca negli articoli..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le categorie</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredNews.length} {filteredNews.length === 1 ? 'articolo trovato' : 'articoli trovati'}
          </p>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-6 bg-muted rounded w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nessun articolo trovato
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedCategory !== "all" 
                    ? "Prova a modificare i filtri di ricerca"
                    : "Non ci sono articoli disponibili al momento"
                  }
                </p>
                {(searchTerm || selectedCategory !== "all") && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                  >
                    Rimuovi filtri
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article, index) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                  {isPdfAsset(getNewsImage(article, index)) ? (
                    <iframe
                      src={`${getNewsImage(article, index)}#toolbar=0&navpanes=0&scrollbar=0`}
                      title={`Locandina ${article.title}`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={getNewsImage(article, index)}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString('it-IT') : '-'}</span>
                    </div>
                    <Badge variant="secondary">{article.category}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                    <Link href={`/news/${article.slug}`}>
                      {article.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {article.excerpt?.trim() || `${article.content.slice(0, 180)}...`}
                  </p>
                  <Link href={`/news/${article.slug}`}>
                    <Button variant="link" className="p-0 h-auto">Leggi articolo →</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredNews.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm">
              Hai visualizzato tutti gli articoli disponibili
            </p>
          </div>
        )}
      </div>

      
    </div>
  );
}
