import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import {
  useGetNewsArticle,
  getGetNewsArticleQueryKey,
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { ArrowLeft, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const articleId = Number(id);

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const { data: article, isLoading } = useGetNewsArticle(articleId, {
    query: {
      enabled: !!articleId,
      queryKey: getGetNewsArticleQueryKey(articleId),
    },
  });

  const allImages =
    article
      ? [
          ...(article.imageUrl ? [article.imageUrl] : []),
          ...(Array.isArray(article.images) ? article.images : []),
        ].filter(
          (url, index, array) =>
            typeof url === "string" &&
            url.trim() !== "" &&
            array.indexOf(url) === index,
        )
      : [];

  useEffect(() => {
    if (selectedImage === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedImage((current) =>
          current === null ? null : (current + 1) % allImages.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedImage((current) =>
          current === null
            ? null
            : (current - 1 + allImages.length) % allImages.length,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedImage, allImages.length]);

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

  return (
    <>
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

          {/* ASOSIY RASM */}
          {article.imageUrl && (
            <div className="flex justify-center mb-10">
              <button
                type="button"
                onClick={() => setSelectedImage(0)}
                className="group relative max-w-3xl w-full rounded-2xl overflow-hidden cursor-zoom-in bg-muted/20"
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-auto max-h-[650px] object-contain block mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                  data-testid="img-article"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </button>
            </div>
          )}

          {/* MATN */}
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

          {/* QO'SHIMCHA RASMLAR */}
          {Array.isArray(article.images) &&
            article.images.filter(
              (url) =>
                typeof url === "string" &&
                url.trim() !== "" &&
                url !== article.imageUrl,
            ).length > 0 && (
              <section className="mt-14 pt-10 border-t">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  Galereya
                </h2>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                  {article.images
                    .filter(
                      (url) =>
                        typeof url === "string" &&
                        url.trim() !== "" &&
                        url !== article.imageUrl,
                    )
                    .map((imageUrl, index) => {
                      const mainImageOffset = article.imageUrl ? 1 : 0;

                      return (
                        <motion.button
                          key={`${imageUrl}-${index}`}
                          type="button"
                          onClick={() =>
                            setSelectedImage(index + mainImageOffset)
                          }
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.35,
                            delay: Math.min(index * 0.04, 0.3),
                          }}
                          className="relative w-full mb-4 break-inside-avoid overflow-hidden rounded-xl bg-muted/20 cursor-zoom-in group"
                        >
                          <img
                            src={imageUrl}
                            alt={`${article.title} — rasm ${index + 1}`}
                            className="w-full h-auto block object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                            loading="lazy"
                          />

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </motion.button>
                      );
                    })}
                </div>
              </section>
            )}

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

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedImage !== null && allImages[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedImage(null);
              }
            }}
          >
            {/* CLOSE */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-5 right-5 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Yopish"
            >
              <X className="w-6 h-6" />
            </button>

            {/* PREVIOUS */}
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedImage(
                    (selectedImage - 1 + allImages.length) %
                      allImages.length,
                  )
                }
                className="absolute left-3 md:left-8 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Oldingi rasm"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* IMAGE */}
            <motion.img
              key={allImages[selectedImage]}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={allImages[selectedImage]}
              alt={article.title}
              className="max-w-[90vw] max-h-[88vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />

            {/* NEXT */}
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedImage((selectedImage + 1) % allImages.length)
                }
                className="absolute right-3 md:right-8 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Keyingi rasm"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}

            {/* COUNTER */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedImage + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
