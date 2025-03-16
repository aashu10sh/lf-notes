import { Context } from "hono";
import NoteService from "./service";
import { slugify } from "./utils";

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
      slug: slugify(valid.title, String(user.id)),
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

  updateNote = async (c: Context) => {};

  deleteNote = async (c: Context) => {};

  getOne = async (c: Context) => {};

  getMany = async (c: Context) => {};
}
