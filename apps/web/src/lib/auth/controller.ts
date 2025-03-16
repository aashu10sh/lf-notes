import { err, ok } from "neverthrow";
import { BACKEND_URL } from "../constants";

interface SignUpResponse {
  token: string;
}

interface SelfResponse {
  id: number;
  name: string;
  username: string;
}

export default class AuthController {
  constructor() {}

  signUp = async (signUpData: {
    name: string;
    username: string;
    password: string;
  }) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/sign-up`, {
      body: JSON.stringify(signUpData),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      switch (response.status) {
        case 400:
        case 422:
          return err({
            message: "Something is wrong with your request.",
          });
        default:
        case 500:
          return err({
            message: "Something Went Wrong with the server.",
          });
      }
    }
    console.log("success");
    const jsonData: SignUpResponse = await response.json();
    
    localStorage.setItem("token", jsonData.token);
    return ok({
      message: "Succesfully Created!",
    });
  };

  getSelf = async (token: string) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return err({
        statusCode: response.status,
        message: "Something Went Wrong",
      });
    }

    const self: SelfResponse = await response.json();

    return ok({
      data: self,
    });
  };

  static async isLoggedIn() {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    const controller = new AuthController();

    const response = await controller.getSelf(token);

    if (response.isErr()) {
      return false;
    }
    return true;
  }
}
