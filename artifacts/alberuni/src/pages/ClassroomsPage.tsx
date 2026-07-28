import { useState } from "react";
import { useListClassrooms } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Layers, Building2 } from "lucide-react";
import type { ClassroomItem } from "@workspace/api-client-react";

function ClassroomModal({ classroom, onClose }: { classroom: ClassroomItem; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden z-10"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 bg-white/90 rounded-full p-1.5 shadow hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>

          <div className="relative h-64 overflow-hidden bg-gray-900">
            <img
              src={classroom.imageUrl}
              alt={classroom.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-xl font-bold">{classroom.name}</h2>
              {classroom.capacity && (
                <p className="text-gray-300 text-sm flex items-center gap-1.5 mt-1">
                  <Users className="h-3.5 w-3.5" />
                  {classroom.capacity} o'rin
                </p>
              )}
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full text-sm font-medium">
                <Layers className="h-3.5 w-3.5" />
                {classroom.name}
              </div>
              {classroom.capacity && (
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Users className="h-3.5 w-3.5" />
                  {classroom.capacity} o'rin
                </div>
              )}
            </div>

            {classroom.description && (
              <p className="text-gray-600 text-sm leading-relaxed">{classroom.description}</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ClassroomsPage() {
  const { data: classrooms, isLoading } = useListClassrooms({ query: { queryKey: ["listClassrooms"] } });
  const [selected, setSelected] = useState<ClassroomItem | null>(null);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-4">
              <Building2 className="h-4 w-4 text-teal-200" />
              Infratuzilma
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Dars Xonalari</h1>
            <p className="text-teal-100 text-lg max-w-xl mx-auto">
              Zamonaviy jihozlangan sinflar va laboratoriyalar bilan tanishing
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : !classrooms?.length ? (
          <div className="text-center py-20 text-gray-400">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Dars xonalar topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {classrooms.map((classroom, i) => (
              <motion.div
                key={classroom.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                onClick={() => setSelected(classroom)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg cursor-pointer group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden bg-gray-900">
                  <img
                    src={classroom.imageUrl}
                    alt={classroom.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {classroom.capacity && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {classroom.capacity}
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm font-medium">Batafsil ko'rish</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-base">{classroom.name}</h3>
                  {classroom.description && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{classroom.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ClassroomModal classroom={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
