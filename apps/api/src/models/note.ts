import {
  boolean,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { UserModel } from "./user";
import { relations } from "drizzle-orm";

export const NoteModel = pgTable("notes", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  title: varchar().notNull(),
  slug: varchar(),
  content: text(),
  authorId: integer("author_id")
    .references(() => UserModel.id, { onDelete: "cascade" })
    .notNull(),
  extra: json(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  deleted: boolean().default(false),
});

export const noteRelations = relations(NoteModel, ({ one }) => ({
  author: one(UserModel, {
    fields: [NoteModel.authorId],
    references: [UserModel.id],
  }),
}));
