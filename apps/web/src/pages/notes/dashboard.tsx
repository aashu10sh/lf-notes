import { useEffect, useState } from "react";
import AuthController from "../../lib/auth/controller";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();

  const [user, setUser] = useState({} as User);
  const [notes, setNotes] = useState([] as Note[]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const handleTrigger = () => {
    console.log("triggered");
    setTrigger(!trigger);
  };

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
      createdNote.id = result.value.created;

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

  async function getNotes() {
    const noteController = new NoteController();
    const noteResult = await noteController.getNotes();

    if (noteResult.isErr()) {
      toast.error("Something went wrong fetching notes.");
      return;
    }

    if (noteResult.value.length <= 0) {
      setNotes([]);
      setActiveNote(null);
      setIsReady(true);
      return;
    }

    setNotes(noteResult.value);
    setActiveNote(noteResult.value[0]);
    setIsReady(true);
    setTrigger(false);
  }
  useEffect(() => {
    async function checkAuthAndFetchData() {
      const loggedIn = await AuthController.isLoggedIn();

      if (!loggedIn) {
        navigate("/sign-in");
        return;
      }

      const authController = new AuthController();
      const self = await authController.getSelf(localStorage.getItem("token")!);

      if (self.isErr()) {
        toast.error("Something went wrong fetching the user.");
        navigate("/sign-in");
        return;
      }

      const userData = self.value.data as User;
      setUser(userData);

      await getNotes();
    }

    try {
      checkAuthAndFetchData();
    } catch (err) {
      console.error(err);
    }
  }, [navigate]);

  useEffect(() => {
    if (user.id && trigger) {
      getNotes();
    }
  }, [trigger, user.id]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar
        notes={notes}
        activeNote={activeNote!}
        setActiveNote={setActiveNote}
        username={user.username}
        onAddNote={handleAddNote}
      />
      {activeNote && (
        <NoteEditor noteId={activeNote.id!} triggerRender={handleTrigger} />
      )}
    </div>
  );
}