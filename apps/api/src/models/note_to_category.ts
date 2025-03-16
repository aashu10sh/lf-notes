import { NoteModel } from "./note";
import { CategoryModel } from "./category";
import { relations } from "drizzle-orm";
import { integer, pgTable } from "drizzle-orm/pg-core";

export const NoteToCategory = pgTable("note_category_linked_table", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  noteId: integer("note_id")
    .references(() => NoteModel.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: integer("category_id")
    .references(() => CategoryModel.id, { onDelete: "cascade" })
    .notNull(),
});

export const categoriesToNotes = relations(NoteToCategory, ({ one }) => ({
  category: one(CategoryModel, {
    fields: [NoteToCategory.noteId],
    references: [CategoryModel.id],
  }),
  user: one(NoteModel, {
    fields: [NoteToCategory.noteId],
    references: [NoteModel.id],
  }),
}));
