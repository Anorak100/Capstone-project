export type StoredUser = {
  role?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  hasPin?: boolean;
};

export const getAuthToken = () => localStorage.getItem("authToken");

export const getStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const isAdminUser = (user: StoredUser | null) => user?.role === "ADMIN";
