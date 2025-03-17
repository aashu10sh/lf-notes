import { drizzle } from "drizzle-orm/node-postgres";
import Database from "../../models/db";
import { NoteModel } from "../../models/note";
import { desc, eq } from "drizzle-orm";

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
      .where(eq(NoteModel.authorId, authorId))
      .orderBy(desc(NoteModel.updatedAt))
      .limit(take)
      .offset(offset);
  }

  async getNote(id: number) {
    return await this.db
      .select()
      .from(NoteModel)
      .where(eq(NoteModel.id, id))
      .limit(1);
  }

  static NewNoteRepository() {
    return new NoteRepository(Database.getInstance().getDb());
  }
}
