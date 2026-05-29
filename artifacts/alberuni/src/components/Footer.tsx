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
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-white flex items-center justify-center text-primary font-bold">
                AB
              </div>
              <span className="font-bold text-xl">Al-Beruni University</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Nurturing minds, advancing science, and building the future in Karakalpakstan since our founding.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/#about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/#faculties" className="hover:text-white transition-colors">Faculties</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">Latest News</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{contacts?.address || "Nukus, Karakalpakstan, Uzbekistan"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{contacts?.phone || "+998 61 123 4567"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{contacts?.email || "info@alberuni.uz"}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a href={contacts?.facebook || "#"} target="_blank" rel="noreferrer" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" data-testid="link-social-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={contacts?.telegram || "#"} target="_blank" rel="noreferrer" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" data-testid="link-social-telegram">
                <Send className="h-5 w-5" />
              </a>
              <a href={contacts?.instagram || "#"} target="_blank" rel="noreferrer" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" data-testid="link-social-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={contacts?.youtube || "#"} target="_blank" rel="noreferrer" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" data-testid="link-social-youtube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Al-Beruni University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
