import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { UserModel } from "./user";

export const CategoryModel = pgTable("categories", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deleted: boolean().default(false),
  authorId: integer("author_id").references(() => UserModel.id, {
    onDelete: "cascade",
  }),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const categoryRelations = relations(CategoryModel, ({ one }) => ({
  author: one(UserModel, {
    fields: [CategoryModel.authorId],
    references: [UserModel.id],
  }),
}));
