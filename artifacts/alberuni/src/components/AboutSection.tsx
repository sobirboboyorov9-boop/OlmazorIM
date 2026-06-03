import { useGetHomepageContent } from "@workspace/api-client-react";
import { BookOpen, Lightbulb, Award } from "lucide-react";

export function AboutSection() {
  const { data: content, isLoading } = useGetHomepageContent();

  if (isLoading) {
    return <div className="h-96 w-full bg-muted animate-pulse" />;
  }

  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                {content?.aboutTitle || "Olmazor ixtisoslashtirilgan maktabi haqida"}
              </h2>
              <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed">
                <p>{content?.aboutBody || "Olmazor ixtisoslashtirilgan maktabi — zamonaviy ta'lim texnologiyalari, yuqori malakali o'qituvchilar jamoasi va boy moddiy-texnik bazaga ega bo'lgan ilg'or o'quv muassasasi."}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Missiyamiz
                </h3>
                <p className="text-muted-foreground">{content?.missionText || "Har bir o'quvchining salohiyatini ro'yobga chiqarish, ularda mustaqil fikrlash va ijodkorlik ko'nikmalarini shakllantirish."}</p>
              </div>

              {content?.visionText && (
                <div className="bg-secondary/50 p-6 rounded-xl border border-border">
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-primary" />
                    Maqsadimiz
                  </h3>
                  <p className="text-muted-foreground">{content.visionText}</p>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative bg-gradient-to-br from-primary/10 to-primary/20">
              <img
                src="/images/about/library.png"
                alt="Olmazor maktabi o'quvchilari"
                className="w-full h-full object-cover"
                onError={e => (e.target as HTMLImageElement).style.display = "none"}
              />
              <div className="absolute inset-0 bg-primary/10" />
            </div>

            <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-xl shadow-xl border max-w-xs hidden md:block">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-xl mb-1">Sifatli ta'lim</div>
                  <p className="text-sm text-muted-foreground">Davlat standartlaridan yuqori darajada bilim berish.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
