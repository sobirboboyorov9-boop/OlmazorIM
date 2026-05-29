import { useGetHomepageContent } from "@workspace/api-client-react";
import { BookOpen, GraduationCap, Microscope } from "lucide-react";

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
                {content?.aboutTitle || "About Al-Beruni University"}
              </h2>
              <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed">
                <p>{content?.aboutBody || "Al-Beruni University is a premier institution dedicated to academic excellence, innovative research, and the holistic development of students."}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" /> 
                  Our Mission
                </h3>
                <p className="text-muted-foreground">{content?.missionText || "To provide world-class education and foster research that addresses global challenges."}</p>
              </div>
              
              {content?.visionText && (
                <div className="bg-secondary/50 p-6 rounded-xl border border-border">
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                    <Microscope className="h-6 w-6 text-primary" />
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground">{content.visionText}</p>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
              <img 
                src="/images/about/library.png" 
                alt="Students in university library" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/10" />
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-xl shadow-xl border max-w-xs hidden md:block">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-xl mb-1">Academic Excellence</div>
                  <p className="text-sm text-muted-foreground">Top-tier programs recognized globally for rigorous standards.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
