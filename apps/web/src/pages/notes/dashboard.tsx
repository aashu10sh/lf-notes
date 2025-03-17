import { useEffect, useState } from "react";
import AuthController from "../../lib/auth/controller";
import { redirect, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Sidebar from "../../components/note/sidebar";
import NoteController, { Note } from "../../lib/note/controller";
import NoteEditor from "../../components/note/note-editor";

interface User {
  username: string;
  name: string;
  id: number;
}

export default function DashboardPage() {
  const navigator = useNavigate();

  const [user, setUser] = useState({} as User);
  const [notes, setNotes] = useState([] as Note[]);
  const [activeNote, setActiveNote] = useState(notes[0]);
  const [isReady, setIsReady] = useState(false);

  const handleAddNote = async () => {
    toast.loading("Creating new note...");

    try {
      const newNoteData: Note = {
        title: "Untitled Note",
        content: {
          time: Date.now(),
          blocks: [],
          version: "2.22.2",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const noteController = new NoteController();
      const result = await noteController.createNote(newNoteData);

      if (result.isErr()) {
        toast.dismiss();
        toast.error("Failed to create new note");
        return;
      }

      const createdNote = newNoteData;

      setNotes((prevNotes) => [createdNote, ...prevNotes]);

      setActiveNote(createdNote);

      toast.dismiss();
      toast.success("New note created");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.dismiss();
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    async function isLoggedIn() {
      const loggedIn = await AuthController.isLoggedIn();
      if (!loggedIn) {
        redirect("/sign-in");
        return;
      }
      return;
    }

    isLoggedIn();

    async function getUser() {
      const authController = new AuthController();
      const self = await authController.getSelf(localStorage.getItem("token")!);

      if (self.isErr()) {
        toast.error("Something went wrong fetching the user.");
        navigator("/sign-in");
        return;
      }
      setUser(self.value.data as User);
    }

    async function getNotes() {
      const noteController = new NoteController();
      const noteResult = await noteController.getNotes();

      if (noteResult.isErr()) {
        toast.error("Something went wrong fetching notes.");
        return;
      }

      if (noteResult.value.length <= 0){
        setIsReady(true);
        setNotes([]);
        return;
      }

      setNotes(noteResult.value);
      setActiveNote(noteResult.value[0]);
      setIsReady(true);
    }

    getUser();
    getNotes();
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar
        notes={notes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        username={user.username}
        onAddNote={handleAddNote}
      />
      <NoteEditor noteId={activeNote?.id!} />
    </div>
  );
}
