import { useGetContacts } from "@workspace/api-client-react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function ContactStrip() {
  const { data: contacts } = useGetContacts();

  const items = [
    {
      icon: MapPin,
      label: "Manzil",
      value: contacts?.address || "Toshkent sh., Olmazor tumani",
    },
    {
      icon: Phone,
      label: "Telefon",
      value: contacts?.phone || "+998 71 123-45-67",
    },
    {
      icon: Mail,
      label: "Email",
      value: contacts?.email || "info@olmazor-maktab.uz",
    },
    {
      icon: Clock,
      label: "Ish vaqti",
      value: contacts?.workingHours || "Du-Sha: 8:00 - 17:00",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Biz bilan bog'laning</h2>
          <p className="text-muted-foreground text-lg">
            Savollaringiz bormi? Biz doim yordam berishga tayyormiz
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {items.map((item) => (
            <div
              key={item.label}
              className="bg-card border rounded-xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">{item.label}</p>
                <p className="font-semibold text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/contact">Batafsil ma'lumot</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
