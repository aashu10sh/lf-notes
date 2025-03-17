import { useEffect, useRef, useState } from "react";
import NoteHeader from "./note-header";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import "./note-editor.css";

type NoteContent = {
  time: number;
  blocks: any[];
  version: string;
};

type Note = {
  id: string;
  title: string;
  categories: string[];
  lastUpdated: string;
  created: string;
  content: NoteContent;
};

type NoteEditorProps = {
  note: Note;
};

export default function NoteEditor({ note }: NoteEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState(note.title);

  // Initialize or update EditorJS when the note changes
  useEffect(() => {
    if (!note) return;

    setTitle(note.title);

    const initEditor = async () => {
      // Only destroy if the editor is ready
      if (editorRef.current) {
        try {
          await editorRef.current.isReady;
          editorRef.current.destroy();
        } catch (error) {
          console.error("Error destroying editor:", error);
        }
      }

      // Create a new editor instance
      try {
        const editor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: Header,
            paragraph: Paragraph,
          },
          data: note.content,
          placeholder: "Let's write something...",
          autofocus: true,
          onReady: () => {
            console.log("Editor.js is ready");
          },
          onChange: () => {
            console.log("Content changed");
          },
        });

        editorRef.current = editor;
      } catch (error) {
        console.error("Error initializing editor:", error);
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

  return (
    <div className="flex-1 overflow-y-auto">
      <NoteHeader
        title={title}
        setTitle={setTitle}
        categories={note.categories}
        lastUpdated={note.lastUpdated}
        created={note.created}
      />
      <div className="p-8">
        <div id="editorjs" className="prose prose-invert max-w-none"></div>
      </div>
    </div>
  );
}
