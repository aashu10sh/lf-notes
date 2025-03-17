import { useEffect, useState } from "react";
import AuthController from "../../lib/auth/controller";
import { redirect, useNavigate } from "react-router";
import toast from "react-hot-toast";

import Sidebar from "../../components/note/sidebar";
import NoteController, { Note } from "../../lib/note/controller";

interface User {
  username: string;
  name: string;
  id: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState({} as User);
  const navigator = useNavigate();

  const [notes, setNotes] = useState([] as Note[]);
  const [activeNote, setActiveNote] = useState(notes[0]);

  const handleAddNote = () => {
    const newNote = {
      id: 0,
      title: "Untitled Note",
      preview: "Untitled Note",
      categories: [],
      updatedAt: new Date(),
      createdAt: new Date(),
      slug: "",
      extra: {},
      content: {
        time: Date.now(),
        blocks: [],
        version: "2.22.2",
      },
    };

    // setNotes([newNote, ...notes]);
    // setActiveNote(newNote);
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
      setNotes(noteResult.value);
      setActiveNote(noteResult.value[0]);
    }

    getUser();
    getNotes();
  }, []);

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar
        notes={notes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        username={user.username}
        onAddNote={handleAddNote}
      />
      {/* <NoteEditor note={activeNote} /> */}
    </div>
  );
}
