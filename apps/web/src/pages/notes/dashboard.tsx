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

  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState({
    notes: true,
    user: true,
  });
  const [trigger, setTrigger] = useState(false);

  const handleTrigger = () => {
    setTrigger((prev) => !prev);
  };

  const handleAddNote = async () => {
    if (!user) return;

    toast.loading("Creating new note!");

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

      const createdNote = {
        ...newNoteData,
        id: result.value.created,
      };

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

  const getNotes = async () => {
    setIsLoading((prev) => ({ ...prev, notes: true }));
    try {
      const noteController = new NoteController();
      const noteResult = await noteController.getNotes();

      if (noteResult.isErr()) {
        toast.error("Something went wrong fetching notes.");
        return;
      }

      setNotes(noteResult.value);
      setActiveNote(noteResult.value[0] || null);
    } catch (error) {
      toast.error("Failed to fetch notes");
    } finally {
      setIsLoading((prev) => ({ ...prev, notes: false }));
    }
  };

  // Initial auth check and user data fetch
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const loggedIn = await AuthController.isLoggedIn();
        if (!loggedIn) {
          navigate("/sign-in");
          return;
        }

        const authController = new AuthController();
        const self = await authController.getSelf(
          localStorage.getItem("token")!,
        );

        if (self.isErr()) {
          toast.error("Something went wrong fetching the user.");
          navigate("/sign-in");
          return;
        }

        setUser(self.value);
        await getNotes();
      } catch (error) {
        console.error("Error in auth check:", error);
        navigate("/sign-in");
      } finally {
        setIsLoading((prev) => ({ ...prev, user: false }));
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  // Handle note refresh on trigger
  useEffect(() => {
    if (user && trigger) {
      getNotes();
    }
  }, [trigger, user]);

  if (isLoading.user || isLoading.notes) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar
        notes={notes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        username={user?.username || ""}
        onAddNote={handleAddNote}
      />
      {activeNote && (
        <NoteEditor noteId={activeNote.id!} triggerRender={handleTrigger} />
      )}
    </div>
  );
}
