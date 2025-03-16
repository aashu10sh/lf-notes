import { err, ok, Result } from "neverthrow";
import UserRepository from "../user/repository";
import { hash, verify } from "argon2";
import { signData } from "./utils";
import { NapkinErrors } from "../core/errors";

export default class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signIn(userData: { username: string; password: string }) {
    try {
      const user = await this.userRepository.fetchByUsername(userData.username);

      if (!user) {
        return err({
          type: NapkinErrors.NOT_FOUND,
        });
      }
      const correctCreds = await verify(user.password, userData.password);

      if (!correctCreds) {
        return err({
          type: NapkinErrors.NOT_ENOUGH_PERMISSIONS,
        });
      }

      const token = signData({ sub: userData.username });

      return ok({
        token: token,
      });
    } catch (error) {
      console.log(error);
      return err({
        type: NapkinErrors.UNKNOWN,
      });
    }
  }

  async signUp(userData: { username: string; password: string; name: string }) {
    try {
      const already = await this.userRepository.fetchByUsername(
        userData.username,
      );

      if (already) {
        return err({
          type: NapkinErrors.CONFLICT,
        });
      }

      await this.userRepository.insertUser({
        name: userData.name,
        password: await hash(userData.password),
        username: userData.username,
      });

      const token = signData({ sub: userData.username });

      return ok({
        token: token,
      });
    } catch (e) {
      console.log(e);
      return err({
        type: NapkinErrors.UNKNOWN,
      });
    }
  }

  async me(username: string) {
    return await this.userRepository.fetchByUsername(username);
  }

  static async NewAuthService() {
    return new AuthService(UserRepository.NewUserRepository());
  }
}
