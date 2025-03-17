import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function SignOutPage() {
  const naviate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    naviate("/sign-in");
  }, []);

  return ``;
}
