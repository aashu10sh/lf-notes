import { Plus } from "lucide-react";
import { Note } from "../../lib/note/controller";
import { useNavigate } from "react-router";

type SidebarProps = {
  notes: Note[];
  activeNote: Note;
  setActiveNote: (note: Note) => void;
  username: string;
  onAddNote: () => void;
};

export default function Sidebar({
  notes,
  activeNote,
  setActiveNote,
  username,
  onAddNote,
}: SidebarProps) {
  const navigator = useNavigate();
  return (
    <div className="w-60 border-r border-zinc-800 flex flex-col">
      {/* User welcome */}
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-medium">Welcome back,</h2>
        <h1 className="text-xl font-bold">{username}</h1>
      </div>

      {/* Logout button */}
      <button
        className="p-4 text-center border-b border-zinc-800 hover:bg-zinc-900 transition-colors"
        onClick={() => {
          navigator("/sign-out");
        }}
      >
        Log Out
      </button>

      {/* Add new note button */}
      <button
        onClick={onAddNote}
        className="p-4 text-center border-b border-zinc-800 hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2"
      >
        Add a new Note <Plus size={16} />
      </button>

      {/* Notes list header */}
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-bold underline">NOTES</h2>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => setActiveNote(note)}
            className={`p-4 border-b border-zinc-800 cursor-pointer hover:bg-zinc-900 transition-colors ${
              activeNote.id === note.id ? "bg-zinc-900" : ""
            }`}
          >
            <p className="truncate">{note.title}</p>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex border-t border-zinc-800">
        <button className="flex-1 p-4 text-center hover:bg-zinc-900 transition-colors">
          &lt;
        </button>
        <button className="flex-1 p-4 text-center border-l border-zinc-800 hover:bg-zinc-900 transition-colors">
          &gt;
        </button>
      </div>
    </div>
  );
}
