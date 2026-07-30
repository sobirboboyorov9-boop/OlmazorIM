import { Link } from "wouter";
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube, Send } from "lucide-react";
import { useGetContacts } from "@workspace/api-client-react";

export function Footer() {
  const { data: contacts } = useGetContacts();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/emblema.jpg"
                alt="Olmazor tumani ixtisoslashtirilgan maktabi"
                className="w-10 h-10 rounded-xl object-cover bg-white p-1"
              />

              <div>
                <p className="font-bold text-base leading-tight">
                  Olmazor ixtisoslashtirilgan maktabi
                </p>
                <p className="text-primary-foreground/70 text-xs">
                  Toshkent shahri
                </p>
              </div>
            </div>

            <p className="text-primary-foreground/80 text-sm">
              Bilimli, ijodkor va vatanparvar avlodni tarbiyalash — bizning asosiy
              maqsadimiz.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Tezkor havolalar</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  Maktab haqida
                </Link>
              </li>
              <li>
                <Link href="/#education" className="hover:text-white transition-colors">
                  Ta'lim
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  Yangiliklar
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Bog'lanish
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Admin panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Aloqa</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{contacts?.address || "Toshkent sh., Olmazor tumani"}</span>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{contacts?.phone || "+998 71 123-45-67"}</span>
              </li>

              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{contacts?.email || "info@olmazor-maktab.uz"}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Ijtimoiy tarmoqlar</h3>

            <div className="flex gap-4">
              <a
                href={contacts?.facebook || "#"}
                target="_blank"
                rel="noreferrer"
                className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>

              <a
                href={contacts?.telegram || "#"}
                target="_blank"
                rel="noreferrer"
                className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                <Send className="h-5 w-5" />
              </a>

              <a
                href={contacts?.instagram || "#"}
                target="_blank"
                rel="noreferrer"
                className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>

              <a
                href={contacts?.youtube || "#"}
                target="_blank"
                rel="noreferrer"
                className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} Olmazor ixtisoslashtirilgan
            maktabi. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
}