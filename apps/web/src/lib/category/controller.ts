import { err, ok } from "neverthrow";
import { BACKEND_URL } from "../constants";

export interface Category {
  authorId: number;
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export default class CategoryController {
  async getCategories() {
    const response = await fetch(`${BACKEND_URL}/api/v1/category`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      return err({
        message: "Something went wrong fetching categories",
      });
    }
    const data: Category[] = await response.json();
    return ok(data);
  }

  async addCategoryToNote(categoryId: number, noteId: number) {
    const response = await fetch(`${BACKEND_URL}/api/v1/category/${noteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ categoryId: Number(categoryId) }),
    });

    if (!response.ok) {
      return err({
        message: "Something went wrong adding category to note",
      });
    }
    const data = await response.json();
    return ok(data);
  }

  async removeCategoryFromNote(categoryId: number, noteId: number) {
    const response = await fetch(`${BACKEND_URL}/api/v1/category/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ categoryId: Number(categoryId) }),
    });

    if (!response.ok) {
      return err({
        message: "Something went wrong removing category from note",
      });
    }
    const data = await response.json();
    return ok(data);
  }

  async createCategory(name: string) {
    const response = await fetch(`${BACKEND_URL}/api/v1/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      return err({
        message: "Something went wrong creating new category",
      });
    }
    const data = await response.json();
    return ok(data);
  }
} 