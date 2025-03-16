import type React from "react";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AuthController from "../../lib/auth/controller";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface SignUpForm {
  name: string;
  username: string;
  password: string;
}

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function isLoggedIn() {
      const loggedIn = await AuthController.isLoggedIn();
      if (loggedIn) {
        navigate("/");
        return;
      }
      return;
    }

    isLoggedIn();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authController = new AuthController();

    const authResult = await authController.signUp({
      name,
      username,
      password,
    });

    authResult.match(
      async (ok) => {
        toast.success(ok.message);
        await navigate("/");
      },
      (err) => {
        toast.error(err.message);
      },
    );
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4 text-zinc-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-zinc-900 p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Sign-Up
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Sign up to get started with Napkin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-300"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-0 bg-zinc-800 px-4 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-zinc-300"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 bg-zinc-800 px-4 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-300"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 bg-zinc-800 px-4 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 hover:text-zinc-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Sign up
            </button>
          </div>

          <div className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <a
              href="#"
              className="font-medium text-violet-400 hover:text-violet-300"
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
