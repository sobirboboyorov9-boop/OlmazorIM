import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const statisticsTable = pgTable("statistics", {
  id: serial("id").primaryKey(),
  students: integer("students").notNull().default(0),
  professors: integer("professors").notNull().default(0),
  departments: integer("departments").notNull().default(0),
  years: integer("years").notNull().default(0),
  programs: integer("programs").notNull().default(0),
  partners: integer("partners").notNull().default(0),
});

export const insertStatisticsSchema = createInsertSchema(statisticsTable).omit({ id: true });
export type InsertStatistics = z.infer<typeof insertStatisticsSchema>;
export type Statistics = typeof statisticsTable.$inferSelect;
