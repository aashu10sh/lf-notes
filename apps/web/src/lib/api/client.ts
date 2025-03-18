import { BACKEND_URL } from "../constants";

export interface ApiError {
  message: string;
  statusCode?: number;
}

export class ApiClient {
  protected getHeaders(requiresAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (requiresAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "An unexpected error occurred",
      }));

      throw {
        message: error.message || "An unexpected error occurred",
        statusCode: response.status,
      };
    }

    return response.json();
  }

  protected getUrl(endpoint: string): string {
    return `${BACKEND_URL}/api/v1/${endpoint}`;
  }
}
