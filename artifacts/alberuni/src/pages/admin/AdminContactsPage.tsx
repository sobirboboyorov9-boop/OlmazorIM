import { useGetContacts, useUpdateContacts, getGetContactsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const contactsSchema = z.object({
  address: z.string().min(1),
  addressRu: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email(),
  workingHours: z.string().min(1),
  facebook: z.string().optional(),
  telegram: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
});

type ContactsForm = z.infer<typeof contactsSchema>;

export default function AdminContactsPage() {
  const { data: contacts, isLoading } = useGetContacts({ query: { queryKey: getGetContactsQueryKey() } });
  const updateMutation = useUpdateContacts();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<ContactsForm>({
    resolver: zodResolver(contactsSchema),
    defaultValues: { address: "", addressRu: "", phone: "", email: "", workingHours: "", facebook: "", telegram: "", instagram: "", youtube: "" },
  });

  useEffect(() => {
    if (contacts) {
      form.reset({
        address: contacts.address,
        addressRu: contacts.addressRu ?? "",
        phone: contacts.phone,
        email: contacts.email,
        workingHours: contacts.workingHours,
        facebook: contacts.facebook ?? "",
        telegram: contacts.telegram ?? "",
        instagram: contacts.instagram ?? "",
        youtube: contacts.youtube ?? "",
      });
    }
  }, [contacts, form]);

  const onSubmit = (values: ContactsForm) => {
    updateMutation.mutate(
      { data: { ...values, addressRu: values.addressRu || undefined, facebook: values.facebook || undefined, telegram: values.telegram || undefined, instagram: values.instagram || undefined, youtube: values.youtube || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Kontakt ma'lumotlari yangilandi" });
          queryClient.invalidateQueries({ queryKey: getGetContactsQueryKey() });
        },
        onError: () => toast({ title: "Xato", variant: "destructive" }),
      }
    );
  };

  const fields = [
    { name: "address" as const, label: "Manzil (o'zbek)", placeholder: "Nukus shahrida..." },
    { name: "addressRu" as const, label: "Manzil (rus, ixtiyoriy)", placeholder: "г. Нукус..." },
    { name: "phone" as const, label: "Telefon", placeholder: "+998 61 ..." },
    { name: "email" as const, label: "Email", placeholder: "info@alberuni.uz" },
    { name: "workingHours" as const, label: "Ish vaqti", placeholder: "Du-Ju: 9:00 - 18:00" },
    { name: "facebook" as const, label: "Facebook URL", placeholder: "https://facebook.com/..." },
    { name: "telegram" as const, label: "Telegram URL", placeholder: "https://t.me/..." },
    { name: "instagram" as const, label: "Instagram URL", placeholder: "https://instagram.com/..." },
    { name: "youtube" as const, label: "YouTube URL", placeholder: "https://youtube.com/..." },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Kontakt ma'lumotlari</h1>
        <p className="text-muted-foreground mt-1">Saytda ko'rinadigan aloqa ma'lumotlarini tahrirlash</p>
      </div>

      <div className="bg-card border rounded-xl p-6">
        {isLoading ? (
          <div className="space-y-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {fields.map(({ name, label, placeholder }) => (
                <FormField key={name} control={form.control} name={name} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl><Input {...field} placeholder={placeholder} data-testid={`input-contact-${name}`} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
              <Button type="submit" disabled={updateMutation.isPending} data-testid="button-contacts-save">
                {updateMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
