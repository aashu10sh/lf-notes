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

  static async NewNoteService() {
    return new NoteService(NoteRepository.NewNoteRepository());
  }
}
