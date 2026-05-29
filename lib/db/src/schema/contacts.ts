import { pgTable, serial, text, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contactsTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  addressRu: text("address_ru"),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  workingHours: text("working_hours").notNull(),
  mapLat: doublePrecision("map_lat"),
  mapLng: doublePrecision("map_lng"),
  facebook: text("facebook"),
  telegram: text("telegram"),
  instagram: text("instagram"),
  youtube: text("youtube"),
});

export const insertContactsSchema = createInsertSchema(contactsTable).omit({ id: true });
export type InsertContacts = z.infer<typeof insertContactsSchema>;
export type Contacts = typeof contactsTable.$inferSelect;
