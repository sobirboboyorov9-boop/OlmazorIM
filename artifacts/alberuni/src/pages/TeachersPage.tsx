import { useState } from "react";
import { useListTeachers } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, Award, BookOpen, Clock } from "lucide-react";
import type { Teacher } from "@workspace/api-client-react";

function TeacherModal({ teacher, onClose }: { teacher: Teacher; onClose: () => void }) {
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

          <div className="relative h-52 bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
            {teacher.photo ? (
              <img
                src={teacher.photo}
                alt={teacher.name}
                className="w-full h-full object-cover opacity-60"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-xl font-bold">{teacher.name}</h2>
              <p className="text-blue-200 text-sm font-medium">{teacher.subject}</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                <Clock className="h-3.5 w-3.5" />
                {teacher.experience} yil tajriba
              </div>
              <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium">
                <BookOpen className="h-3.5 w-3.5" />
                {teacher.subject}
              </div>
            </div>

            {teacher.bio && (
              <p className="text-gray-600 text-sm leading-relaxed">{teacher.bio}</p>
            )}

            {(teacher.phone || teacher.email) && (
              <div className="border-t pt-4 space-y-2">
                {teacher.phone && (
                  <a
                    href={`tel:${teacher.phone}`}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-blue-500" />
                    {teacher.phone}
                  </a>
                )}
                {teacher.email && (
                  <a
                    href={`mailto:${teacher.email}`}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="h-4 w-4 text-blue-500" />
                    {teacher.email}
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function TeachersPage() {
  const { data: teachers, isLoading } = useListTeachers({ query: { queryKey: ["listTeachers"] } });
  const [selected, setSelected] = useState<Teacher | null>(null);
  const [search, setSearch] = useState("");

  const filtered = teachers?.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-4">
              <Award className="h-4 w-4 text-yellow-300" />
              Bizning jamoamiz
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">O'qituvchilar</h1>
            <p className="text-blue-100 text-lg max-w-xl mx-auto">
              Tajribali va malakali o'qituvchilarimiz bilan tanishing
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="O'qituvchi yoki fan bo'yicha qidiring..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
                <div className="h-40 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-2 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>O'qituvchi topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((teacher, i) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => setSelected(teacher)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer group transition-all duration-200 hover:-translate-y-1"
              >
                <div className="relative h-40 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                  {teacher.photo ? (
                    <img
                      src={teacher.photo}
                      alt={teacher.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {teacher.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-blue-600 mt-1 font-medium line-clamp-1">
                    {teacher.subject}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {teacher.experience} yil
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <TeacherModal teacher={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
