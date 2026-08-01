"use client";

import { useGetContacts } from "@workspace/api-client-react";
import { MapPin, Phone, Mail, Clock, Facebook, Send, Instagram, Youtube, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const { data: contacts, isLoading } = useGetContacts({ query: { queryKey: ["getContacts"] } });

  // ===== Xarita koordinatalari (qat'iy) =====
  const lat = 41.335256;
  const lng = 69.248387;

  // Yandex Maps widget — API key shart emas (ll/pt: lng,lat tartibida)
  const iframeSrc = `https://yandex.uz/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2rdm&lang=uz_UZ`;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Bog'lanish</h1>
            <p className="text-blue-100 text-lg">Biz bilan aloqa o'rnating</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Aloqa ma'lumotlari</h2>

              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Manzil</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{contacts?.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Telefon</p>
                      <a href={`tel:${contacts?.phone}`} className="text-gray-700 text-sm hover:text-blue-600 transition-colors">
                        {contacts?.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Email</p>
                      <a href={`mailto:${contacts?.email}`} className="text-gray-700 text-sm hover:text-blue-600 transition-colors">
                        {contacts?.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Ish vaqti</p>
                      <p className="text-gray-700 text-sm">{contacts?.workingHours}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Social links */}
            {contacts && (contacts.facebook || contacts.telegram || contacts.instagram || contacts.youtube) && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Ijtimoiy tarmoqlar</h3>
                <div className="flex flex-wrap gap-3">
                  {contacts.facebook && (
                    <a
                      href={contacts.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                  )}
                  {contacts.telegram && (
                    <a
                      href={contacts.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl text-sm font-medium hover:bg-sky-600 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      Telegram
                    </a>
                  )}
                  {contacts.instagram && (
                    <a
                      href={contacts.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </a>
                  )}
                  {contacts.youtube && (
                    <a
                      href={contacts.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Map — Yandex Maps widget (41.335256, 69.248387) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200 overflow-hidden h-96 md:h-full min-h-80 relative">
              <iframe
                src={iframeSrc}
                title="Bizning manzil — Yandex Maps"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href={`https://yandex.uz/maps/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all duration-200"
            >
              <MapPin className="h-4 w-4" />
              Xaritada ko'rish
              <ArrowUpRight className="h-4 w-4 text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </main>
  );
}