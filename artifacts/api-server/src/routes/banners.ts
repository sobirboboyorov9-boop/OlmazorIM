import { Router } from "express";
import { db, bannersTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreateBannerBody,
  UpdateBannerParams,
  UpdateBannerBody,
  DeleteBannerParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/banners", async (_req, res) => {
  const banners = await db
    .select()
    .from(bannersTable)
    .where(eq(bannersTable.isActive, true))
    .orderBy(asc(bannersTable.order));

  res.json(banners);
});

router.post("/banners", async (req, res) => {
  const body = CreateBannerBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [banner] = await db
    .insert(bannersTable)
    .values({
      title: body.data.title,
      subtitle: body.data.subtitle ?? null,
      imageUrl: body.data.imageUrl,
      linkUrl: body.data.linkUrl ?? null,
      order: body.data.order ?? 0,
      isActive: body.data.isActive ?? true,
    })
    .returning();

  res.status(201).json(banner);
});

router.patch("/banners/:id", async (req, res) => {
  const params = UpdateBannerParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const body = UpdateBannerBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (body.data.title !== undefined) updates.title = body.data.title;
  if (body.data.subtitle !== undefined) updates.subtitle = body.data.subtitle;
  if (body.data.imageUrl !== undefined) updates.imageUrl = body.data.imageUrl;
  if (body.data.linkUrl !== undefined) updates.linkUrl = body.data.linkUrl;
  if (body.data.order !== undefined) updates.order = body.data.order;
  if (body.data.isActive !== undefined) updates.isActive = body.data.isActive;

  const [updated] = await db
    .update(bannersTable)
    .set(updates)
    .where(eq(bannersTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(updated);
});

router.delete("/banners/:id", async (req, res) => {
  const params = DeleteBannerParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(bannersTable).where(eq(bannersTable.id, params.data.id));
  res.status(204).send();
});

export default router;
