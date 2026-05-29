import { useGetFeaturedNews } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedNews() {
  const { data: news, isLoading } = useGetFeaturedNews();

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="h-10 w-64 bg-muted rounded mb-12 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-lg overflow-hidden border shadow-sm animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-6 w-full bg-muted rounded" />
                  <div className="h-20 w-full bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!news || news.length === 0) return null;

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Latest University News</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Stay updated with academic achievements, research breakthroughs, and campus life at Al-Beruni University.
            </p>
          </div>
          <Button asChild variant="outline" className="group">
            <Link href="/news" className="flex items-center gap-2">
              View All News
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.slice(0, 3).map((article) => (
            <Link key={article.id} href={`/news/${article.id}`}>
              <div className="bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col group cursor-pointer">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={article.imageUrl || "/images/news/news-1.png"} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={article.publishedAt}>
                      {format(new Date(article.publishedAt), "MMMM d, yyyy")}
                    </time>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="text-primary font-medium flex items-center gap-2 mt-auto">
                    Read Article <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
