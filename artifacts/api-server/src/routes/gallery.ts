import { Router } from "express";
import { db, galleryTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreateGalleryImageBody,
  DeleteGalleryImageParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/gallery", async (_req, res) => {
  const images = await db
    .select()
    .from(galleryTable)
    .orderBy(asc(galleryTable.order));

  res.json(images);
});

router.post("/gallery", async (req, res) => {
  const body = CreateGalleryImageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [image] = await db
    .insert(galleryTable)
    .values({
      imageUrl: body.data.imageUrl,
      caption: body.data.caption ?? null,
      order: body.data.order ?? 0,
    })
    .returning();

  res.status(201).json(image);
});

router.delete("/gallery/:id", async (req, res) => {
  const params = DeleteGalleryImageParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(galleryTable).where(eq(galleryTable.id, params.data.id));
  res.status(204).send();
});

export default router;
