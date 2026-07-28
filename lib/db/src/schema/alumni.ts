import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const alumniTable = pgTable("alumni", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameRu: text("name_ru"),
  graduationYear: integer("graduation_year").notNull(),
  achievement: text("achievement").notNull(),
  achievementRu: text("achievement_ru"),
  photo: text("photo"),
  bio: text("bio"),
  bioRu: text("bio_ru"),
  currentPosition: text("current_position"),
  currentPositionRu: text("current_position_ru"),
  order: integer("order").notNull().default(0),
});

export const insertAlumniSchema = createInsertSchema(alumniTable).omit({ id: true });
export type InsertAlumni = z.infer<typeof insertAlumniSchema>;
export type Alumni = typeof alumniTable.$inferSelect;
