import { Context } from "hono";
import AuthService from "./service";

export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  signIn = async (c: Context) => {
    const userData = await c.req.json();
    console.log(userData);
    return c.json({
      userData,
    });
  };


  signUp = async (c: Context) => {
    const userData = await c.req.json();
    console.log(userData);
    return c.json({
      userData,
    });
  };

}
