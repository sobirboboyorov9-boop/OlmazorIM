"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useGetContacts } from "@workspace/api-client-react";
import { MapPin, Phone, Mail, Clock, Facebook, Send, Instagram, Youtube, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

/* ============================================================
   Premium dark style — CARTO vector tiles (OpenMapTiles sxemasi).
   Bepul, API key shart emas, barqaror CDN.
   ============================================================ */
const PREMIUM_DARK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: "Premium Dark",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json",
    },
  },
  glyphs: "https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf",
  attribution: "© CARTO · © OpenStreetMap contributors",
  layers: [
    { id: "background", type: "background", paint: { "background-color": "#0b0f17" } },

    { id: "park", type: "fill", source: "openmaptiles", "source-layer": "park",
      filter: ["==", ["geometry-type"], "Polygon"],
      paint: { "fill-color": "#0f1b14", "fill-opacity": 0.9 } },

    { id: "landcover", type: "fill", source: "openmaptiles", "source-layer": "landcover",
      filter: [
        "match",
        ["get", "subclass"],
        ["wood", "grass", "sand", "scrub"],
        true,
        false,
      ],
      paint: { "fill-color": "#0e1a13", "fill-opacity": 0.85 } },

    { id: "landuse", type: "fill", source: "openmaptiles", "source-layer": "landuse",
      filter: ["==", ["get", "class"], "residential"],
      paint: { "fill-color": "#10141f", "fill-opacity": 0.5 } },

    { id: "water", type: "fill", source: "openmaptiles", "source-layer": "water",
      filter: ["all", ["match", ["geometry-type"], ["MultiPolygon", "Polygon"], true, false],
        ["!=", ["get", "brunnel"], "tunnel"]],
      paint: { "fill-color": "#0c1626", "fill-opacity": 0.95 } },

    { id: "waterway", type: "line", source: "openmaptiles", "source-layer": "waterway",
      paint: { "line-color": "#0e1a2c", "line-width": 1 } },

    { id: "boundary", type: "line", source: "openmaptiles", "source-layer": "boundary",
      filter: [
        "match",
        ["get", "admin_level"],
        ["2", "4"],
        true,
        false,
      ],
      paint: { "line-color": "#243044", "line-dasharray": [3, 3], "line-opacity": 0.5 } },

    { id: "building-2d", type: "fill", source: "openmaptiles", "source-layer": "building",
      minzoom: 13,
      paint: { "fill-color": "#141b28", "fill-opacity": 0.7 } },

    { id: "building-3d", type: "fill-extrusion", source: "openmaptiles", "source-layer": "building",
      minzoom: 14.5,
      filter: ["!=", ["get", "hide_3d"], true],
      paint: {
        "fill-extrusion-color": ["interpolate", ["linear"], ["zoom"], 14.5, "#1c2334", 16.5, "#273044"],
        "fill-extrusion-height": ["coalesce", ["get", "render_height"], 0],
        "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
        "fill-extrusion-opacity": 0.85,
      } },

    { id: "road-motorway", type: "line", source: "openmaptiles", "source-layer": "transportation",
      filter: [
        "match",
        ["get", "class"],
        ["motorway", "trunk"],
        true,
        false,
      ],
      paint: { "line-color": "#3d4c66", "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1, 14, 3.5, 18, 7] } },

    { id: "road-primary", type: "line", source: "openmaptiles", "source-layer": "transportation",
      filter: ["==", ["get", "class"], "primary"],
      paint: { "line-color": "#2e3a4e", "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.8, 14, 2.6, 18, 5] } },

    { id: "road-secondary", type: "line", source: "openmaptiles", "source-layer": "transportation",
      filter: [
        "match",
        ["get", "class"],
        ["secondary", "tertiary"],
        true,
        false,
      ],
      paint: { "line-color": "#232d3e", "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.6, 14, 2, 18, 4] } },

    { id: "road-street", type: "line", source: "openmaptiles", "source-layer": "transportation",
      filter: [
        "match",
        ["get", "class"],
        ["minor", "service", "track", "path"],
        true,
        false,
      ],
      paint: { "line-color": "#1a222f", "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.6, 15, 1.6, 18, 3] } },

    { id: "road-rail", type: "line", source: "openmaptiles", "source-layer": "transportation",
      filter: ["==", ["get", "class"], "rail"],
      paint: { "line-color": "#1b2433", "line-width": 0.8, "line-dasharray": [2, 2] } },

    { id: "water-name", type: "symbol", source: "openmaptiles", "source-layer": "water_name",
      minzoom: 8,
      layout: {
        "text-field": ["coalesce", ["get", "name:latin"], ["get", "name"]],
        "text-font": ["Noto Sans Italic", "Noto Sans Regular"],
        "text-size": 11,
        "text-letter-spacing": 0.05,
      },
      paint: { "text-color": "#3d5a78", "text-halo-color": "#0b0f17", "text-halo-width": 1 } },

    { id: "road-label", type: "symbol", source: "openmaptiles", "source-layer": "transportation_name",
      filter: [
        "match",
        ["get", "class"],
        ["motorway", "trunk", "primary"],
        true,
        false,
      ],
      minzoom: 13,
      layout: {
        "text-field": ["coalesce", ["get", "name:latin"], ["get", "name"]],
        "text-font": ["Noto Sans Regular", "Open Sans Regular"],
        "text-size": 10,
        "text-transform": "uppercase",
      },
      paint: { "text-color": "#5b6b82", "text-halo-color": "#0b0f17", "text-halo-width": 1 } },

    { id: "place-city", type: "symbol", source: "openmaptiles", "source-layer": "place",
      filter: ["all", ["==", ["get", "class"], "city"], ["!=", ["get", "capital"], 2]],
      minzoom: 3,
      layout: {
        "text-field": ["case", ["has", "name:nonlatin"],
          ["concat", ["get", "name:latin"], "\n", ["get", "name:nonlatin"]],
          ["coalesce", ["get", "name_en"], ["get", "name"]]],
        "text-font": ["Noto Sans Bold", "Open Sans Bold", "Noto Sans Regular"],
        "text-size": 15,
      },
      paint: { "text-color": "#e2e8f0", "text-halo-color": "#0b0f17", "text-halo-width": 1.2 } },

    { id: "place-town", type: "symbol", source: "openmaptiles", "source-layer": "place",
      filter: ["==", ["get", "class"], "town"],
      minzoom: 8,
      layout: {
        "text-field": ["case", ["has", "name:nonlatin"],
          ["concat", ["get", "name:latin"], "\n", ["get", "name:nonlatin"]],
          ["coalesce", ["get", "name_en"], ["get", "name"]]],
        "text-font": ["Noto Sans Regular", "Open Sans Regular"],
        "text-size": 12,
      },
      paint: { "text-color": "#cbd5e1", "text-halo-color": "#0b0f17", "text-halo-width": 1 } },

    { id: "place-village", type: "symbol", source: "openmaptiles", "source-layer": "place",
      filter: ["==", ["get", "class"], "village"],
      minzoom: 11,
      layout: {
        "text-field": ["case", ["has", "name:nonlatin"],
          ["concat", ["get", "name:latin"], "\n", ["get", "name:nonlatin"]],
          ["coalesce", ["get", "name_en"], ["get", "name"]]],
        "text-font": ["Noto Sans Regular", "Open Sans Regular"],
        "text-size": 10.5,
      },
      paint: { "text-color": "#94a3b8", "text-halo-color": "#0b0f17", "text-halo-width": 0.8 } },

    { id: "place-suburb", type: "symbol", source: "openmaptiles", "source-layer": "place",
      filter: [
        "match",
        ["get", "class"],
        ["suburb", "neighbourhood"],
        true,
        false,
      ],
      minzoom: 12,
      layout: {
        "text-field": ["case", ["has", "name:nonlatin"],
          ["concat", ["get", "name:latin"], "\n", ["get", "name:nonlatin"]],
          ["coalesce", ["get", "name_en"], ["get", "name"]]],
        "text-font": ["Noto Sans Regular", "Open Sans Regular"],
        "text-size": 10,
      },
      paint: { "text-color": "#64748b", "text-halo-color": "#0b0f17", "text-halo-width": 0.6 } },
  ],
};

/* ============================================================
   Style navbati: birinchi ishlagani qoladi.
   Har biri boshqa provayder — biri bloklansa, ikkinchisi ishlaydi.
   ============================================================ */
const STYLE_CHAIN: (maplibregl.StyleSpecification | string)[] = [
  PREMIUM_DARK_STYLE,                              // 1) CARTO dark (asosiy)
  "https://demotiles.maplibre.org/style.json",     // 2) MapLibre demo (fallback)
];
const STYLE_TIMEOUT_MS = 10000; // har bir style uchun 10 soniya

export default function ContactPage() {
  const { data: contacts, isLoading } = useGetContacts({ query: { queryKey: ["getContacts"] } });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const flownRef = useRef(false);
  const mapReadyRef = useRef(false);
  const activeStyleIndexRef = useRef(0);
  const styleTimerRef = useRef<number | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [styleFallback, setStyleFallback] = useState(false);

  const lat = contacts?.mapLat ?? 41.335256;
  const lng = contacts?.mapLng ?? 69.248387;

  // 1) Xarita yaratish + style navbatini boshqarish
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      center: [lng, lat],
      zoom: 13.2,
      minZoom: 3,
      maxZoom: 20,
      maxPitch: 70,
      pitch: 30,
      attributionControl: false,
      fadeDuration: 250,
      // style: ko'rsatilmaydi — applyStyle() boshqaradi
    });

    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserLocation: true,
        showAccuracyCircle: false,
      }),
      "top-right"
    );
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), "top-right");
    map.addControl(new maplibregl.FullscreenControl(), "top-right");
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 110 }), "bottom-left");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    let disposed = false;

    // Style navbatida keyingisiga o'tish (timeout asosida)
    const applyStyle = (index: number) => {
      if (disposed) return;
      if (index >= STYLE_CHAIN.length) {
        // Hammasi muvaffaqiyatsiz — banner ko'rsatamiz
        setMapReady(true);
        setMapError(true);
        return;
      }
      activeStyleIndexRef.current = index;
      if (index > 0) setStyleFallback(true);

      map.setStyle(STYLE_CHAIN[index]);

      const started = Date.now();
      styleTimerRef.current = window.setInterval(() => {
        if (disposed) return;
        if (map.isStyleLoaded()) {
          window.clearInterval(styleTimerRef.current!);
          styleTimerRef.current = null;
          if (!mapReadyRef.current) {
            mapReadyRef.current = true;
            setMapReady(true);
          }
          return;
        }
        if (Date.now() - started > STYLE_TIMEOUT_MS) {
          window.clearInterval(styleTimerRef.current!);
          styleTimerRef.current = null;
          applyStyle(index + 1);
        }
      }, 300);
    };

    // Style yuklanganda — fog faqat dark style uchun (maplibre v3.1+)
    map.on("load", () => {
      if (activeStyleIndexRef.current === 0) {
        try {
          map.setFog({
            color: "#0b0f17",
            "high-color": "#1f2937",
            "space-color": "#0b0f17",
            "horizon-blend": 0.35,
            "star-intensity": 0,
          });
        } catch {
          /* eski versiya — e'tiborsiz */
        }
      }
    });

    // Tile/glyph xatolari normal holat — faqat log, UI'ga tegmaydi!
    map.on("error", (e) => {
      console.warn("[map]", e?.error?.message ?? e);
    });

    mapRef.current = map;
    applyStyle(0);

    return () => {
      disposed = true;
      if (styleTimerRef.current) window.clearInterval(styleTimerRef.current);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      flownRef.current = false;
      mapReadyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Premium marker + popup + kinematik kirish
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    const el = document.createElement("div");
    el.className = "premium-marker";
    el.setAttribute("aria-label", "Bizning manzil");
    el.innerHTML = `<div class="premium-pin"><span class="premium-pin-dot"></span></div>`;

    const addressHtml = contacts?.address
      ? `<p style="margin:0 0 6px;font-size:13px;line-height:1.5;color:#e5e7eb;">${contacts.address}</p>`
      : "";
    const phoneHtml = contacts?.phone
      ? `<a href="tel:${contacts.phone}" style="display:inline-block;margin:0;font-size:12.5px;font-weight:600;color:#93c5fd;text-decoration:none;">${contacts.phone}</a>`
      : "";

    const popup = new maplibregl.Popup({
      offset: 36,
      closeButton: false,
      closeOnClick: true,
      maxWidth: "280px",
      className: "premium-popup",
    }).setHTML(
      `<div style="font-family:system-ui,sans-serif;">
         <p style="margin:0 0 6px;font-size:10.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#60a5fa;">Bizning manzil</p>
         ${addressHtml}
         ${phoneHtml}
         <a href="https://www.openstreetmap.org/directions?from=&to=${lat}%2C${lng}" target="_blank" rel="noopener noreferrer" style="display:block;margin-top:10px;padding-top:10px;border-top:1px solid rgba(148,163,184,0.2);font-size:11.5px;font-weight:600;color:#cbd5e1;text-decoration:none;">Yo'nalish olish →</a>
       </div>`
    );

    markerRef.current = new maplibregl.Marker({ element: el, anchor: "center" })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    const doFly = () => {
      if (flownRef.current) return;
      flownRef.current = true;
      map.flyTo({
        center: [lng, lat],
        zoom: 15.4,
        pitch: 52,
        bearing: -18,
        duration: 2600,
        essential: true,
      });
    };
    if (map.loaded()) doFly();
    else map.once("load", doFly);

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts, lat, lng]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* MapLibre premium CSS — o'zgarishsiz */}
      <style>{`
        .premium-popup .maplibregl-popup-content {
          background: rgba(13, 18, 28, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 16px;
          padding: 14px 16px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);
        }
        .premium-popup .maplibregl-popup-tip { border-top-color: rgba(13, 18, 28, 0.88); }
        .premium-popup .maplibregl-popup-close-button { color: #94a3b8; padding: 6px 10px; font-size: 18px; }
        .premium-popup .maplibregl-popup-close-button:hover { color: #fff; background: transparent; }

        .premium-marker { cursor: pointer; filter: drop-shadow(0 12px 20px rgba(37, 99, 235, 0.45)); }
        .premium-marker:hover .premium-pin { transform: rotate(-45deg) scale(1.1); }
        .premium-pin {
          position: relative;
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #60a5fa 0%, #2563eb 55%, #1d4ed8 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid rgba(255, 255, 255, 0.35);
          box-shadow: inset 0 -8px 14px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .premium-pin::before {
          content: ""; position: absolute; inset: -14px; border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0) 70%);
          animation: premiumPulse 2.4s ease-out infinite;
        }
        .premium-pin-dot {
          width: 15px; height: 15px; border-radius: 50%;
          background: #fff;
          border: 2px solid rgba(37, 99, 235, 0.9);
          transform: rotate(45deg);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
        }
        @keyframes premiumPulse {
          0% { transform: scale(0.55); opacity: 0.9; }
          100% { transform: scale(1.9); opacity: 0; }
        }

        .maplibregl-ctrl-group {
          background: rgba(13, 18, 28, 0.75) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.18) !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
        }
        .maplibregl-ctrl-group button { width: 40px !important; height: 40px !important; }
        .maplibregl-ctrl-group button + button { border-top: 1px solid rgba(148, 163, 184, 0.14) !important; }
        .maplibregl-ctrl-group button:hover { background: rgba(148, 163, 184, 0.12) !important; }
        .maplibregl-ctrl-group button .maplibregl-ctrl-icon { filter: invert(1) opacity(0.9); }
        .maplibregl-ctrl-scale {
          background: rgba(13, 18, 28, 0.6) !important;
          color: #cbd5e1 !important;
          border-color: rgba(148, 163, 184, 0.3) !important;
          font-size: 10px;
          backdrop-filter: blur(8px);
        }
        .maplibregl-ctrl-attrib {
          background: rgba(13, 18, 28, 0.55) !important;
          color: #7c8aa0 !important;
          border-radius: 8px 0 0 0;
        }
        .maplibregl-ctrl-attrib a { color: #94a3b8 !important; }
        .maplibregl-ctrl-attrib a:hover { color: #60a5fa !important; }
      `}</style>

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
          {/* Contact info — o'zgarishsiz */}
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

            {/* Social links — o'zgarishsiz */}
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

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/25 ring-1 ring-slate-200/70 overflow-hidden h-96 md:h-full min-h-80 relative">
              <div ref={mapContainerRef} className="absolute inset-0" />

              {/* Yuklanmoqda */}
              {!mapReady && (
                <div className="absolute inset-0 z-[5] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-white/15 border-t-blue-400 animate-spin" />
                    <p className="text-xs font-medium text-slate-200">Xarita yuklanmoqda…</p>
                  </div>
                </div>
              )}

              {/* Xato — FAQAT hamma style muvaffaqiyatsiz bo'lsa */}
              {mapError && (
                <div className="absolute top-3 right-3 z-[6] rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-500/30 px-3.5 py-1.5 text-[11px] font-medium text-rose-200">
                  Xarita yuklanmadi — tarmoqni tekshiring
                </div>
              )}

              {/* Fallback rejimi — xarita ishlayapti, lekin minimal style */}
              {styleFallback && mapReady && !mapError && (
                <div className="absolute bottom-16 right-3 z-[6] rounded-full bg-amber-950/80 backdrop-blur-md border border-amber-500/30 px-3.5 py-1.5 text-[11px] font-medium text-amber-200">
                  Minimal rejim — asosiy style yuklanmadi
                </div>
              )}

              {/* Live chip */}
              <div className="absolute top-3 left-3 z-[6] flex items-center gap-2.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 px-3.5 py-1.5 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11px] font-semibold text-slate-100">Interaktiv xarita</span>
                <span className="font-mono text-[10px] text-slate-400">
                  {lat.toFixed(4)}, {lng.toFixed(4)}
                </span>
              </div>

              {/* Vignette */}
              <div
                className="pointer-events-none absolute inset-0 z-[5] rounded-3xl"
                style={{ background: "radial-gradient(120% 90% at 50% 8%, transparent 55%, rgba(2,6,23,0.45) 100%)" }}
              />
            </div>

            <a
              href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
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