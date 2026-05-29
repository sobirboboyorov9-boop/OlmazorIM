import { Router } from "express";
import { db, newsTable, bannersTable, galleryTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { AdminLoginBody } from "@workspace/api-zod";

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "alberuni2024";

const ADMIN_COOKIE = "alberuni_admin";

router.post("/admin/login", async (req, res) => {
  const body = AdminLoginBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  if (
    body.data.username !== ADMIN_USERNAME ||
    body.data.password !== ADMIN_PASSWORD
  ) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.cookie(ADMIN_COOKIE, "authenticated", {
    httpOnly: true,
    signed: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });

  res.json({ success: true, message: "Logged in successfully" });
});

router.post("/admin/logout", (_req, res) => {
  res.clearCookie(ADMIN_COOKIE);
  res.json({ success: true });
});

router.get("/admin/me", (req, res) => {
  const cookie = (req as { signedCookies?: Record<string, string> }).signedCookies?.[ADMIN_COOKIE];
  if (cookie !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ username: ADMIN_USERNAME, isAdmin: true });
});

router.get("/admin/dashboard", async (req, res) => {
  const cookie = (req as { signedCookies?: Record<string, string> }).signedCookies?.[ADMIN_COOKIE];
  if (cookie !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [newsCount, bannersCount, galleryCount, recentNews] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(newsTable),
    db.select({ count: sql<number>`count(*)` }).from(bannersTable),
    db.select({ count: sql<number>`count(*)` }).from(galleryTable),
    db.select().from(newsTable).orderBy(desc(newsTable.createdAt)).limit(5),
  ]);

  res.json({
    totalNews: Number(newsCount[0].count),
    totalBanners: Number(bannersCount[0].count),
    totalGalleryImages: Number(galleryCount[0].count),
    recentNews,
  });
});

export default router;
