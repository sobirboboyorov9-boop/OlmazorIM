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
  try {
    const items = await db
      .select()
      .from(teachersTable)
      .where(eq(teachersTable.isActive, true))
      .orderBy(asc(teachersTable.order));

    return res.json(items);
  } catch (err) {
    console.error("GET /teachers error:", err);
    return res.status(500).json({ error: String(err) });
  }
});

router.get("/teachers/:id", async (req, res) => {
  try {
    const params = GetTeacherParams.safeParse({ id: Number(req.params.id) });

    if (!params.success) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const [teacher] = await db
      .select()
      .from(teachersTable)
      .where(eq(teachersTable.id, params.data.id));

    if (!teacher) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(teacher);
  } catch (err) {
    console.error("GET /teachers/:id error:", err);
    return res.status(500).json({ error: String(err) });
  }
});

router.post("/teachers", async (req, res) => {
  try {
    const body = CreateTeacherBody.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({ error: body.error.message });
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

    return res.status(201).json(teacher);
  } catch (err) {
    console.error("POST /teachers error:", err);
    return res.status(500).json({ error: String(err) });
  }
});

router.patch("/teachers/:id", async (req, res) => {
  try {
    const params = UpdateTeacherParams.safeParse({ id: Number(req.params.id) });

    if (!params.success) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const body = UpdateTeacherBody.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({ error: body.error.message });
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
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(updated);
  } catch (err) {
    console.error("PATCH /teachers error:", err);
    return res.status(500).json({ error: String(err) });
  }
});

router.delete("/teachers/:id", async (req, res) => {
  try {
    const params = DeleteTeacherParams.safeParse({ id: Number(req.params.id) });

    if (!params.success) {
      return res.status(400).json({ error: "Invalid id" });
    }

    await db.delete(teachersTable).where(eq(teachersTable.id, params.data.id));

    return res.status(204).send();
  } catch (err) {
    console.error("DELETE /teachers error:", err);
    return res.status(500).json({ error: String(err) });
  }
});

export default router;