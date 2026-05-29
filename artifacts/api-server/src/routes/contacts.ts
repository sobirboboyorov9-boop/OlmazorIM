import { Router } from "express";
import { db, contactsTable } from "@workspace/db";
import { UpdateContactsBody } from "@workspace/api-zod";

const router = Router();

const DEFAULT_CONTACTS = {
  address: "Nukus shahrida, Alberuni ko'chasi, 1",
  addressRu: "г. Нукус, ул. Алберуни, 1",
  phone: "+998 61 222-22-22",
  email: "info@alberuni.uz",
  workingHours: "Du-Ju: 9:00 - 18:00",
  mapLat: 42.4608,
  mapLng: 59.6166,
  facebook: "https://facebook.com/alberuni.uz",
  telegram: "https://t.me/alberuni_uz",
  instagram: "https://instagram.com/alberuni.uz",
  youtube: null,
};

router.get("/contacts", async (_req, res) => {
  const [contacts] = await db.select().from(contactsTable).limit(1);

  if (!contacts) {
    const [created] = await db
      .insert(contactsTable)
      .values(DEFAULT_CONTACTS)
      .returning();
    res.json(created);
    return;
  }

  res.json(contacts);
});

router.patch("/contacts", async (req, res) => {
  const body = UpdateContactsBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [existing] = await db.select().from(contactsTable).limit(1);

  if (!existing) {
    const [created] = await db
      .insert(contactsTable)
      .values({ ...DEFAULT_CONTACTS, ...body.data })
      .returning();
    res.json(created);
    return;
  }

  const updates: Record<string, unknown> = {};
  if (body.data.address !== undefined) updates.address = body.data.address;
  if (body.data.addressRu !== undefined) updates.addressRu = body.data.addressRu;
  if (body.data.phone !== undefined) updates.phone = body.data.phone;
  if (body.data.email !== undefined) updates.email = body.data.email;
  if (body.data.workingHours !== undefined) updates.workingHours = body.data.workingHours;
  if (body.data.mapLat !== undefined) updates.mapLat = body.data.mapLat;
  if (body.data.mapLng !== undefined) updates.mapLng = body.data.mapLng;
  if (body.data.facebook !== undefined) updates.facebook = body.data.facebook;
  if (body.data.telegram !== undefined) updates.telegram = body.data.telegram;
  if (body.data.instagram !== undefined) updates.instagram = body.data.instagram;
  if (body.data.youtube !== undefined) updates.youtube = body.data.youtube;

  const [updated] = await db
    .update(contactsTable)
    .set(updates)
    .returning();

  res.json(updated);
});

export default router;
