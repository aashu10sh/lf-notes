import { ok } from "neverthrow";
import CategoryRepository from "./repository";

export default class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getNoteWithPagination(autorId: number, page: number, limit: number) {
    const offset = limit * (page - 1);

    const data = await this.categoryRepository.getCategories(
      offset,
      limit,
      autorId,
    );
    return ok(data);
  }

  static async NewCategoryServices() {
    return new CategoryService(CategoryRepository.NewCategoryRepository());
  }
}
