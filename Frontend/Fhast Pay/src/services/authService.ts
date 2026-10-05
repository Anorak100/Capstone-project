const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

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
  const response = await fetch(`${API_URL}/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as ApiResponse<T>;

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
