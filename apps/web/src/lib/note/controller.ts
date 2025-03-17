import { err, ok } from "neverthrow";
import { BACKEND_URL } from "../constants";

export interface Note {
  id: number;
  title: string;
  slug: string | null;
  createdAt: Date;
  updatedAt: Date;
  content?: string;
  extra: any;
}

export default class NoteController {
  async getNotes(page: number = 1, limit: number = 10) {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/note?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")!}`,
        },
      },
    );

    if (!response.ok) {
      return err({
        message: "Something Went Wrong Fetching the Notes",
      });
    }
    const data: Note[] = await response.json();
    return ok(data);
  }
}
