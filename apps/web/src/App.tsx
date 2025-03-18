import "./App.css";
import { Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import SignUpPage from "./pages/auth/sign-up";
import SignInPage from "./pages/auth/sign-in";
import SignOutPage from "./pages/auth/sign-out";
import DashboardPage from "./pages/notes/dashboard";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-out" element={<SignOutPage />} />

        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </>
  );
}

export default App;
