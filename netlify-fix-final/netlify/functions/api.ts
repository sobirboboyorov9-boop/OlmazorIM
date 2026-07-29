/**
 * Netlify Function — barcha /api/* so'rovlarni shu yerdan ishlov beradi.
 * Hech qanday workspace import yo'q: faqat npm paketlari ishlatiladi.
 */
import express from "express";
import serverlessHttp from "serverless-http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Pool } from "pg";

// ─── Database ─────────────────────────────────────────────────────────────────
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// ─── Config ───────────────────────────────────────────────────────────────────
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "alberuni2024";
const COOKIE_NAME    = "alberuni_admin";
const IS_PROD        = process.env.NODE_ENV === "production" || process.env.CONTEXT === "production";

// ─── App ──────────────────────────────────────────────────────────────────────
const app = express();
app.set("trust proxy", 1);
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Helper ───────────────────────────────────────────────────────────────────
function getAdminCookie(req: express.Request): string | false {
  const sc = (req as any).signedCookies as Record<string, string>;
  return sc?.[COOKIE_NAME] === "authenticated" ? "authenticated" : false;
}

function cookieOpts(): Record<string, unknown> {
  return {
    httpOnly: true,
    signed:   true,
    secure:   IS_PROD,
    sameSite: IS_PROD ? "none" : "lax",
    maxAge:   24 * 60 * 60 * 1000,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body ?? {};
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  res.cookie(COOKIE_NAME, "authenticated", cookieOpts() as any);
  res.json({ success: true, message: "Logged in successfully" });
});

app.post("/api/admin/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOpts() as any);
  res.json({ success: true });
});

app.get("/api/admin/me", (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  res.json({ username: ADMIN_USERNAME, isAdmin: true });
});

app.get("/api/admin/dashboard", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    const [nc, bc, gc, rn] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM news"),
      pool.query("SELECT COUNT(*)::int AS count FROM banners"),
      pool.query("SELECT COUNT(*)::int AS count FROM gallery"),
      pool.query("SELECT * FROM news ORDER BY created_at DESC LIMIT 5"),
    ]);
    res.json({
      totalNews: nc.rows[0].count,
      totalBanners: bc.rows[0].count,
      totalGalleryImages: gc.rows[0].count,
      recentNews: rn.rows,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// --- Admin: News CRUD ---
app.get("/api/admin/news", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    const r = await pool.query("SELECT * FROM news ORDER BY created_at DESC");
    res.json(r.rows);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/news", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  const { title, title_ru, title_en, excerpt, content, category, image_url, is_featured } = req.body;
  try {
    const r = await pool.query(
      `INSERT INTO news (title,title_ru,title_en,excerpt,content,category,image_url,is_featured,published_at,created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW()) RETURNING *`,
      [title, title_ru, title_en, excerpt, content, category, image_url, is_featured ?? false],
    );
    res.status(201).json(r.rows[0]);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/news/:id", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  const { id } = req.params;
  const { title, title_ru, title_en, excerpt, content, category, image_url, is_featured } = req.body;
  try {
    const r = await pool.query(
      `UPDATE news SET title=$1,title_ru=$2,title_en=$3,excerpt=$4,content=$5,
       category=$6,image_url=$7,is_featured=$8 WHERE id=$9 RETURNING *`,
      [title, title_ru, title_en, excerpt, content, category, image_url, is_featured, id],
    );
    res.json(r.rows[0]);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/news/:id", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    await pool.query("DELETE FROM news WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- Admin: Banners ---
app.get("/api/admin/banners", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    const r = await pool.query("SELECT * FROM banners ORDER BY \"order\" ASC");
    res.json(r.rows);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/banners", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  const { title, subtitle, image_url, link, is_active, order } = req.body;
  try {
    const r = await pool.query(
      `INSERT INTO banners (title,subtitle,image_url,link,is_active,"order",created_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *`,
      [title, subtitle, image_url, link, is_active ?? true, order ?? 0],
    );
    res.status(201).json(r.rows[0]);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/banners/:id", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  const { title, subtitle, image_url, link, is_active, order } = req.body;
  try {
    const r = await pool.query(
      `UPDATE banners SET title=$1,subtitle=$2,image_url=$3,link=$4,is_active=$5,"order"=$6
       WHERE id=$7 RETURNING *`,
      [title, subtitle, image_url, link, is_active, order, req.params.id],
    );
    res.json(r.rows[0]);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/banners/:id", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    await pool.query("DELETE FROM banners WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- Admin: Gallery ---
app.get("/api/admin/gallery", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    const r = await pool.query("SELECT * FROM gallery ORDER BY created_at DESC");
    res.json(r.rows);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/gallery", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  const { title, image_url, category } = req.body;
  try {
    const r = await pool.query(
      "INSERT INTO gallery (title,image_url,category,created_at) VALUES ($1,$2,$3,NOW()) RETURNING *",
      [title, image_url, category],
    );
    res.status(201).json(r.rows[0]);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/gallery/:id", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    await pool.query("DELETE FROM gallery WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// --- Admin: Statistics ---
app.get("/api/admin/statistics", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  try {
    const r = await pool.query("SELECT * FROM statistics LIMIT 1");
    res.json(r.rows[0] ?? {});
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/statistics", async (req, res) => {
  if (!getAdminCookie(req)) { res.status(401).json({ error: "Not authenticated" }); return; }
  const { students, professors, departments, years, programs, partners } = req.body;
  try {
    const r = await pool.query(
      `INSERT INTO statistics (students,professors,departments,years,programs,partners)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE SET students=$1,professors=$2,departments=$3,years=$4,programs=$5,partners=$6
       RETURNING *`,
      [students, professors, departments, years, programs, partners],
    );
    res.json(r.rows[0]);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

app.get("/api/news", async (_req, res) => {
  try {
    const r = await pool.query("SELECT * FROM news ORDER BY created_at DESC");
    res.json(r.rows);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.get("/api/news/:id", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM news WHERE id=$1", [req.params.id]);
    if (!r.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(r.rows[0]);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.get("/api/banners", async (_req, res) => {
  try {
    const r = await pool.query("SELECT * FROM banners WHERE is_active=true ORDER BY \"order\" ASC");
    res.json(r.rows);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.get("/api/gallery", async (_req, res) => {
  try {
    const r = await pool.query("SELECT * FROM gallery ORDER BY created_at DESC");
    res.json(r.rows);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.get("/api/statistics", async (_req, res) => {
  try {
    const r = await pool.query("SELECT * FROM statistics LIMIT 1");
    res.json(r.rows[0] ?? {});
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.get("/api/classrooms", async (_req, res) => {
  try {
    const r = await pool.query("SELECT * FROM classrooms ORDER BY name ASC");
    res.json(r.rows);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.get("/api/teachers", async (_req, res) => {
  try {
    const r = await pool.query("SELECT * FROM teachers ORDER BY name ASC");
    res.json(r.rows);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.get("/api/healthz", (_req, res) => res.json({ status: "ok" }));

// ─── Export ───────────────────────────────────────────────────────────────────
export const handler = serverlessHttp(app);
