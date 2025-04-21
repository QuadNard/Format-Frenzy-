import { pgTable, serial, varchar, timestamp, jsonb, } from "drizzle-orm/pg-core";

export const snippets = pgTable("snippets", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    metadata: jsonb("metadata").notNull(),                      // JSONB column
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
