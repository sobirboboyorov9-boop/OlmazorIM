import { Router } from "express";
import { db, teachersTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreateTeacherBody,
  GetTeacherParams,
  UpdateTeacherParams,
  UpdateTeacherBody,
  DeleteTeacherParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/teachers", async (_req, res) => {
  const items = await db
    .select()
    .from(teachersTable)
    .where(eq(teachersTable.isActive, true))
    .orderBy(asc(teachersTable.order));
  res.json(items);
});

router.get("/teachers/:id", async (req, res) => {
  const params = GetTeacherParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [teacher] = await db
    .select()
    .from(teachersTable)
    .where(eq(teachersTable.id, params.data.id));
  if (!teacher) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(teacher);
});

router.post("/teachers", async (req, res) => {
  const body = CreateTeacherBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [teacher] = await db
    .insert(teachersTable)
    .values({
      name: body.data.name,
      nameRu: body.data.nameRu ?? null,
      subject: body.data.subject,
      subjectRu: body.data.subjectRu ?? null,
      photo: body.data.photo ?? null,
      bio: body.data.bio ?? null,
      bioRu: body.data.bioRu ?? null,
      experience: body.data.experience ?? 0,
      phone: body.data.phone ?? null,
      email: body.data.email ?? null,
      order: body.data.order ?? 0,
      isActive: body.data.isActive ?? true,
    })
    .returning();
  res.status(201).json(teacher);
});

router.patch("/teachers/:id", async (req, res) => {
  const params = UpdateTeacherParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const body = UpdateTeacherBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const updates: Record<string, unknown> = {};
  if (body.data.name !== undefined) updates.name = body.data.name;
  if (body.data.nameRu !== undefined) updates.nameRu = body.data.nameRu;
  if (body.data.subject !== undefined) updates.subject = body.data.subject;
  if (body.data.subjectRu !== undefined) updates.subjectRu = body.data.subjectRu;
  if (body.data.photo !== undefined) updates.photo = body.data.photo;
  if (body.data.bio !== undefined) updates.bio = body.data.bio;
  if (body.data.bioRu !== undefined) updates.bioRu = body.data.bioRu;
  if (body.data.experience !== undefined) updates.experience = body.data.experience;
  if (body.data.phone !== undefined) updates.phone = body.data.phone;
  if (body.data.email !== undefined) updates.email = body.data.email;
  if (body.data.order !== undefined) updates.order = body.data.order;
  if (body.data.isActive !== undefined) updates.isActive = body.data.isActive;

  const [updated] = await db
    .update(teachersTable)
    .set(updates)
    .where(eq(teachersTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(updated);
});

router.delete("/teachers/:id", async (req, res) => {
  const params = DeleteTeacherParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(teachersTable).where(eq(teachersTable.id, params.data.id));
  res.status(204).send();
});

export default router;
