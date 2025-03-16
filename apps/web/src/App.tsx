import "./App.css";
import { Route, Routes } from "react-router";
import SignUpPage from "./pages/auth/sign-up";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
            <Toaster />
    <Routes>
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/sign-in" />
      <Route path="/sign-out" />
      <Route path="/app" />
      <Route path="/notes/search" />
      <Route path="/notes/:noteId" />
    </Routes>
    </>
  );
}

export default App;
