import { useGetStatistics, useUpdateStatistics, getGetStatisticsQueryKey } from "@workspace/api-client-react";
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

const statsSchema = z.object({
  students: z.coerce.number().min(0),
  professors: z.coerce.number().min(0),
  departments: z.coerce.number().min(0),
  years: z.coerce.number().min(0),
  programs: z.coerce.number().min(0),
  partners: z.coerce.number().min(0),
});

type StatsForm = z.infer<typeof statsSchema>;

export default function AdminStatisticsPage() {
  const { data: stats, isLoading } = useGetStatistics({ query: { queryKey: getGetStatisticsQueryKey() } });
  const updateMutation = useUpdateStatistics();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<StatsForm>({
    resolver: zodResolver(statsSchema),
    defaultValues: { students: 0, professors: 0, departments: 0, years: 0, programs: 0, partners: 0 },
  });

  useEffect(() => {
    if (stats) {
      form.reset({
        students: stats.students,
        professors: stats.professors,
        departments: stats.departments,
        years: stats.years,
        programs: stats.programs,
        partners: stats.partners,
      });
    }
  }, [stats, form]);

  const onSubmit = (values: StatsForm) => {
    updateMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Statistika yangilandi" });
          queryClient.invalidateQueries({ queryKey: getGetStatisticsQueryKey() });
        },
        onError: () => toast({ title: "Xato", variant: "destructive" }),
      }
    );
  };

  const FIELDS = [
    { name: "students" as const, label: "O'quvchilar soni" },
    { name: "professors" as const, label: "O'qituvchilar soni" },
    { name: "departments" as const, label: "Sinflar soni" },
    { name: "years" as const, label: "Faoliyat yillari" },
    { name: "programs" as const, label: "To'garaklar soni" },
    { name: "partners" as const, label: "Olimpiada g'oliblari" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Statistika</h1>
        <p className="text-muted-foreground mt-1">Bosh sahifadagi raqamli ko'rsatkichlarni tahrirlash</p>
      </div>

      <div className="bg-card border rounded-xl p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {FIELDS.map(({ name, label }) => (
                  <FormField key={name} control={form.control} name={name} render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={0} data-testid={`input-stat-${name}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ))}
              </div>
              <Button type="submit" disabled={updateMutation.isPending} data-testid="button-stats-save">
                {updateMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
