import { useState } from "react";
import { useListAlumni } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Calendar, Briefcase, Star } from "lucide-react";
import type { AlumniItem } from "@workspace/api-client-react";

function AlumniModal({ alumni, onClose }: { alumni: AlumniItem; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden z-10"
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

          <div className="relative h-52 bg-gradient-to-br from-amber-500 to-orange-600 overflow-hidden">
            {alumni.photo ? (
              <img
                src={alumni.photo}
                alt={alumni.name}
                className="w-full h-full object-cover opacity-60"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-xl font-bold">{alumni.name}</h2>
              <p className="text-amber-200 text-sm">{alumni.graduationYear}-yil</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
                <Calendar className="h-3.5 w-3.5" />
                {alumni.graduationYear}-yil
              </div>
              {alumni.currentPosition && (
                <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Briefcase className="h-3.5 w-3.5" />
                  {alumni.currentPosition}
                </div>
              )}
            </div>

            <div className="bg-amber-50 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Trophy className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-amber-800 text-sm font-medium">{alumni.achievement}</p>
              </div>
            </div>

            {alumni.bio && (
              <p className="text-gray-600 text-sm leading-relaxed">{alumni.bio}</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AlumniPage() {
  const { data: alumniList, isLoading } = useListAlumni({ query: { queryKey: ["listAlumni"] } });
  const [selected, setSelected] = useState<AlumniItem | null>(null);
  const [filterYear, setFilterYear] = useState<string>("");

  const years = [...new Set(alumniList?.map((a) => a.graduationYear) ?? [])].sort((a, b) => b - a);

  const filtered = alumniList?.filter((a) =>
    filterYear ? a.graduationYear === Number(filterYear) : true
  ) ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-4">
              <Star className="h-4 w-4 text-yellow-300" />
              Faxr va g'urur
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Faxrli O'quvchilarimiz</h1>
            <p className="text-amber-100 text-lg max-w-xl mx-auto">
              Maktabimizdan yetishib chiqqan g'ururli o'quvchilarimiz
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Year filter */}
        {years.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilterYear("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterYear === ""
                  ? "bg-amber-500 text-white shadow"
                  : "bg-white text-gray-600 border hover:bg-amber-50"
              }`}
            >
              Barchasi
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setFilterYear(String(y))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterYear === String(y)
                    ? "bg-amber-500 text-white shadow"
                    : "bg-white text-gray-600 border hover:bg-amber-50"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
                <div className="h-40 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Bitiruvchi topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((alumni, i) => (
              <motion.div
                key={alumni.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => setSelected(alumni)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer group transition-all duration-200 hover:-translate-y-1"
              >
                <div className="relative h-40 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                  {alumni.photo ? (
                    <img
                      src={alumni.photo}
                      alt={alumni.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-amber-600">
                          {alumni.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {alumni.graduationYear}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                    {alumni.name}
                  </h3>
                  <p className="text-xs text-amber-600 mt-1 font-medium line-clamp-2">
                    {alumni.achievement}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <AlumniModal alumni={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
