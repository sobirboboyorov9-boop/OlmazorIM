import { useState } from "react";
import {
  useListBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  getListBannersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const bannerSchema = z.object({
  title: z.string().min(1, "Sarlavha kiritilishi shart"),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1, "Rasm URL kiritilishi shart"),
  linkUrl: z.string().optional(),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

type BannerForm = z.infer<typeof bannerSchema>;
type Banner = { id: number; title: string; subtitle: string | null; imageUrl: string; linkUrl: string | null; order: number; isActive: boolean };

function BannerFormDialog({ banner, onClose }: { banner?: Banner; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();

  const form = useForm<BannerForm>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: banner?.title ?? "",
      subtitle: banner?.subtitle ?? "",
      imageUrl: banner?.imageUrl ?? "",
      linkUrl: banner?.linkUrl ?? "",
      order: banner?.order ?? 0,
      isActive: banner?.isActive ?? true,
    },
  });

  const onSubmit = (values: BannerForm) => {
    const data = {
      ...values,
      subtitle: values.subtitle || undefined,
      linkUrl: values.linkUrl || undefined,
    };

    if (banner) {
      updateMutation.mutate({ id: banner.id, data }, {
        onSuccess: () => {
          toast({ title: "Banner yangilandi" });
          queryClient.invalidateQueries({ queryKey: getListBannersQueryKey() });
          onClose();
        },
        onError: () => toast({ title: "Xato", variant: "destructive" }),
      });
    } else {
      createMutation.mutate({ data }, {
        onSuccess: () => {
          toast({ title: "Banner qo'shildi" });
          queryClient.invalidateQueries({ queryKey: getListBannersQueryKey() });
          onClose();
        },
        onError: () => toast({ title: "Xato", variant: "destructive" }),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>Sarlavha</FormLabel><FormControl><Input {...field} data-testid="input-banner-title" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="subtitle" render={({ field }) => (
          <FormItem><FormLabel>Qo'shimcha matn</FormLabel><FormControl><Input {...field} data-testid="input-banner-subtitle" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="imageUrl" render={({ field }) => (
          <FormItem><FormLabel>Rasm URL</FormLabel><FormControl><Input {...field} placeholder="https://..." data-testid="input-banner-image" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="linkUrl" render={({ field }) => (
          <FormItem><FormLabel>Havola (ixtiyoriy)</FormLabel><FormControl><Input {...field} placeholder="https://..." data-testid="input-banner-link" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Tartib raqami</FormLabel><FormControl><Input {...field} type="number" data-testid="input-banner-order" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex items-center gap-3 space-y-0">
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-banner-active" /></FormControl>
            <FormLabel>Faol</FormLabel>
          </FormItem>
        )} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1" data-testid="button-banner-save">
            {createMutation.isPending || updateMutation.isPending ? "Saqlanmoqda..." : (banner ? "Yangilash" : "Qo'shish")}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Bekor qilish</Button>
        </div>
      </form>
    </Form>
  );
}

export default function AdminBannersPage() {
  const { data: banners, isLoading } = useListBanners({ query: { queryKey: getListBannersQueryKey() } });
  const deleteMutation = useDeleteBanner();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editBanner, setEditBanner] = useState<Banner | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bannerlar</h1>
          <p className="text-muted-foreground mt-1">Bosh sahifa slider bannerlarini boshqarish</p>
        </div>
        <Dialog open={dialogOpen && !editBanner} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditBanner(undefined); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditBanner(undefined); setDialogOpen(true); }} data-testid="button-add-banner">
              <Plus className="h-4 w-4 mr-2" /> Qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Banner qo'shish</DialogTitle></DialogHeader>
            <BannerFormDialog onClose={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)
        ) : !banners?.length ? (
          <div className="col-span-2 p-12 text-center text-muted-foreground bg-card border rounded-xl">Bannerlar yo'q</div>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className="bg-card border rounded-xl overflow-hidden flex flex-col" data-testid={`card-banner-${banner.id}`}>
              <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" onError={e => (e.target as HTMLImageElement).style.display = "none"} />
                <div className="absolute top-3 right-3">
                  <Badge variant={banner.isActive ? "default" : "secondary"}>{banner.isActive ? "Faol" : "Nofaol"}</Badge>
                </div>
              </div>
              <div className="p-4 flex-1">
                <p className="font-bold">{banner.title}</p>
                {banner.subtitle && <p className="text-sm text-muted-foreground">{banner.subtitle}</p>}
                <p className="text-xs text-muted-foreground mt-1">Tartib: {banner.order}</p>
              </div>
              <div className="flex gap-2 p-4 border-t">
                <Dialog open={dialogOpen && editBanner?.id === banner.id} onOpenChange={(o) => { if (!o) { setDialogOpen(false); setEditBanner(undefined); } }}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => { setEditBanner(banner as Banner); setDialogOpen(true); }} data-testid={`button-edit-banner-${banner.id}`}>
                      <Pencil className="h-4 w-4 mr-1" /> Tahrirlash
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Bannerni tahrirlash</DialogTitle></DialogHeader>
                    {editBanner && <BannerFormDialog banner={editBanner} onClose={() => { setDialogOpen(false); setEditBanner(undefined); }} />}
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" data-testid={`button-delete-banner-${banner.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>O'chirishni tasdiqlang</AlertDialogTitle><AlertDialogDescription>Bu banner o'chiriladi.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate({ id: banner.id }, { onSuccess: () => { toast({ title: "Banner o'chirildi" }); queryClient.invalidateQueries({ queryKey: getListBannersQueryKey() }); }, onError: () => toast({ title: "Xato", variant: "destructive" }) })} className="bg-destructive text-destructive-foreground">O'chirish</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
