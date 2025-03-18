import { drizzle } from "drizzle-orm/node-postgres";
import Database from "../../models/db";
import { and, desc, eq, inArray } from "drizzle-orm";
import { NoteModel } from "../../models/note";
import { NoteToCategory } from "../../models/note_to_category";
import { CategoryModel } from "../../models/category";

type NoteInsert = typeof NoteModel.$inferInsert;

export default class NoteRepository {
  constructor(private readonly db: ReturnType<typeof drizzle>) {}

  async insertNote(data: NoteInsert) {
    return await this.db
      .insert(NoteModel)
      .values(data)
      .returning({ id: NoteModel.id });
  }

  async getNotes(offset: number, take: number, authorId: number) {
    return await this.db
      .select({
        id: NoteModel.id,
        title: NoteModel.title,
        slug: NoteModel.slug,
        createdAt: NoteModel.createdAt,
        updatedAt: NoteModel.updatedAt,
        extra: NoteModel.extra,
      })
      .from(NoteModel)
      .where(
        and(eq(NoteModel.authorId, authorId), eq(NoteModel.deleted, false)),
      )
      .orderBy(desc(NoteModel.updatedAt))
      .limit(take)
      .offset(offset);
  }

  async getNote(id: number) {
    return await this.db
      .select()
      .from(NoteModel)
      .where(and(eq(NoteModel.id, id), eq(NoteModel.deleted, false)))
      .limit(1);
  }

  async deleteNote(noteId: number) {
    return await this.db
      .update(NoteModel)
      .set({ deleted: true })
      .where(eq(NoteModel.id, noteId));
  }

  async updateNote(noteId: number, newData: object) {
    return await this.db
      .update(NoteModel)
      .set(newData)
      .where(eq(NoteModel.id, noteId));
  }
  async getNotesByCategoryIdsAndUserId(categoryIds: number[], userId: number) {
    return await this.db
      .select()
      .from(NoteModel)
      .where(
        and(
          inArray(
            NoteModel.id,
            this.db
              .select({ noteId: NoteToCategory.noteId })
              .from(NoteToCategory)
              .innerJoin(
                CategoryModel,
                eq(NoteToCategory.categoryId, CategoryModel.id),
              )
              .where(
                and(
                  inArray(NoteToCategory.categoryId, categoryIds),
                  eq(CategoryModel.authorId, userId),
                  eq(CategoryModel.deleted, false),
                ),
              ),
          ),
          eq(NoteModel.authorId, userId),
          eq(NoteModel.deleted, false),
        ),
      )
      .orderBy(desc(NoteModel.updatedAt));
  }

  static NewNoteRepository() {
    return new NoteRepository(Database.getInstance().getDb());
  }
}
