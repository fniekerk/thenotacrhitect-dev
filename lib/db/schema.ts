import { pgTable, serial, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export interface TocEntry {
  title: string;
  url: string;
  depth: number;
  items?: TocEntry[];
}

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  content: text("content").notNull(), // raw MDX
  published: boolean("published").default(true).notNull(),
  tags: text("tags").array().default([]).notNull(),
  author: text("author"),
  image: text("image"),
  toc: jsonb("toc").$type<TocEntry[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
