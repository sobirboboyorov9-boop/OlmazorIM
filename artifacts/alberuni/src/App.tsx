import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdminLayout } from "@/components/AdminLayout";
import HomePage from "@/pages/HomePage";
import NewsPage from "@/pages/NewsPage";
import NewsDetailPage from "@/pages/NewsDetailPage";
import ContactPage from "@/pages/ContactPage";
import TeachersPage from "@/pages/TeachersPage";
import AlumniPage from "@/pages/AlumniPage";
import ClassroomsPage from "@/pages/ClassroomsPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminNewsPage from "@/pages/admin/AdminNewsPage";
import AdminBannersPage from "@/pages/admin/AdminBannersPage";
import AdminStatisticsPage from "@/pages/admin/AdminStatisticsPage";
import AdminGalleryPage from "@/pages/admin/AdminGalleryPage";
import AdminContactsPage from "@/pages/admin/AdminContactsPage";
import AdminContentPage from "@/pages/admin/AdminContentPage";
import AdminTeachersPage from "@/pages/admin/AdminTeachersPage";
import AdminAlumniPage from "@/pages/admin/AdminAlumniPage";
import AdminClassroomsPage from "@/pages/admin/AdminClassroomsPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
});

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={() => <PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/news" component={() => <PublicLayout><NewsPage /></PublicLayout>} />
      <Route path="/news/:id" component={() => <PublicLayout><NewsDetailPage /></PublicLayout>} />
      <Route path="/contact" component={() => <PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/teachers" component={() => <PublicLayout><TeachersPage /></PublicLayout>} />
      <Route path="/alumni" component={() => <PublicLayout><AlumniPage /></PublicLayout>} />
      <Route path="/classrooms" component={() => <PublicLayout><ClassroomsPage /></PublicLayout>} />

      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={() => <AdminLayout><AdminDashboardPage /></AdminLayout>} />
      <Route path="/admin/news" component={() => <AdminLayout><AdminNewsPage /></AdminLayout>} />
      <Route path="/admin/banners" component={() => <AdminLayout><AdminBannersPage /></AdminLayout>} />
      <Route path="/admin/statistics" component={() => <AdminLayout><AdminStatisticsPage /></AdminLayout>} />
      <Route path="/admin/gallery" component={() => <AdminLayout><AdminGalleryPage /></AdminLayout>} />
      <Route path="/admin/contacts" component={() => <AdminLayout><AdminContactsPage /></AdminLayout>} />
      <Route path="/admin/content" component={() => <AdminLayout><AdminContentPage /></AdminLayout>} />
      <Route path="/admin/teachers" component={() => <AdminLayout><AdminTeachersPage /></AdminLayout>} />
      <Route path="/admin/alumni" component={() => <AdminLayout><AdminAlumniPage /></AdminLayout>} />
      <Route path="/admin/classrooms" component={() => <AdminLayout><AdminClassroomsPage /></AdminLayout>} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
