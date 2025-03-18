import { err, ok, Result } from "neverthrow";
import { ApiClient, ApiError } from "../api/client";

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

export interface CreateNoteResponse {
  created: number;
}

export interface UpdateNoteResponse {
  updated: number;
}

export default class NoteController extends ApiClient {
  async getNotes(
    page: number = 1,
    limit: number = 10,
  ): Promise<Result<Note[], ApiError>> {
    try {
      const data = await fetch(
        this.getUrl(`note?page=${page}&limit=${limit}`),
        {
          method: "GET",
          headers: this.getHeaders(),
        },
      ).then((res) => this.handleResponse<Note[]>(res));

      return ok(data);
    } catch (error) {
      return err(error as ApiError);
    }
  }

  async getNote(noteId: number): Promise<Result<Note, ApiError>> {
    try {
      const data = await fetch(this.getUrl(`note/${noteId}`), {
        method: "GET",
        headers: this.getHeaders(),
      }).then((res) => this.handleResponse<Note>(res));

      return ok(data);
    } catch (error) {
      return err(error as ApiError);
    }
  }

  async createNote(
    newNote: Note,
  ): Promise<Result<CreateNoteResponse, ApiError>> {
    try {
      if (typeof newNote.content === "object") {
        newNote.content = JSON.stringify(newNote.content);
      }
      newNote.extra = JSON.stringify({});

      const data = await fetch(this.getUrl("note"), {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(newNote),
      }).then((res) => this.handleResponse<CreateNoteResponse>(res));

      return ok(data);
    } catch (error) {
      return err(error as ApiError);
    }
  }

  async deleteNote(noteId: number): Promise<Result<void, ApiError>> {
    try {
      await fetch(this.getUrl(`note/${noteId}`), {
        method: "DELETE",
        headers: this.getHeaders(),
      }).then((res) => this.handleResponse<void>(res));

      return ok(undefined);
    } catch (error) {
      return err(error as ApiError);
    }
  }

  async updateNote(
    noteId: number,
    body: { content: NoteContent | string; title: string },
  ): Promise<Result<UpdateNoteResponse, ApiError>> {
    try {
      if (typeof body.content === "object") {
        body.content = JSON.stringify(body.content);
      }

      const data = await fetch(this.getUrl(`note/${noteId}`), {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      }).then((res) => this.handleResponse<UpdateNoteResponse>(res));

      return ok(data);
    } catch (error) {
      return err(error as ApiError);
    }
  }
}
