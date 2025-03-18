import { err, ok, Result } from "neverthrow";
import { ApiClient, ApiError } from "../api/client";

export interface Category {
  authorId: number;
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export default class CategoryController extends ApiClient {
  async getCategories(): Promise<Result<Category[], ApiError>> {
    try {
      const data = await fetch(this.getUrl("category"), {
        method: "GET",
        headers: this.getHeaders(),
      }).then((res) => this.handleResponse<Category[]>(res));

      return ok(data);
    } catch (error) {
      return err(error as ApiError);
    }
  }

  async addCategoryToNote(
    categoryId: number,
    noteId: number,
  ): Promise<Result<any, ApiError>> {
    try {
      const data = await fetch(this.getUrl(`category/${noteId}`), {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ categoryId: Number(categoryId) }),
      }).then((res) => this.handleResponse<any>(res));

      return ok(data);
    } catch (error) {
      return err(error as ApiError);
    }
  }

  async removeCategoryFromNote(
    categoryId: number,
    noteId: number,
  ): Promise<Result<any, ApiError>> {
    try {
      const data = await fetch(this.getUrl(`category/${noteId}`), {
        method: "DELETE",
        headers: this.getHeaders(),
        body: JSON.stringify({ categoryId: Number(categoryId) }),
      }).then((res) => this.handleResponse<any>(res));

      return ok(data);
    } catch (error) {
      return err(error as ApiError);
    }
  }

  async createCategory(name: string): Promise<Result<any, ApiError>> {
    try {
      const data = await fetch(this.getUrl("category"), {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ name }),
      }).then((res) => this.handleResponse<any>(res));

      return ok(data);
    } catch (error) {
      return err(error as ApiError);
    }
  }
}
