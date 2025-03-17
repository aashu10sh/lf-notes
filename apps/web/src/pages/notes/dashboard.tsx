import { useEffect } from "react";
import AuthController from "../../lib/auth/controller";
import { redirect } from "react-router";

export default function DashboardPage() {
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
  }, []);
}
