import { err, ok } from "neverthrow";
import { BACKEND_URL } from "../constants";

export interface NoteContent {
  time: number;
  blocks: any[];
  version: string;
}

export interface Note {
  id?: number;
  title: string;
  slug?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  content: string | NoteContent;
  extra?: any;
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

  async getNote(noteId: number) {
    const response = await fetch(`${BACKEND_URL}/api/v1/note/${noteId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")!}`,
      },
    });

    if (!response.ok) {
      return err({
        message: "Something Went Wrong Fetching the Notes",
      });
    }
    const data: Note = await response.json();
    return ok(data);
  }

  async createNote(newNote: Note) {
    if (typeof newNote.content == "object") {
      newNote.content = JSON.stringify(newNote.content);
    }

    newNote.extra = JSON.stringify({});

    const response = await fetch(`${BACKEND_URL}/api/v1/note`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")!}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newNote),
    });

    if (!response.ok) {
      return err({
        message: "Something Went Wrong Creating New Note",
      });
    }
    const data: { created: number } = await response.json();

    return ok(data);
  }

  async deleteNote(noteId: number) {
    const response = await fetch(`${BACKEND_URL}/api/v1/note/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")!}`,
      },
    });

    if (!response.ok) {
      return err({
        message: "Something Went Wrong Deleting a Note",
      });
    }

    return ok({});
  }

  async updateNote(
    noteId: number,
    body: { content: NoteContent | string; title: string },
  ) {
    if (typeof body.content == "object") {
      body.content = JSON.stringify(body.content);
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/note/${noteId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")!}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return err({
        message: "Something Went Wrong Creating New Note",
      });
    }
    const data: { updated: number } = await response.json();

    return ok(data);
  }
}
