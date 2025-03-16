import { Hono } from "hono";
import signInValidator from "./entities/requests/signIn";
import AuthController from "./controller";
import AuthService from "./service";
import signUpValidator from "./entities/requests/signUp";
import { getCurrentUser } from "./middlewares/getCurrentUser";

const authRouter = new Hono();
const authController = new AuthController(await AuthService.NewAuthService());

authRouter.get("/sign-in", async (c) => {
  return c.text("Hello Auth");
});
authRouter.post("/sign-in", signInValidator, authController.signIn);
authRouter.post("/sign-up", signUpValidator, authController.signUp);
authRouter.get("/me", getCurrentUser, authController.me);

export default authRouter;
