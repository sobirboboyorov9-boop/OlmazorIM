import { useGetStatistics } from "@workspace/api-client-react";
import { Users, GraduationCap, BookOpen, Calendar, Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";

export function StatisticsBar() {
  const { data: stats, isLoading } = useGetStatistics();

  if (isLoading) {
    return (
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-full mb-4" />
                <div className="h-8 w-20 bg-primary-foreground/20 rounded mb-2" />
                <div className="h-4 w-24 bg-primary-foreground/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    { icon: Users, label: "O'quvchilar", value: stats.students },
    { icon: GraduationCap, label: "O'qituvchilar", value: stats.professors },
    { icon: BookOpen, label: "Sinflar", value: stats.departments },
    { icon: Calendar, label: "Faoliyat yillari", value: stats.years },
    { icon: Trophy, label: "To'garaklar", value: stats.programs },
    { icon: Star, label: "Olimpiada g'oliblari", value: stats.partners },
  ];

  return (
    <div className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="p-4 bg-primary-foreground/10 rounded-full mb-4">
                <item.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-4xl font-bold mb-2">
                {item.value.toLocaleString()}+
              </div>
              <div className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wider">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
