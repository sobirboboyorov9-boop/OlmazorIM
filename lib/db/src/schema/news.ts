import { pgTable, serial, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const newsTable = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleRu: text("title_ru"),
  titleEn: text("title_en"),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("general"),
  imageUrl: text("image_url"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNewsSchema = createInsertSchema(newsTable).omit({ id: true, createdAt: true });
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof newsTable.$inferSelect;


