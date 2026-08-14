import { useParams, Link } from "wouter";
import { useGetNewsArticle, getGetNewsArticleQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { ArrowLeft, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const articleId = Number(id);

  const { data: article, isLoading } = useGetNewsArticle(articleId, {
    query: {
      enabled: !!articleId,
      queryKey: getGetNewsArticleQueryKey(articleId),
    },
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-80 w-full rounded-xl mb-8" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-muted-foreground mb-4">
            Maqola topilmadi
          </p>
          <Button asChild>
            <Link href="/news">Yangiliklarga qaytish</Link>
          </Button>
        </div>
      </main>
    );
  }

  const additionalImages = Array.isArray(article.images)
    ? article.images.filter(
        (url) =>
          typeof url === "string" &&
          url.trim() !== "" &&
          url !== article.imageUrl
      )
    : [];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl">

        <Button
          asChild
          variant="ghost"
          className="mb-8 -ml-2"
          data-testid="button-back"
        >
          <Link href="/news" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Barcha yangiliklar
          </Link>
        </Button>

        <div className="mb-4">
          <Badge
            className="uppercase tracking-wider"
            data-testid="text-category"
          >
            {article.category}
          </Badge>
        </div>

        <h1
          className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight"
          data-testid="text-article-title"
        >
          {article.title}
        </h1>

        <div className="flex items-center gap-3 text-muted-foreground mb-10 pb-10 border-b">
          <Calendar className="h-4 w-4" />
          <time data-testid="text-published-date">
            {format(new Date(article.publishedAt), "d MMMM, yyyy")}
          </time>
        </div>

        {/* ASOSIY RASM — ORIGINAL NISBAT SAQLANADI */}
        {article.imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto block"
              data-testid="img-article"
            />
          </div>
        )}

        {/* QO'SHIMCHA RASMLAR — ORIGINAL NISBAT SAQLANADI */}
        {additionalImages.length > 0 && (
          <div className="space-y-6 mb-10">
            {additionalImages.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="rounded-2xl overflow-hidden"
              >
                <img
                  src={imageUrl}
                  alt={`${article.title} — ${index + 2}`}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        <div
          className="prose prose-lg dark:prose-invert max-w-none text-foreground"
          data-testid="text-article-content"
        >
          {article.content.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t">
          <Button asChild variant="outline">
            <Link href="/news" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Boshqa yangiliklar
            </Link>
          </Button>
        </div>

      </div>
    </main>
  );
}
