import { useState, useEffect } from "react";
import { useListBanners } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSlider() {
  const { data: banners, isLoading } = useListBanners();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeBanners = banners?.filter(b => b.isActive).sort((a, b) => a.order - b.order) || [];

  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused]);

  if (isLoading) {
    return <div className="w-full h-[600px] bg-muted animate-pulse" />;
  }

  if (activeBanners.length === 0) {
    return (
      <div className="w-full h-[600px] bg-slate-900 relative flex items-center justify-center">
        <img 
          src="/images/hero-banner.png" 
          alt="Al-Beruni University" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center text-white p-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Al-Beruni University</h1>
          <p className="text-xl md:text-2xl text-slate-200">Shaping the future through excellence in education and research.</p>
        </div>
      </div>
    );
  }

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);

  return (
    <div 
      className="relative w-full h-[500px] md:h-[700px] overflow-hidden bg-slate-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={activeBanners[currentIndex].imageUrl}
            alt={activeBanners[currentIndex].title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <div className="max-w-4xl">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold text-white mb-4"
              >
                {activeBanners[currentIndex].title}
              </motion.h1>
              {activeBanners[currentIndex].subtitle && (
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-xl md:text-2xl text-slate-200 mb-8"
                >
                  {activeBanners[currentIndex].subtitle}
                </motion.p>
              )}
              {activeBanners[currentIndex].linkUrl && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <Button asChild size="lg" className="text-lg px-8">
                    <a href={activeBanners[currentIndex].linkUrl}>Learn More</a>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            data-testid="button-slider-prev"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            data-testid="button-slider-next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === currentIndex ? "bg-white" : "bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
