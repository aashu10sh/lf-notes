import { Context } from "hono";
import CategoryService from "./service";

export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async getUsersCategories(c: Context) {
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
  }

  async createCategory(c: Context) {
    const user: { id: number } = c.get("user");

    const valid: {
      title: string;
      content: string;
      extra: string;
      //@ts-ignore
    } = c.req.valid("json");
  }

  async getPostsCategories(postId: number){}
}
