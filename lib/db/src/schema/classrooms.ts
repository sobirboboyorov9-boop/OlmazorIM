import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const classroomsTable = pgTable("classrooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameRu: text("name_ru"),
  description: text("description"),
  descriptionRu: text("description_ru"),
  imageUrl: text("image_url").notNull(),
  capacity: integer("capacity"),
  order: integer("order").notNull().default(0),
});

export const insertClassroomSchema = createInsertSchema(classroomsTable).omit({ id: true });
export type InsertClassroom = z.infer<typeof insertClassroomSchema>;
export type Classroom = typeof classroomsTable.$inferSelect;
