import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const navLinks = [
    { label: "About", href: "/#about" },
    { label: "Faculties", href: "/#faculties" },
    { label: "Admissions", href: "/#admissions" },
    { label: "Science", href: "/#science" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home-logo">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            AB
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">
            Al-Beruni University
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
              data-testid={`link-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex gap-2 text-sm font-medium">
            <span className="cursor-pointer text-primary">EN</span>
            <span className="cursor-pointer text-muted-foreground hover:text-primary">RU</span>
            <span className="cursor-pointer text-muted-foreground hover:text-primary">UZ</span>
          </div>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-6 mt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium"
                  data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-4 mt-4">
                <span className="cursor-pointer text-primary font-bold">EN</span>
                <span className="cursor-pointer text-muted-foreground">RU</span>
                <span className="cursor-pointer text-muted-foreground">UZ</span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
