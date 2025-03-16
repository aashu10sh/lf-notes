import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const CategoryModel = pgTable("categories", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
