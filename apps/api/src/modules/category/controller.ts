import { Context } from "hono";
import CategoryService from "./service";

export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  getUsersCategories = async (c: Context) => {
    const user = c.get("user");

    let { page, limit } = c.req.query();

    if (!page) {
      page = "1";
    }

    if (!limit) {
      limit = "10";
    }

    const categories = await this.categoryService.getNoteWithPagination(
      user.id,
      Number(page),
      Number(limit),
    );
    return c.json(categories.value, 200);
  };

  createCategory = async (c: Context) => {
    const user: { id: number } = c.get("user");

    const valid: {
      name: string;
      //@ts-ignore
    } = c.req.valid("json");

    const toInsert = {
      name: valid.name,
      authorId: user.id,
    };

    const insertResult = await this.categoryService.createCategory(toInsert);

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

  getNoteCategories = async (c: Context) => {
    const user = c.get("user");
    const { noteId } = c.req.param();

    let { page, limit } = c.req.query();

    if (!page) {
      page = "1";
    }

    if (!limit) {
      limit = "10";
    }

    const categories = await this.categoryService.getCategoryOfPost(
      Number(noteId),
      Number(page),
      Number(limit),
    );
    if (categories.isErr()) {
      return c.json({ message: "something went wrong" }, 500);
    }
    return c.json(categories.value, 200);
  };

  addCategoryToNote = async (c: Context) => {
    const user: { id: number } = c.get("user");
    const { noteId } = c.req.param();
    const data: { categoryId: number } = await c.req.json();

    const added = await this.categoryService.addToNote(
      Number(noteId),
      data.categoryId,
    );

    if (added.isErr()) {
      return c.json({ message: "Error adding Category to Note" }, 500);
    }

    return c.json({ created: added.value.rowCount }, 201);
  };

  deleteCategoryFromNote = async (c: Context) => {
    const user: { id: number } = c.get("user");
    const { noteId } = c.req.param();
    const data: { categoryId: number } = await c.req.json();

    const removed = await this.categoryService.deleteFromNote(
      Number(noteId),
      data.categoryId,
    );

    if (removed.isErr()) {
      return c.json({ message: "Error deleting Category to Note" }, 500);
    }
    return c.json({ created: removed.value.rowCount }, 201);
  };
}
