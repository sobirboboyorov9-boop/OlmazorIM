import { useState } from "react";
import {
  useListNews,
  useCreateNewsArticle,
  useUpdateNewsArticle,
  useDeleteNewsArticle,
  getListNewsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const newsSchema = z.object({
  title: z.string().min(1, "Sarlavha kiritilishi shart"),
  excerpt: z.string().min(1, "Qisqa ma'lumot kiritilishi shart"),
  content: z.string().min(1, "Kontent kiritilishi shart"),
  category: z.string().min(1, "Kategoriya kiritilishi shart"),
  imageUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type NewsFormInput = z.input<typeof newsSchema>;
type NewsFormOutput = z.output<typeof newsSchema>;

type NewsArticle = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string | null;
  publishedAt: string;
  isFeatured: boolean;
};

function NewsFormDialog({
  article,
  onClose,
}: {
  article?: NewsArticle;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useCreateNewsArticle();
  const updateMutation = useUpdateNewsArticle();

  const form = useForm<NewsFormInput, any, NewsFormOutput>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: article?.title ?? "",
      excerpt: article?.excerpt ?? "",
      content: article?.content ?? "",
      category: article?.category ?? "general",
      imageUrl: article?.imageUrl ?? "",
      isFeatured: article?.isFeatured ?? false,
    },
  });

  const onSubmit = (values: NewsFormOutput) => {
    const data = { ...values, imageUrl: values.imageUrl || undefined };

    if (article) {
      updateMutation.mutate(
        { id: article.id, data },
        {
          onSuccess: () => {
            toast({ title: "Yangilik yangilandi" });
            queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
            onClose();
          },
          onError: () => toast({ title: "Xato", variant: "destructive" }),
        }
      );
    } else {
      createMutation.mutate(
        { data },
        {
          onSuccess: () => {
            toast({ title: "Yangilik qo'shildi" });
            queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
            onClose();
          },
          onError: () => toast({ title: "Xato", variant: "destructive" }),
        }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Sarlavha</FormLabel>
            <FormControl><Input {...field} data-testid="input-news-title" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem>
            <FormLabel>Kategoriya</FormLabel>
            <FormControl><Input {...field} placeholder="fan, talabalar, ilm..." data-testid="input-news-category" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="imageUrl" render={({ field }) => (
          <FormItem>
            <FormLabel>Rasm URL (ixtiyoriy)</FormLabel>
            <FormControl><Input {...field} placeholder="https://..." data-testid="input-news-image" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="excerpt" render={({ field }) => (
          <FormItem>
            <FormLabel>Qisqa ma'lumot</FormLabel>
            <FormControl><Textarea {...field} rows={2} data-testid="input-news-excerpt" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem>
            <FormLabel>Kontent</FormLabel>
            <FormControl><Textarea {...field} rows={6} data-testid="input-news-content" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="isFeatured" render={({ field }) => (
          <FormItem className="flex items-center gap-3 space-y-0">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                data-testid="switch-news-featured"
              />
            </FormControl>
            <FormLabel className="cursor-pointer">Bosh sahifada ko'rsatish</FormLabel>
          </FormItem>
        )} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending} className="flex-1" data-testid="button-news-save">
            {isPending ? "Saqlanmoqda..." : (article ? "Yangilash" : "Qo'shish")}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Bekor qilish</Button>
        </div>
      </form>
    </Form>
  );
}

export default function AdminNewsPage() {
  const { data, isLoading } = useListNews({ page: 1, limit: 50 }, { query: { queryKey: getListNewsQueryKey({ page: 1, limit: 50 }) } });
  const deleteMutation = useDeleteNewsArticle();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editArticle, setEditArticle] = useState<NewsArticle | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Yangilik o'chirildi" });
          queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
        },
        onError: () => toast({ title: "Xato", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Yangiliklar</h1>
          <p className="text-muted-foreground mt-1">Barcha yangiliklar va maqolalar</p>
        </div>
        <Dialog open={dialogOpen && !editArticle} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditArticle(undefined); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditArticle(undefined); setDialogOpen(true); }} data-testid="button-add-news">
              <Plus className="h-4 w-4 mr-2" /> Qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Yangilik qo'shish</DialogTitle></DialogHeader>
            <NewsFormDialog onClose={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
          </div>
        ) : !data?.items.length ? (
          <div className="p-12 text-center text-muted-foreground">Yangiliklar yo'q</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b">
              <tr>
                <th className="text-left p-4 font-medium">Sarlavha</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Kategoriya</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Sana</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Featured</th>
                <th className="p-4 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.map((article) => (
                <tr key={article.id} className="hover:bg-muted/20 transition-colors" data-testid={`row-news-${article.id}`}>
                  <td className="p-4">
                    <p className="font-medium line-clamp-1">{article.title}</p>
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-1 md:hidden">{article.category}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <Badge variant="secondary">{article.category}</Badge>
                  </td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">
                    {format(new Date(article.publishedAt), "d MMM yyyy")}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {article.isFeatured ? <Check className="h-4 w-4 text-green-600" /> : null}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <Dialog open={dialogOpen && editArticle?.id === article.id} onOpenChange={(o) => { if (!o) { setDialogOpen(false); setEditArticle(undefined); } }}>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => { setEditArticle(article as NewsArticle); setDialogOpen(true); }}
                            data-testid={`button-edit-news-${article.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader><DialogTitle>Yangilikni tahrirlash</DialogTitle></DialogHeader>
                          {editArticle && <NewsFormDialog article={editArticle} onClose={() => { setDialogOpen(false); setEditArticle(undefined); }} />}
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" data-testid={`button-delete-news-${article.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>O'chirishni tasdiqlang</AlertDialogTitle>
                            <AlertDialogDescription>Bu amalni bekor qilib bo'lmaydi.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(article.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              O'chirish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

