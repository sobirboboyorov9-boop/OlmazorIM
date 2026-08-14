import { useEffect, useMemo, useState } from "react";
import { useListGallery } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function GallerySection() {
  const { data: gallery, isLoading } = useListGallery();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const images = useMemo(() => {
    if (!gallery) return [];
    return gallery.filter(
      (image) =>
        typeof image.imageUrl === "string" &&
        image.imageUrl.trim() !== "",
    );
  }, [gallery]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? null : (current + 1) % images.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null
            ? null
            : (current - 1 + images.length) % images.length,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, images.length]);

  if (isLoading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="h-10 w-64 bg-muted rounded mb-12 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) return null;

  /*
   * Bir nechta nusxa yaratamiz.
   *
   * Natijada oxirgi rasmga yetganda carousel boshiga
   * sakramaydi. Birinchi blokning aynan nusxasi davom etadi.
   */
  const duplicatedImages = [...images, ...images, ...images];

  const openImage = (index: number) => {
    setSelectedIndex(index % images.length);
  };

  return (
    <>
      <section
        id="achievements"
        className="py-24 bg-background overflow-hidden"
      >
        <div className="container mx-auto px-4 md:px-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Maktab hayotidan
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl">
            O'quvchilarimiz, tadbirlar va maktabimiz muhitidan lavhalar
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* Chap va o'ng tomonda yumshoq fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 md:w-40 z-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 md:w-40 z-20 bg-gradient-to-l from-background to-transparent" />

          <motion.div
            className="flex w-max gap-4 md:gap-5"
            animate={{
              x: ["0%", "-33.3333%"],
            }}
            transition={{
              x: {
                duration: Math.max(45, images.length * 7),
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {duplicatedImages.map((image, index) => (
              <div
                key={`${image.id}-${index}`}
                className="w-[190px] sm:w-[220px] md:w-[250px] lg:w-[280px] flex-shrink-0"
              >
                <div
                  className="columns-1 space-y-4"
                >
                  <motion.button
                    type="button"
                    onClick={() => openImage(index)}
                    whileHover={{ scale: 1.025 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative block w-full overflow-hidden rounded-2xl bg-muted cursor-pointer group text-left"
                  >
                    <img
                      src={image.imageUrl}
                      alt={
                        image.caption ||
                        `Galereya rasmi ${(index % images.length) + 1}`
                      }
                      className="w-full h-auto object-contain block transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

                    {image.caption && (
                      <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-medium">
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {selectedIndex !== null && images[selectedIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedIndex(null);
            }
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-5 right-5 z-20 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Yopish"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedIndex(
                (selectedIndex - 1 + images.length) % images.length,
              )
            }
            className="absolute left-4 md:left-8 z-20 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Oldingi rasm"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          >
            <img
              src={images[selectedIndex].imageUrl}
              alt={
                images[selectedIndex].caption ||
                `Galereya rasmi ${selectedIndex + 1}`
              }
              className="max-w-[90vw] max-h-[88vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
            />
          </motion.div>

          <button
            type="button"
            onClick={() =>
              setSelectedIndex((selectedIndex + 1) % images.length)
            }
            className="absolute right-4 md:right-8 z-20 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Keyingi rasm"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          {images[selectedIndex].caption && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 max-w-[80vw] text-center text-white/90 text-sm md:text-base">
              {images[selectedIndex].caption}
            </div>
          )}

          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
