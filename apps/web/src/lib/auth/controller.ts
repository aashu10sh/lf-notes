import { err, ok, Result } from "neverthrow";
import { ApiClient, ApiError } from "../api/client";

export interface SignUpResponse {
  token: string;
}

export interface SignUpData {
  name: string;
  username: string;
  password: string;
}

export interface SignInData {
  username: string;
  password: string;
}

export interface SelfResponse {
  id: number;
  name: string;
  username: string;
}

export interface AuthResponse {
  message: string;
}

export default class AuthController extends ApiClient {
  async signUp(
    signUpData: SignUpData,
  ): Promise<Result<AuthResponse, ApiError>> {
    try {
      const data = await fetch(this.getUrl("auth/sign-up"), {
        method: "POST",
        headers: this.getHeaders(false),
        body: JSON.stringify(signUpData),
      }).then((res) => this.handleResponse<SignUpResponse>(res));

      localStorage.setItem("token", data.token);
      return ok({ message: "Successfully Created!" });
    } catch (error) {
      return err(error as ApiError);
    }
  }

  async signIn(
    signInData: SignInData,
  ): Promise<Result<AuthResponse, ApiError>> {
    try {
      const data = await fetch(this.getUrl("auth/sign-in"), {
        method: "POST",
        headers: this.getHeaders(false),
        body: JSON.stringify(signInData),
      }).then((res) => this.handleResponse<SignUpResponse>(res));

      localStorage.setItem("token", data.token);
      return ok({ message: "Logged In" });
    } catch (error) {
      return err(error as ApiError);
    }
  }

  async getSelf(token: string): Promise<Result<SelfResponse, ApiError>> {
    try {
      const data = await fetch(this.getUrl("auth/me"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => this.handleResponse<SelfResponse>(res));

      return ok(data);
    } catch (error) {
      return err(error as ApiError);
    }
  }

  static async isLoggedIn(): Promise<boolean> {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const controller = new AuthController();
    const response = await controller.getSelf(token);
    return response.isOk();
  }
}
