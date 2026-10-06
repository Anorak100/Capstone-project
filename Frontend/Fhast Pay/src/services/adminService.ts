import { API_URL } from "./apiConfig";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const getErrorMessage = (result: {
  message?: string;
  errors?: { message?: string }[];
}) => {
  if (result.errors?.length) {
    return result.errors
      .map((error) => error.message)
      .filter(Boolean)
      .join(", ");
  }
  return result.message || "The request could not be completed";
};

type AdminFetchOptions = {
  method?: "GET" | "PATCH" | "POST";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
};

const adminFetch = async <T>(
  token: string,
  path: string,
  options: AdminFetchOptions = {},
): Promise<T> => {
  const params = new URLSearchParams();
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    }
  }
  const qs = params.toString();
  const response = await fetch(
    `${API_URL}/admin${path}${qs ? `?${qs}` : ""}`,
    {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    },
  );

  const result = (await response.json()) as ApiResponse<T> & {
    errors?: { message?: string }[];
  };

  if (!response.ok || !result.success) {
    throw new Error(getErrorMessage(result));
  }

  return result.data;
};

export type AdminMetrics = {
  users: { total: number; active: number };
  accounts: { total: number; active: number };
  transactions: { total: number };
  volume: { processed: string | number; today: string | number };
  transfers: {
    currency: string;
    successfulTransfers: number;
    successfulTransferVolume: string | number;
  }[];
};

export type AdminUserAccount = {
  accountNumber: string;
  balance: string | number;
  currency: string;
  status: string;
};

export type AdminUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string;
  phone: string;
  role: "CUSTOMER" | "ADMIN";
  isActive: boolean;
  accounts: AdminUserAccount[];
};

export type AdminUserList = {
  users: AdminUser[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export type AdminTransactionParty = {
  id: string;
  fullName: string | null;
  email: string;
  phone: string;
};

export type AdminTransaction = {
  id: string;
  reference: string;
  amount: string | number;
  type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
  direction: "DEBIT" | "CREDIT" | null;
  status: "SUCCESSFUL" | "FAILED" | "PENDING";
  description?: string | null;
  createdAt: string;
  sender: AdminTransactionParty | null;
  recipient: AdminTransactionParty | null;
  fromAccount?: { accountNumber: string; currency: string } | null;
  toAccount?: { accountNumber: string; currency: string } | null;
};

export type AdminTransactionList = {
  transactions: AdminTransaction[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export const getAdminMetrics = (token: string) =>
  adminFetch<AdminMetrics>(token, "/metrics");

export const getAdminUsers = (
  token: string,
  query: { page?: number; limit?: number; search?: string } = {},
) => adminFetch<AdminUserList>(token, "/users", { query });

export const getAdminTransactions = (
  token: string,
  query: {
    page?: number;
    limit?: number;
    type?: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
    search?: string;
  } = {},
) => adminFetch<AdminTransactionList>(token, "/transactions", { query });

export type UpdateUserStatusResult = {
  user: AdminUser;
  previousIsActive: boolean;
  isActive: boolean;
  accountsUpdated: number;
};

export const updateAdminUserStatus = (
  token: string,
  userId: string,
  isActive: boolean,
) =>
  adminFetch<UpdateUserStatusResult>(token, `/users/${userId}/status`, {
    method: "PATCH",
    body: { isActive },
  });

export const formatAdminMoney = (
  amount: string | number,
  currency = "NGN",
) => {
  const value = Number(amount);
  if (Number.isNaN(value)) return `${currency} 0.00`;
  return `${currency} ${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatAdminDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTransactionUserLabel = (tx: AdminTransaction) => {
  if (tx.direction === "DEBIT") {
    return tx.sender?.fullName || tx.sender?.phone || "Unknown user";
  }
  return tx.recipient?.fullName || tx.recipient?.phone || "Unknown user";
};
