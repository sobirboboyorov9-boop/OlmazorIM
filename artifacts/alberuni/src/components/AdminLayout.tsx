import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetAdminMe, getGetAdminMeQueryKey, useAdminLogout } from "@workspace/api-client-react";
import {
  LayoutDashboard,
  Newspaper,
  Image,
  BarChart2,
  ImageIcon,
  Phone,
  FileText,
  LogOut,
  Menu,
  Users,
  Trophy,
  School,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/news", label: "Yangiliklar", icon: Newspaper },
  { href: "/admin/teachers", label: "O'qituvchilar", icon: Users },
  { href: "/admin/alumni", label: "Bitiruvchilar", icon: Trophy },
  { href: "/admin/classrooms", label: "Dars xonalari", icon: School },
  { href: "/admin/banners", label: "Bannerlar", icon: Image },
  { href: "/admin/statistics", label: "Statistika", icon: BarChart2 },
  { href: "/admin/gallery", label: "Galereya", icon: ImageIcon },
  { href: "/admin/contacts", label: "Kontaktlar", icon: Phone },
  { href: "/admin/content", label: "Kontent", icon: FileText },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, isLoading } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey(), retry: false },
  });
  const logoutMutation = useAdminLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/admin/login"),
    });
  };

  if (isLoading) {
    return null; // yoki spinner
  }

  if (!session) {
    navigate("/admin/login");
    return null;
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src="/emblema.jpg"
            alt="Olmazor tumani ixtisoslashtirilgan maktabi"
            className="w-10 h-10 rounded-lg object-cover border border-gray-200 shadow-sm"
          />
          <div>
            <div className="font-bold text-gray-900 text-sm">Admin Panel</div>
            <div className="text-gray-400 text-xs">
              Olmazor ixtisoslashtirilgan maktabi
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location === href
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Chiqish
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r h-screen sticky top-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-white h-full">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold">Admin Panel</span>
        </div>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}