import { Router } from "express";
import { db, alumniTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreateAlumniBody,
  UpdateAlumniParams,
  UpdateAlumniBody,
  DeleteAlumniParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/alumni", async (_req, res) => {
  const items = await db
    .select()
    .from(alumniTable)
    .orderBy(asc(alumniTable.order));
  res.json(items);
});

router.post("/alumni", async (req, res) => {
  const body = CreateAlumniBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [item] = await db
    .insert(alumniTable)
    .values({
      name: body.data.name,
      nameRu: body.data.nameRu ?? null,
      graduationYear: body.data.graduationYear,
      achievement: body.data.achievement,
      achievementRu: body.data.achievementRu ?? null,
      photo: body.data.photo ?? null,
      bio: body.data.bio ?? null,
      bioRu: body.data.bioRu ?? null,
      currentPosition: body.data.currentPosition ?? null,
      currentPositionRu: body.data.currentPositionRu ?? null,
      order: body.data.order ?? 0,
    })
    .returning();
  res.status(201).json(item);
});

router.patch("/alumni/:id", async (req, res) => {
  const params = UpdateAlumniParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const body = UpdateAlumniBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const updates: Record<string, unknown> = {};
  if (body.data.name !== undefined) updates.name = body.data.name;
  if (body.data.nameRu !== undefined) updates.nameRu = body.data.nameRu;
  if (body.data.graduationYear !== undefined) updates.graduationYear = body.data.graduationYear;
  if (body.data.achievement !== undefined) updates.achievement = body.data.achievement;
  if (body.data.achievementRu !== undefined) updates.achievementRu = body.data.achievementRu;
  if (body.data.photo !== undefined) updates.photo = body.data.photo;
  if (body.data.bio !== undefined) updates.bio = body.data.bio;
  if (body.data.bioRu !== undefined) updates.bioRu = body.data.bioRu;
  if (body.data.currentPosition !== undefined) updates.currentPosition = body.data.currentPosition;
  if (body.data.currentPositionRu !== undefined) updates.currentPositionRu = body.data.currentPositionRu;
  if (body.data.order !== undefined) updates.order = body.data.order;

  const [updated] = await db
    .update(alumniTable)
    .set(updates)
    .where(eq(alumniTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated);
});

router.delete("/alumni/:id", async (req, res) => {
  const params = DeleteAlumniParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(alumniTable).where(eq(alumniTable.id, params.data.id));
  res.status(204).send();
});

export default router;
