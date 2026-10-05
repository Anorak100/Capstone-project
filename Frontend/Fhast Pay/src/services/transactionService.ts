const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type Transaction = {
  id: string;
  reference: string;
  amount: string | number;
  type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
  status: "SUCCESSFUL" | "FAILED" | "PENDING";
  direction?: "DEBIT" | "CREDIT" | null;
  transferReference?: string | null;
  description?: string | null;
  createdAt: string;
  fromAccount?: {
    accountNumber: string;
  } | null;
  toAccount?: {
    accountNumber: string;
  } | null;
};

export type TransactionPagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type TransactionHistory = {
  transactions: Transaction[];
  pagination: TransactionPagination;
};

export type TransferData = {
  reference: string;
  amount: string | number;
  currency: string;
  debit: Transaction;
  credit: Transaction;
};

export type TransferRequest = {
  fromAccount: string;
  toAccount: string;
  amount: string;
  description?: string;
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

export const makeTransfer = async (
  token: string,
  data: TransferRequest,
): Promise<TransferData> => {
  const response = await fetch(`${API_URL}/transactions/transfer`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = (await response.json()) as ApiResponse<TransferData> & {
    errors?: { message?: string }[];
  };

  if (!response.ok || !result.success) {
    throw new Error(getErrorMessage(result));
  }

  return result.data;
};

export type TransactionFilters = {
  page?: number;
  limit?: number;
  type?: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
  status?: "SUCCESSFUL" | "FAILED" | "PENDING";
  accountNumber?: string;
};

export const getTransactions = async (
  token: string,
  filters: TransactionFilters = {},
): Promise<TransactionHistory> => {
  const params = new URLSearchParams();

  if (filters.page !== undefined) {
    params.set("page", String(filters.page));
  }

  if (filters.limit !== undefined) {
    params.set("limit", String(filters.limit));
  }

  if (filters.type) {
    params.set("type", filters.type);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.accountNumber) {
    params.set("accountNumber", filters.accountNumber);
  }

  const query = params.toString();

  const response = await fetch(
    `${API_URL}/transactions/history${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const result = (await response.json()) as ApiResponse<TransactionHistory> & {
    errors?: { message?: string }[];
  };

  if (!response.ok || !result.success) {
    throw new Error(getErrorMessage(result));
  }

  return result.data;
};
