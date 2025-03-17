import { useEffect, useState } from "react";
import AuthController from "../../lib/auth/controller";
import { redirect, useNavigate } from "react-router";
import toast from "react-hot-toast";
import NoteEditor from "../../components/note/note-editor";
import Sidebar from "../../components/note/sidebar";

interface User {
  username: string;
  name: string;
  id: number;
}


// Mock data for initial state
const initialNotes = [
  {
    id: "1",
    title: "Hansi Flick's Barcelona",
    preview: "Hansi Flick's Barce..",
    categories: ["Football", "Life", "Game"],
    lastUpdated: "2 days ago",
    created: "7 days go",
    content: {
      time: 1635603431943,
      blocks: [
        {
          type: "header",
          data: {
            text: "Heading 1",
            level: 1,
          },
        },
        {
          type: "header",
          data: {
            text: "Heading 2",
            level: 2,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget lobortis lectus. Maecenas rutrum tortor enim, nec fringilla turpis laoreet a. Maecenas lacinia erat a viverra venenatis. Vestibulum pulvinar purus nec sagittis molestie. Proin malesuada cursus rutrum. Nulla feugiat risus id sodales semper. Fusce id elementum justo. Curabitur tristique lacinia elit nec facilisis. Etiam diam ex, viverra quis varius at, fringilla ac nisl.",
          },
        },
      ],
      version: "2.22.2",
    },
  },
  {
    id: "2",
    title: "Pep Guardiola's City",
    preview: "Pep Guardiola's Cit..",
    categories: ["Football", "Tactics"],
    lastUpdated: "5 days ago",
    created: "10 days go",
    content: {
      time: 1635603431943,
      blocks: [],
      version: "2.22.2",
    },
  },
  {
    id: "3",
    title: "Another Note is here",
    preview: "Another Note is he..",
    categories: ["General"],
    lastUpdated: "1 week ago",
    created: "2 weeks ago",
    content: {
      time: 1635603431943,
      blocks: [],
      version: "2.22.2",
    },
  },
]



export default function DashboardPage() {
  const [user, setUser] = useState({} as User);
  const navigator = useNavigate();

  const [notes, setNotes] = useState(initialNotes)
  const [activeNote, setActiveNote] = useState(notes[0])
  const [username, setUsername] = useState("Aashutosh")

  const handleAddNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Untitled Note",
      preview: "Untitled Note",
      categories: [],
      lastUpdated: "Just now",
      created: "Just now",
      content: {
        time: Date.now(),
        blocks: [],
        version: "2.22.2",
      },
    }

    setNotes([newNote, ...notes])
    setActiveNote(newNote)
  }

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
    getUser();
  }, []);
  
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar
        notes={notes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        username={username}
        onAddNote={handleAddNote}
      />
      <NoteEditor note={activeNote} />
    </div>
  )

}
