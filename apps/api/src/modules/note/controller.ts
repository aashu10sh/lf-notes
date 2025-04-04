import { Context } from "hono";
import NoteService from "./service";
import { slugify } from "./utils";
import { randomUUID } from "crypto";
import { NapkinErrors } from "../core/errors";

export default class NoteController {
  constructor(private readonly noteService: NoteService) {}

  createNote = async (c: Context) => {
    const valid: {
      title: string;
      content: string;
      extra: string;
      //@ts-ignore
    } = c.req.valid("json");

    const user = c.get("user");

    const insertData = {
      authorId: user.id,
      title: valid.title,
      content: valid.content,
      extra: valid.extra,
      slug: slugify(valid.title, String(randomUUID())),
    };

    const insertResult = await this.noteService.insertNote(insertData);

    return insertResult.match(
      (data) => {
        return c.json(
          {
            created: data[0].id,
          },
          201,
        );
      },
      (err) => {
        return c.json(
          {
            message: "something went wrong",
            type: err.type,
          },
          500,
        );
      },
    );
  };

  updateNote = async (c: Context) => {
    const valid: {
      title: string;
      content: string;
      //@ts-ignore
    } = c.req.valid("json");
    const user = c.get("user");
    const { noteId } = c.req.param();

    const noteResult = await this.noteService.getNoteById(Number(noteId));

    if (noteResult.isErr()) {
      if (noteResult.error.type == NapkinErrors.NOT_FOUND) {
        return c.json(noteResult.error, 404);
      }
    } else {
      if (noteResult.value.authorId != user.id) {
        return c.json(
          {
            message: "Not Permitted",
            type: NapkinErrors.NOT_ENOUGH_PERMISSIONS,
          },
          403,
        );
      }

      const updated = await this.noteService.updateNote(Number(noteId), valid);

      return c.json({ updated: noteId }, 200);
    }
  };

  deleteNote = async (c: Context) => {
    const { noteId } = c.req.param();
    const user = c.get("user");

    const noteResult = await this.noteService.getNoteById(Number(noteId));

    if (noteResult.isErr()) {
      if (noteResult.error.type == NapkinErrors.NOT_FOUND) {
        return c.json(noteResult.error, 404);
      }
    } else {
      if (noteResult.value.authorId != user.id) {
        return c.json(
          {
            message: "Not Permitted",
            type: NapkinErrors.NOT_ENOUGH_PERMISSIONS,
          },
          403,
        );
      }

      await this.noteService.deleteNote(Number(noteId));

      return c.json({ updated: noteId }, 200);
    }
  };

  getOne = async (c: Context) => {
    const { noteId } = c.req.param();
    const user = c.get("user");

    const noteResult = await this.noteService.getNoteById(Number(noteId));

    if (noteResult.isErr()) {
      if (noteResult.error.type == NapkinErrors.NOT_FOUND) {
        return c.json(noteResult.error, 404);
      }
    } else {
      const note = noteResult.value;
      if (note.authorId != user.id) {
        return c.json(
          {
            message: "Not Permitted",
            type: NapkinErrors.NOT_ENOUGH_PERMISSIONS,
          },
          403,
        );
      }
      return c.json(note);
    }
  };

  getMany = async (c: Context) => {
    const user = c.get("user");

    let { page, limit } = c.req.query();

    if (!page) {
      page = "1";
    }

    if (!limit) {
      limit = "10";
    }

    const notes = await this.noteService.getNoteWithPagination(
      user.id,
      Number(page),
      Number(limit),
    );
    return c.json(notes.value, 200);
  };

  searchByCategories = async (c: Context) => {
    const user: { id: number } = c.get("user");
    // @ts-ignore
    const valid: { categoryIds: number[] } = c.req.valid();

    const notes = await this.noteService.searchByCategories(
      user.id,
      valid.categoryIds,
    );

    if (notes.isErr()) {
      return c.json({
        message: "Error Searching with Categories",
      });
    }

    return c.json(notes.value, 200);
  };
}
