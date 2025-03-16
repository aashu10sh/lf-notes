import { drizzle } from "drizzle-orm/node-postgres";
import Database from "../../models/db";
import { NoteModel } from "../../models/note";

type NoteInsert = typeof NoteModel.$inferInsert;

export default class NoteRepository {
  constructor(private readonly db: ReturnType<typeof drizzle>) {}

  async insertNote(data: NoteInsert) {
    return await this.db
      .insert(NoteModel)
      .values(data)
      .returning({ id: NoteModel.id });
  }

  static NewNoteRepository() {
    return new NoteRepository(Database.getInstance().getDb());
  }
}
