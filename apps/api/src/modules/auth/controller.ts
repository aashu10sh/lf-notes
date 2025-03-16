import { Context } from "hono";
import AuthService from "./service";
import { HTTPException } from "hono/http-exception";
import { NapkinErrors } from "../core/errors";

export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  signIn = async (c: Context) => {
    const userData: { username: string; name: string; password: string } =
      await c.req.json();

    const signInResult = await this.authService.signIn(userData);

    return signInResult.match(
      (ok) => {
        return c.json({
          token: ok.token,
        });
      },
      (err) => {
        switch (err.type) {
          case NapkinErrors.NOT_FOUND:
          case NapkinErrors.NOT_ENOUGH_PERMISSIONS:
            return c.json(
              {
                message: "Incorrect Credentials",
                type: NapkinErrors.NOT_ENOUGH_PERMISSIONS,
              },
              403,
            );
          case NapkinErrors.UNKNOWN:
          default:
            throw new HTTPException(500, {
              message: "unreachable",
            });
        }
      },
    );
  };

  

  signUp = async (c: Context) => {
    const userData = await c.req.json();
    const signInResult = await this.authService.signUp(userData);

    return signInResult.match(
      (ok) => {
        return c.json({
          token: ok.token,
        });
      },

      (e) => {
        switch (e.type) {
          case NapkinErrors.CONFLICT:
            return c.json(
              {
                message: "Someone with that username already exists",
                type: NapkinErrors.CONFLICT,
              },
              409,
            );
          case NapkinErrors.UNKNOWN:
            throw new HTTPException(500, {
              message: "trace: auth.sign_up",
            });
          default:
            throw new HTTPException(500, {
              message: "unreachable",
            });
        }
      },
    );
  };


  me = async (c: Context) => {
    const user = c.get("user");
    console.log(user);
    return c.json({
      id: user.id,
      username: user.username,
      name: user.name,
    });
  };
}
