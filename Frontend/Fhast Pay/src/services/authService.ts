import { API_URL } from "./apiConfig";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
};

export type RegistrationData = {
  user: User;
  account: {
    accountNumber: string;
    balance: string;
    currency: string;
    status: string;
  };
};

export type LoginData = {
  token: string;
  user: User;
};

const request = async <T>(
  path: string,
  body: unknown,
): Promise<ApiResponse<T>> => {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      `Unable to connect to the backend server at ${API_URL}. Please verify it is running.`,
    );
  }

  let result: ApiResponse<T>;
  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(
      response.ok
        ? "Received an invalid response from the server."
        : `Server error (${response.status}): ${response.statusText}`,
    );
  }

  if (!response.ok || !result.success) {
    const errorResult = result as ApiResponse<T> & {
      errors?: {
        field: string;
        message: string;
      }[];
    };

    const validationMessage = errorResult.errors
      ?.map((error) => error.message)
      .join(", ");

    throw new Error(
      validationMessage ||
        result.message ||
        "The request could not be completed",
    );
  }
  return result;
};

export const registerUser = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}) => request<RegistrationData>("register", data);

export const loginUser = (data: { phone: string; password: string }) =>
  request<LoginData>("login", data);
