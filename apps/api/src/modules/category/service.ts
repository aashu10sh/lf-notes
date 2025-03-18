import { err, ok } from "neverthrow";
import CategoryRepository from "./repository";
import { NapkinErrors } from "../core/errors";

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

  async createCategory(noteData: { name: string; authorId: number }) {
    try {
      const inserted = await this.categoryRepository.insertCategory(noteData);
      return ok(inserted);
    } catch (e) {
      return err({
        type: NapkinErrors.UNKNOWN,
      });
    }
  }

  async getCategoryOfPost(noteId: number, page: number, limit: number) {
    const offset = limit * (page - 1);

    const data = await this.categoryRepository.getCategoriesForPost(
      noteId,
      offset,
      limit
    );

    return ok(data);
  }

  static NewCategoryServices() {
    return new CategoryService(CategoryRepository.NewCategoryRepository());
  }
}
