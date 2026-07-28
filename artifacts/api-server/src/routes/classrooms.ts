import { Router } from "express";
import { db, classroomsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreateClassroomBody,
  UpdateClassroomParams,
  UpdateClassroomBody,
  DeleteClassroomParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/classrooms", async (_req, res) => {
  const items = await db
    .select()
    .from(classroomsTable)
    .orderBy(asc(classroomsTable.order));
  res.json(items);
});

router.post("/classrooms", async (req, res) => {
  const body = CreateClassroomBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [item] = await db
    .insert(classroomsTable)
    .values({
      name: body.data.name,
      nameRu: body.data.nameRu ?? null,
      description: body.data.description ?? null,
      descriptionRu: body.data.descriptionRu ?? null,
      imageUrl: body.data.imageUrl,
      capacity: body.data.capacity ?? null,
      order: body.data.order ?? 0,
    })
    .returning();
  res.status(201).json(item);
});

router.patch("/classrooms/:id", async (req, res) => {
  const params = UpdateClassroomParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const body = UpdateClassroomBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const updates: Record<string, unknown> = {};
  if (body.data.name !== undefined) updates.name = body.data.name;
  if (body.data.nameRu !== undefined) updates.nameRu = body.data.nameRu;
  if (body.data.description !== undefined) updates.description = body.data.description;
  if (body.data.descriptionRu !== undefined) updates.descriptionRu = body.data.descriptionRu;
  if (body.data.imageUrl !== undefined) updates.imageUrl = body.data.imageUrl;
  if (body.data.capacity !== undefined) updates.capacity = body.data.capacity;
  if (body.data.order !== undefined) updates.order = body.data.order;

  const [updated] = await db
    .update(classroomsTable)
    .set(updates)
    .where(eq(classroomsTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated);
});

router.delete("/classrooms/:id", async (req, res) => {
  const params = DeleteClassroomParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(classroomsTable).where(eq(classroomsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
