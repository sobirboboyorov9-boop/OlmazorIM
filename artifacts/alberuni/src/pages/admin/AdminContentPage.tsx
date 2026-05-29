import { useGetHomepageContent, useUpdateHomepageContent, getGetHomepageContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const contentSchema = z.object({
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  aboutTitle: z.string().min(1),
  aboutBody: z.string().min(1),
  missionText: z.string().min(1),
  visionText: z.string().optional(),
});

type ContentForm = z.infer<typeof contentSchema>;

export default function AdminContentPage() {
  const { data: content, isLoading } = useGetHomepageContent({ query: { queryKey: getGetHomepageContentQueryKey() } });
  const updateMutation = useUpdateHomepageContent();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<ContentForm>({
    resolver: zodResolver(contentSchema),
    defaultValues: { heroTitle: "", heroSubtitle: "", aboutTitle: "", aboutBody: "", missionText: "", visionText: "" },
  });

  useEffect(() => {
    if (content) {
      form.reset({
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        aboutTitle: content.aboutTitle,
        aboutBody: content.aboutBody,
        missionText: content.missionText,
        visionText: content.visionText ?? "",
      });
    }
  }, [content, form]);

  const onSubmit = (values: ContentForm) => {
    updateMutation.mutate(
      { data: { ...values, visionText: values.visionText || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Kontent yangilandi" });
          queryClient.invalidateQueries({ queryKey: getGetHomepageContentQueryKey() });
        },
        onError: () => toast({ title: "Xato", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Bosh sahifa kontenti</h1>
        <p className="text-muted-foreground mt-1">Bosh sahifadagi matnlarni tahrirlash</p>
      </div>

      <div className="bg-card border rounded-xl p-6">
        {isLoading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="heroTitle" render={({ field }) => (
                <FormItem><FormLabel>Hero sarlavha</FormLabel><FormControl><Input {...field} data-testid="input-content-hero-title" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="heroSubtitle" render={({ field }) => (
                <FormItem><FormLabel>Hero qo'shimcha matn</FormLabel><FormControl><Textarea {...field} rows={2} data-testid="input-content-hero-subtitle" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="aboutTitle" render={({ field }) => (
                <FormItem><FormLabel>Universitet haqida - sarlavha</FormLabel><FormControl><Input {...field} data-testid="input-content-about-title" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="aboutBody" render={({ field }) => (
                <FormItem><FormLabel>Universitet haqida - asosiy matn</FormLabel><FormControl><Textarea {...field} rows={4} data-testid="input-content-about-body" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="missionText" render={({ field }) => (
                <FormItem><FormLabel>Missiya matni</FormLabel><FormControl><Textarea {...field} rows={3} data-testid="input-content-mission" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="visionText" render={({ field }) => (
                <FormItem><FormLabel>Vizyon matni (ixtiyoriy)</FormLabel><FormControl><Textarea {...field} rows={3} data-testid="input-content-vision" /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={updateMutation.isPending} data-testid="button-content-save">
                {updateMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
