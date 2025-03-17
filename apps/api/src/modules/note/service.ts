import { err, ok } from "neverthrow";
import NoteRepository from "./repository";
import { NapkinErrors } from "../core/errors";

export default class NoteService {
  constructor(private readonly noteRepository: NoteRepository) {}

  async insertNote(noteData: {
    title: string;
    content: string;
    extra: string;
    authorId: number;
  }) {
    try {
      const inserted = await this.noteRepository.insertNote(noteData);
      return ok(inserted);
    } catch (e) {
      return err({
        type: NapkinErrors.UNKNOWN,
      });
    }
  }

  async getNoteWithPagination(autorId: number, page: number, limit: number) {
    const offset = limit * (page - 1);

    const data = await this.noteRepository.getNotes(offset, limit, autorId);
    return ok(data);
  }

  async getNoteById(id: number) {
    const data = await this.noteRepository.getNote(id);

    if (data.length == 0) {
      return err({
        message: "Not Found",
        type: NapkinErrors.NOT_FOUND,
      });
    }

    return ok(data[0]);
  }

  static async NewNoteService() {
    return new NoteService(NoteRepository.NewNoteRepository());
  }
}
