import { bearerAuth } from "hono/bearer-auth";
import AuthService from "../service";
import { verifyJWTToken } from "../utils";

export const getCurrentUser = bearerAuth({
  async verifyToken(token, context) {
    const tokenResult = verifyJWTToken(token);
    return tokenResult.match(
      async (payload) => {
        const authService = await AuthService.NewAuthService();
        const user = await authService.me(payload.sub);
        context.set("user", user);
        return true 
       },
      async (error) => {
        return false 
      },
    );
  },
});
