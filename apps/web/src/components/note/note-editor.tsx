import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import toast from "react-hot-toast";
import NoteHeader from "./note-header";
import NoteController, { Note } from "../../lib/note/controller";
import "./note-editor.css";
import { BACKEND_URL } from "../../lib/constants";

type NoteContent = {
  time: number;
  blocks: any[];
  version: string;
};

type NoteEditorProps = {
  noteId: number;
  triggerRender: () => void;
};

type CategoryProps = {
  authorId: number;
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
};

export default function NoteEditor({ noteId, triggerRender }: NoteEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<CategoryProps[]>();
  const [trigger, setTrigger] = useState(false);

  const fetchNoteCategories = async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/category/${noteId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.error(errorData);
    }
    const result = await res.json();
    setCategories(result);
  };

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);

      try {
        const noteController = new NoteController();
        const result = await noteController.getNote(noteId);

        if (result.isErr()) {
          toast.error("Failed to load note");
          setLoading(false);
          return;
        }

        const fetchedNote = result.value;
        setNote(fetchedNote);
        setTitle(fetchedNote.title);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Something went wrong while loading the note");
        setLoading(false);
      }
    };

    fetchNote();
    fetchNoteCategories();
  }, [noteId]);

  useEffect(() => {
    if (trigger) {
      fetchNoteCategories();
    }
    setTrigger(false);
  }, [trigger]);

  useEffect(() => {
    if (!note) return;

    const initEditor = async () => {
      if (editorRef.current) {
        try {
          await editorRef.current.isReady;
          editorRef.current.destroy();
        } catch (error) {
          console.error("Error destroying editor:", error);
        }
      }

      try {
        const content =
          typeof note.content === "string"
            ? (JSON.parse(note.content) as NoteContent)
            : (note.content as NoteContent);

        const editor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: Header,
            paragraph: Paragraph,
          },
          data: content,
          placeholder: "Let's write something...",
          autofocus: true,
          onReady: () => {
            console.log("Editor.js is ready");
          },
          onChange: async () => {
            console.log("Content changed");
            //todo(aashutosh): automatic save the note here.
          },
        });

        editorRef.current = editor;
      } catch (error) {
        console.error("Error initializing editor:", error);
        toast.error("Failed to initialize editor");
      }
    };

    initEditor();

    // Cleanup function
    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (error) {
          console.error("Error destroying editor in cleanup:", error);
        }
      }
    };
  }, [note]);

  const saveNote = async (noteId: number) => {
    if (!note || !editorRef.current) return;

    try {
      const savedData = await editorRef.current.save();

      const noteController = new NoteController();

      const dataToUpdate = {
        content: JSON.stringify(savedData),
        title: title,
      };
      const updateResult = await noteController.updateNote(
        noteId,
        dataToUpdate,
      );

      if (updateResult.isErr()) {
        toast.error("Failed to save note");
        return;
      }
      console.log("upadte after post req " + updateResult.value);

      triggerRender();

      toast.success("Note saved successfully");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  const deleteNote = async (noteId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone.",
      )
    ) {
      return;
    }

    toast.loading("Deleting note...");

    try {
      const noteController = new NoteController();
      const result = await noteController.deleteNote(noteId);

      if (result.isErr()) {
        toast.dismiss();
        toast.error("Failed to delete note");
        return;
      }
      toast.dismiss();
      toast.success("Note deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.dismiss();
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Loading note...</p>
      </div>
    );
  }

  if (!noteId || !note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Note not found</p>
      </div>
    );
  }

  const handleTrigger = () => {
    setTrigger(true);
  };

  return (
    <div className=" min-h-screen flex-1 overflow-y-auto">
      <NoteHeader
        id={noteId}
        title={title}
        setTitle={setTitle}
        categories={categories}
        lastUpdated={note.updatedAt?.toString()}
        created={note.createdAt?.toString()}
        triggerRender={handleTrigger}
      />
      <div className="p-8">
        <div id="editorjs" className="prose prose-invert max-w-none"></div>
      </div>
      <button
        type="button"
        onClick={() => {
          saveNote(noteId);
        }}
        className="mx-10 text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
      >
        Save Note
      </button>
      <button
        type="button"
        onClick={() => {
          deleteNote(noteId);
        }}
        className="mx-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
      >
        Delete Note
      </button>
    </div>
  );
}
