import { API_URL } from "./apiConfig";

export type Account = {
  accountNumber: string;
  balance: string | number;
  currency: string;
  status: string;
};

type BalanceResponse = {
  success: boolean;
  message: string;
  data: {
    accounts: Account[];
  };
};

export type Recipient = {
  accountNumber: string;
  accountName: string;
  currency: string;
};

type RecipientResponse = {
  success: boolean;
  message: string;
  data: Recipient;
};

export const getBalance = async (token: string): Promise<Account[]> => {
  const response = await fetch(`${API_URL}/accounts/balance`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result: BalanceResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to retrieve account balance");
  }

  return result.data.accounts;
};

export const lookupRecipient = async (
  token: string,
  accountNumber: string,
): Promise<Recipient> => {
  const response = await fetch(`${API_URL}/accounts/lookup`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountNumber,
    }),
  });

  const result: RecipientResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to find recipient account");
  }

  return result.data;
};

export const getPinStatus = async (token: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/accounts/pin-status`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to retrieve PIN status");
  }

  return Boolean(result.data?.hasPin);
};

export const setTransactionPin = async (
  token: string,
  payload: { pin: string; currentPin?: string },
): Promise<string> => {
  const response = await fetch(`${API_URL}/accounts/pin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to save transaction PIN");
  }

  return result.message || "Transaction PIN saved successfully";
};

