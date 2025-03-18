import { drizzle } from "drizzle-orm/node-postgres";
import Database from "../../models/db";
import { CategoryModel } from "../../models/category";
import { and, desc, eq } from "drizzle-orm";
import { NoteToCategory } from "../../models/note_to_category";

type CategoryInsert = typeof CategoryModel.$inferInsert;

export default class CategoryRepository {
  constructor(private readonly db: ReturnType<typeof drizzle>) {}

  async insertCategory(data: CategoryInsert) {
    return await this.db
      .insert(CategoryModel)
      .values(data)
      .returning({ id: CategoryModel.id });
  }

  async getCategoriesForPost(postId: number, offset: number, limit: number) {
    const result = await this.db
      .select({
        id: CategoryModel.id,
        name: CategoryModel.name,
        createdAt: CategoryModel.createdAt,
        updatedAt: CategoryModel.updatedAt,
        authorId: CategoryModel.authorId,
      })
      .from(NoteToCategory)
      .innerJoin(CategoryModel, eq(NoteToCategory.categoryId, CategoryModel.id))
      .where(eq(NoteToCategory.noteId, postId))
      .offset(offset)
      .limit(limit);

    return result;
  }

  async getCategoryToNote(noteId: number, categoryId: number) {
    return await this.db
      .select({ id: NoteToCategory.id })
      .from(NoteToCategory)
      .where(
        and(
          eq(NoteToCategory.noteId, noteId),
          eq(NoteToCategory.categoryId, categoryId),
        ),
      );
  }

  async addToNote(noteId: number, categoryId: number) {
    return await this.db.insert(NoteToCategory).values({
      noteId: noteId,
      categoryId: categoryId,
    });
  }

  async deleteFromNote(noteId: number, categoryId: number) {
    return await this.db
      .delete(NoteToCategory)
      .where(
        and(
          eq(NoteToCategory.noteId, noteId),
          eq(NoteToCategory.categoryId, categoryId),
        ),
      );
  }

  async getCategories(offset: number, take: number, authorId: number) {
    return await this.db
      .select({
        id: CategoryModel.id,
        name: CategoryModel.name,
        createdAt: CategoryModel.createdAt,
        updatedAt: CategoryModel.updatedAt,
        authorId: CategoryModel.authorId,
      })
      .from(CategoryModel)
      .where(
        and(
          eq(CategoryModel.authorId, authorId),
          eq(CategoryModel.deleted, false),
        ),
      )
      .orderBy(desc(CategoryModel.updatedAt))
      .limit(take)
      .offset(offset);
  }

  async getCategory(id: number) {
    return await this.db
      .select()
      .from(CategoryModel)
      .where(and(eq(CategoryModel.id, id), eq(CategoryModel.deleted, false)))
      .limit(1);
  }

  async deleteCategory(categoryId: number) {
    return await this.db
      .update(CategoryModel)
      .set({ deleted: true })
      .where(eq(CategoryModel.id, categoryId));
  }

  async updateCategory(categoryId: number, newData: object) {
    return await this.db
      .update(CategoryModel)
      .set(newData)
      .where(eq(CategoryModel.id, categoryId));
  }

  static NewCategoryRepository() {
    return new CategoryRepository(Database.getInstance().getDb());
  }
}
