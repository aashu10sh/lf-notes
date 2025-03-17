import { useEffect, useState } from "react";
import AuthController from "../../lib/auth/controller";
import { redirect, useNavigate } from "react-router";
import toast from "react-hot-toast";

interface User {
  username: string;
  name: string;
  id: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState({} as User);
  const navigator = useNavigate();

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

  return <h1>Hello {user.name}</h1>;
}
