import { useListGallery } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export function GallerySection() {
  const { data: gallery, isLoading } = useListGallery();

  if (isLoading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="h-10 w-64 bg-muted rounded mb-12 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Galereya</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Universitetimiz hayotidan lavhalar
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.slice(0, 8).map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-secondary group cursor-pointer ${
                index === 0 ? "row-span-2 col-span-2" : ""
              }`}
              style={{ aspectRatio: index === 0 ? "1" : "1" }}
              data-testid={`img-gallery-${image.id}`}
            >
              <img
                src={image.imageUrl}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20" />
              {image.caption && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
