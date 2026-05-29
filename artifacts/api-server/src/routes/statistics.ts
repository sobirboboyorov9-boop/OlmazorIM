import { Router } from "express";
import { db, statisticsTable } from "@workspace/db";
import { UpdateStatisticsBody } from "@workspace/api-zod";

const router = Router();

router.get("/statistics", async (_req, res) => {
  const [stats] = await db.select().from(statisticsTable).limit(1);

  if (!stats) {
    const [created] = await db
      .insert(statisticsTable)
      .values({
        students: 15000,
        professors: 850,
        departments: 12,
        years: 75,
        programs: 80,
        partners: 120,
      })
      .returning();
    res.json(created);
    return;
  }

  res.json(stats);
});

router.patch("/statistics", async (req, res) => {
  const body = UpdateStatisticsBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [existing] = await db.select().from(statisticsTable).limit(1);

  if (!existing) {
    const [created] = await db
      .insert(statisticsTable)
      .values({
        students: body.data.students ?? 0,
        professors: body.data.professors ?? 0,
        departments: body.data.departments ?? 0,
        years: body.data.years ?? 0,
        programs: body.data.programs ?? 0,
        partners: body.data.partners ?? 0,
      })
      .returning();
    res.json(created);
    return;
  }

  const updates: Record<string, unknown> = {};
  if (body.data.students !== undefined) updates.students = body.data.students;
  if (body.data.professors !== undefined) updates.professors = body.data.professors;
  if (body.data.departments !== undefined) updates.departments = body.data.departments;
  if (body.data.years !== undefined) updates.years = body.data.years;
  if (body.data.programs !== undefined) updates.programs = body.data.programs;
  if (body.data.partners !== undefined) updates.partners = body.data.partners;

  const [updated] = await db
    .update(statisticsTable)
    .set(updates)
    .returning();

  res.json(updated);
});

export default router;
