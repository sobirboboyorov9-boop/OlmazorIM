import { Router } from "express";
import { db, newsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import {
  ListNewsQueryParams,
  CreateNewsArticleBody,
  GetNewsArticleParams,
  UpdateNewsArticleParams,
  UpdateNewsArticleBody,
  DeleteNewsArticleParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/news", async (req, res) => {
  const query = ListNewsQueryParams.safeParse(req.query);
  const page = query.success && query.data.page ? query.data.page : 1;
  const limit = query.success && query.data.limit ? query.data.limit : 12;
  const category = query.success ? query.data.category : undefined;

  const offset = (page - 1) * limit;

  const where = category ? eq(newsTable.category, category) : undefined;

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(newsTable)
      .where(where)
      .orderBy(desc(newsTable.publishedAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(newsTable)
      .where(where),
  ]);

  res.json({ items, total: Number(countResult[0].count) });
});

router.get("/news/featured", async (_req, res) => {
  const items = await db
    .select()
    .from(newsTable)
    .where(eq(newsTable.isFeatured, true))
    .orderBy(desc(newsTable.publishedAt))
    .limit(6);

  if (items.length === 0) {
    const latest = await db
      .select()
      .from(newsTable)
      .orderBy(desc(newsTable.publishedAt))
      .limit(6);
    res.json(latest);
    return;
  }

  res.json(items);
});

router.get("/news/:id", async (req, res) => {
  const params = GetNewsArticleParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [article] = await db
    .select()
    .from(newsTable)
    .where(eq(newsTable.id, params.data.id));

  if (!article) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(article);
});

router.post("/news", async (req, res) => {
  const body = CreateNewsArticleBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [article] = await db
    .insert(newsTable)
    .values({
      title: body.data.title,
      titleRu: body.data.titleRu ?? null,
      titleEn: body.data.titleEn ?? null,
      excerpt: body.data.excerpt,
      content: body.data.content,
      category: body.data.category,
      imageUrl: body.data.imageUrl ?? null,
      isFeatured: body.data.isFeatured ?? false,
    })
    .returning();

  res.status(201).json(article);
});

router.patch("/news/:id", async (req, res) => {
  const params = UpdateNewsArticleParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const body = UpdateNewsArticleBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (body.data.title !== undefined) updates.title = body.data.title;
  if (body.data.titleRu !== undefined) updates.titleRu = body.data.titleRu;
  if (body.data.titleEn !== undefined) updates.titleEn = body.data.titleEn;
  if (body.data.excerpt !== undefined) updates.excerpt = body.data.excerpt;
  if (body.data.content !== undefined) updates.content = body.data.content;
  if (body.data.category !== undefined) updates.category = body.data.category;
  if (body.data.imageUrl !== undefined) updates.imageUrl = body.data.imageUrl;
  if (body.data.isFeatured !== undefined) updates.isFeatured = body.data.isFeatured;

  const [updated] = await db
    .update(newsTable)
    .set(updates)
    .where(eq(newsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(updated);
});

router.delete("/news/:id", async (req, res) => {
  const params = DeleteNewsArticleParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(newsTable).where(eq(newsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
