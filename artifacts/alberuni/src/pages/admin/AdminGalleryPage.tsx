import { useState } from "react";
import {
  useListGallery,
  useCreateGalleryImage,
  useDeleteGalleryImage,
  getListGalleryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const gallerySchema = z.object({
  imageUrl: z.string().min(1, "Rasm URL kiritilishi shart"),
  caption: z.string().optional(),
  order: z.coerce.number().default(0),
});

type GalleryFormInput = z.input<typeof gallerySchema>;
type GalleryFormOutput = z.output<typeof gallerySchema>;

function GalleryAddDialog({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useCreateGalleryImage();

  const form = useForm<GalleryFormInput, any, GalleryFormOutput>({
    resolver: zodResolver(gallerySchema),
    defaultValues: { imageUrl: "", caption: "", order: 0 },
  });

  const onSubmit = (values: GalleryFormOutput) => {
    createMutation.mutate(
      { data: { ...values, caption: values.caption || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Rasm qo'shildi" });
          queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
          onClose();
        },
        onError: () => toast({ title: "Xato", variant: "destructive" }),
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="imageUrl" render={({ field }) => (
          <FormItem><FormLabel>Rasm URL</FormLabel><FormControl><Input {...field} placeholder="https://..." data-testid="input-gallery-image" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="caption" render={({ field }) => (
          <FormItem><FormLabel>Izoh (ixtiyoriy)</FormLabel><FormControl><Input {...field} data-testid="input-gallery-caption" /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="order" render={({ field }) => (
          <FormItem><FormLabel>Tartib raqami</FormLabel><FormControl><Input
  {...field}
  type="number"
  value={field.value as number | undefined}
  onChange={(e) => field.onChange(e.target.valueAsNumber)}
  data-testid="input-gallery-order"
/></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex gap-3">
          <Button type="submit" disabled={createMutation.isPending} className="flex-1" data-testid="button-gallery-save">
            {createMutation.isPending ? "Saqlanmoqda..." : "Qo'shish"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Bekor qilish</Button>
        </div>
      </form>
    </Form>
  );
}

export default function AdminGalleryPage() {
  const { data: gallery, isLoading } = useListGallery({ query: { queryKey: getListGalleryQueryKey() } });
  const deleteMutation = useDeleteGalleryImage();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Galereya</h1>
          <p className="text-muted-foreground mt-1">Universitet foto galereyasini boshqarish</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-gallery">
              <Plus className="h-4 w-4 mr-2" /> Rasm qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Yangi rasm qo'shish</DialogTitle></DialogHeader>
            <GalleryAddDialog onClose={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      ) : !gallery?.length ? (
        <div className="p-12 text-center text-muted-foreground bg-card border rounded-xl">Galereya rasmlari yo'q</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((image) => (
            <div key={image.id} className="relative group rounded-xl overflow-hidden aspect-square bg-muted" data-testid={`card-gallery-${image.id}`}>
              <img
                src={image.imageUrl}
                alt={image.caption ?? "Gallery"}
                className="w-full h-full object-cover"
                onError={e => (e.target as HTMLImageElement).style.display = "none"}
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.caption}
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="destructive" className="h-8 w-8" data-testid={`button-delete-gallery-${image.id}`}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>O'chirishni tasdiqlang</AlertDialogTitle><AlertDialogDescription>Bu rasm o'chiriladi.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate({ id: image.id }, { onSuccess: () => { toast({ title: "Rasm o'chirildi" }); queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() }); }, onError: () => toast({ title: "Xato", variant: "destructive" }) })}
                        className="bg-destructive text-destructive-foreground"
                      >
                        O'chirish
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

