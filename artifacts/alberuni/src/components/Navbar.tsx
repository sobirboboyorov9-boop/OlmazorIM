import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { label: "Bosh sahifa", href: "/" },
  { label: "O'qituvchilar", href: "/teachers" },
  { label: "Faxrli bitiruvchilar", href: "/alumni" },
  { label: "Dars xonalari", href: "/classrooms" },
  { label: "Yangiliklar", href: "/news" },
  { label: "Bog'lanish", href: "/contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/emblema.jpg"
            alt="Olmazor tumani ixtisoslashtirilgan maktabi"
            className="w-9 h-9 rounded-xl object-cover shadow"
          />

          <div className="leading-tight">
            <div className="font-bold text-gray-900 text-sm leading-none">
              Olmazor
            </div>
            <div className="text-gray-500 text-xs">
              Ixtisoslashtirilgan maktab
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location === item.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/admin" className="hidden lg:block">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Admin
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72 p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <img
                    src="/emblema.jpg"
                    alt="Olmazor tumani ixtisoslashtirilgan maktabi"
                    className="w-8 h-8 rounded-lg object-cover"
                  />

                  <span className="font-semibold text-gray-900 text-sm">
                    Olmazor maktabi
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location === item.href
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-2 border-t mt-2">
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      Admin panel
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}