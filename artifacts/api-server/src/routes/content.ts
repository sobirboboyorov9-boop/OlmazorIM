import { Router } from "express";
import { db, homepageContentTable } from "@workspace/db";
import { UpdateHomepageContentBody } from "@workspace/api-zod";

const router = Router();

const DEFAULT_CONTENT = {
  heroTitle: "Al-Beruni universiteti",
  heroSubtitle: "Bilim, fan va innovatsiya markazi — Qoraqalpog'istonning eng yetakchi oliy o'quv yurti",
  aboutTitle: "Universitet haqida",
  aboutBody: "Al-Beruni universiteti 1950-yilda tashkil etilgan bo'lib, Qoraqalpog'iston Respublikasining eng yetakchi oliy o'quv yurtidir. Universitetda 12 ta fakultet, 80 dan ortiq ta'lim yo'nalishlari mavjud bo'lib, 15 000 dan ziyod talaba tahsil olmoqda. Biz zamonaviy ta'lim, ilmiy tadqiqotlar va innovatsiyalar orqali jamiyat taraqqiyotiga hissa qo'shmoqdamiz.",
  missionText: "Bizning missiyamiz — har tomonlama rivojlangan, raqobatbardosh mutaxassislar tayyorlash va ilmiy tadqiqotlar orqali jamiyat rivojiga hissa qo'shish.",
  visionText: "O'rta Osiyo mintaqasida tan olingan, xalqaro darajada raqobatbardosh universitetga aylanish.",
};

router.get("/content/homepage", async (_req, res) => {
  const [content] = await db.select().from(homepageContentTable).limit(1);

  if (!content) {
    const [created] = await db
      .insert(homepageContentTable)
      .values(DEFAULT_CONTENT)
      .returning();
    res.json(created);
    return;
  }

  res.json(content);
});

router.patch("/content/homepage", async (req, res) => {
  const body = UpdateHomepageContentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [existing] = await db.select().from(homepageContentTable).limit(1);

  if (!existing) {
    const [created] = await db
      .insert(homepageContentTable)
      .values({ ...DEFAULT_CONTENT, ...body.data })
      .returning();
    res.json(created);
    return;
  }

  const updates: Record<string, unknown> = {};
  if (body.data.heroTitle !== undefined) updates.heroTitle = body.data.heroTitle;
  if (body.data.heroSubtitle !== undefined) updates.heroSubtitle = body.data.heroSubtitle;
  if (body.data.aboutTitle !== undefined) updates.aboutTitle = body.data.aboutTitle;
  if (body.data.aboutBody !== undefined) updates.aboutBody = body.data.aboutBody;
  if (body.data.missionText !== undefined) updates.missionText = body.data.missionText;
  if (body.data.visionText !== undefined) updates.visionText = body.data.visionText;

  const [updated] = await db
    .update(homepageContentTable)
    .set(updates)
    .returning();

  res.json(updated);
});

export default router;
