import { useGetAdminDashboard, getGetAdminDashboardQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Newspaper, Image, ImageIcon, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetAdminDashboard({
    query: { queryKey: getGetAdminDashboardQueryKey() },
  });

  const statCards = [
    { label: "Yangiliklar", value: data?.totalNews ?? 0, icon: Newspaper, href: "/admin/news", color: "text-blue-600" },
    { label: "Bannerlar", value: data?.totalBanners ?? 0, icon: Image, href: "/admin/banners", color: "text-purple-600" },
    { label: "Galereya rasmlari", value: data?.totalGalleryImages ?? 0, icon: ImageIcon, href: "/admin/gallery", color: "text-green-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-muted-foreground">Al-Beruni University boshqaruv paneli</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div
              className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group"
              data-testid={`card-stat-${card.label}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-muted rounded-xl`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-20 mb-2" />
              ) : (
                <p className="text-4xl font-bold mb-1">{card.value}</p>
              )}
              <p className="text-muted-foreground text-sm">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent News */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg">So'nggi yangiliklar</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/news" className="flex items-center gap-2">
              Barchasi <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="divide-y">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))
          ) : data?.recentNews?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Yangiliklar yo'q</div>
          ) : (
            data?.recentNews?.map((article) => (
              <div
                key={article.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                data-testid={`row-news-${article.id}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{article.title}</p>
                  <p className="text-sm text-muted-foreground">{article.category}</p>
                </div>
                <time className="text-sm text-muted-foreground shrink-0">
                  {format(new Date(article.publishedAt), "d MMM yyyy")}
                </time>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
