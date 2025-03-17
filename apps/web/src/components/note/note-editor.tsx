import { useEffect, useRef, useState } from "react"
import NoteHeader from "./note-header" 
import EditorJS from "@editorjs/editorjs"
import Header from "@editorjs/header"  // Import from specific package
import Paragraph from "@editorjs/paragraph"

type NoteContent = {
  time: number
  blocks: any[]
  version: string
}

type Note = {
  id: string
  title: string
  categories: string[]
  lastUpdated: string
  created: string
  content: NoteContent
}

type NoteEditorProps = {
  note: Note
}

export default function NoteEditor({ note }: NoteEditorProps) {
  const editorRef = useRef<EditorJS | null>(null)
  const [title, setTitle] = useState(note.title)

  // Initialize or update EditorJS when the note changes
  useEffect(() => {
    if (!note) return

    setTitle(note.title)

    const initEditor = async () => {
      if (editorRef.current) {
        await editorRef.current.isReady
        editorRef.current.destroy()
      }

      const editor = new EditorJS({
        holder: "editorjs",
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              levels: [1, 2, 3, 4],
              defaultLevel: 1,
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
        },
        data: note.content,
        placeholder: "Let's write something...",
      })

      editorRef.current = editor
    }

    initEditor()

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
      }
    }
  }, [note])

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
  )
}
