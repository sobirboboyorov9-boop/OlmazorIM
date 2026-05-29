import { useGetContacts } from "@workspace/api-client-react";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Send } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactPage() {
  const { data: contacts, isLoading } = useGetContacts();

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bog'lanish</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Biz bilan bog'laning — savollaringizga javob berishdan mamnunmiz
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Aloqa ma'lumotlari</h2>

            {isLoading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Manzil</p>
                    <p className="font-medium" data-testid="text-address">{contacts?.address || "Nukus, Qoraqalpog'iston"}</p>
                    {contacts?.addressRu && (
                      <p className="text-sm text-muted-foreground mt-1">{contacts.addressRu}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Telefon</p>
                    <a
                      href={`tel:${contacts?.phone}`}
                      className="font-medium hover:text-primary transition-colors"
                      data-testid="link-phone"
                    >
                      {contacts?.phone || "+998 61 123-45-67"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Elektron pochta</p>
                    <a
                      href={`mailto:${contacts?.email}`}
                      className="font-medium hover:text-primary transition-colors"
                      data-testid="link-email"
                    >
                      {contacts?.email || "info@alberuni.uz"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Ish vaqti</p>
                    <p className="font-medium" data-testid="text-working-hours">
                      {contacts?.workingHours || "Du-Ju: 9:00 - 18:00"}
                    </p>
                  </div>
                </div>

                {/* Social links */}
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground font-medium mb-4">Ijtimoiy tarmoqlar</p>
                  <div className="flex gap-3">
                    {contacts?.facebook && (
                      <a
                        href={contacts.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                        data-testid="link-social-facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {contacts?.telegram && (
                      <a
                        href={contacts.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                        data-testid="link-social-telegram"
                      >
                        <Send className="h-5 w-5" />
                      </a>
                    )}
                    {contacts?.instagram && (
                      <a
                        href={contacts.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                        data-testid="link-social-instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {contacts?.youtube && (
                      <a
                        href={contacts.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                        data-testid="link-social-youtube"
                      >
                        <Youtube className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden border bg-muted h-[400px] lg:h-auto flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Xarita</p>
              <p className="text-sm mt-1">Nukus, Qoraqalpog'iston, O'zbekiston</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
