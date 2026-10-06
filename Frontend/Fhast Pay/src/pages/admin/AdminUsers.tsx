import { useCallback, useEffect, useState } from "react";
import {
  FiSearch,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiRefreshCw,
  FiAlertCircle,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import EmptyState from "../../components/common/EmptyState";
import {
  formatAdminMoney,
  getAdminUsers,
  updateAdminUserStatus,
  type AdminUser,
} from "../../services/adminService";
import { getAuthToken, getStoredUser } from "../../utils/authSession";
import styles from "./AdminUsers.module.css";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const currentAdminId = getStoredUser()?.id;

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadUsers = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setError("You are not signed in.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await getAdminUsers(token, {
        page: 1,
        limit: 50,
        search: debouncedSearch || undefined,
      });
      setUsers(result.users);
      setTotal(result.pagination.total);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load users",
      );
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleFreezeToggle = async (user: AdminUser) => {
    const token = getAuthToken();
    if (!token) return;

    const freeze = user.isActive;
    const name =
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.phone;

    const confirmed = window.confirm(
      freeze
        ? `Freeze ${name}'s account? They will be signed out and unable to transfer or receive funds until unfrozen.`
        : `Unfreeze ${name}'s account and restore access?`,
    );
    if (!confirmed) return;

    setUpdatingUserId(user.id);
    setError("");
    setSuccess("");

    try {
      const result = await updateAdminUserStatus(token, user.id, !freeze);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? result.user : u)),
      );
      setSuccess(
        freeze
          ? `${name}'s account has been frozen.`
          : `${name}'s account has been unfrozen.`,
      );
      setTimeout(() => setSuccess(""), 4000);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update account status",
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getAccountStatus = (user: AdminUser) => {
    const account = user.accounts[0];
    if (!user.isActive || account?.status === "FROZEN") {
      return "frozen";
    }
    if (account?.status === "ACTIVE") {
      return "active";
    }
    return "inactive";
  };

  return (
    <main className={styles.users}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <div className={styles.headerTag}>Platform Accounts</div>
            <h1>Users Directory</h1>
            <p>
              View, inspect, and manage registered account holders across the
              platform.
            </p>
          </div>
        </header>

        <section className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Search by name, email, phone, or account number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
                aria-label="Search users"
              />
            </div>
            <span className={styles.userCount}>
              Showing <strong>{users.length}</strong> of{" "}
              <strong>{total}</strong> accounts
            </span>
          </div>

          {success && (
            <div className={styles.successBanner} role="status">
              <FiUserCheck />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className={styles.errorBanner} role="alert">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className={styles.loadingState}>
              <FiRefreshCw className={styles.spinner} />
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={<FiSearch />}
              title="No users found"
              description={
                debouncedSearch
                  ? "Try a different search term."
                  : "No registered users yet."
              }
            />
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Account Number</th>
                    <th>Role</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => {
                    const name =
                      u.fullName ||
                      [u.firstName, u.lastName].filter(Boolean).join(" ") ||
                      "Unnamed user";
                    const initials = name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    const primaryAccount = u.accounts[0];
                    const accountStatus = getAccountStatus(u);
                    const isUpdating = updatingUserId === u.id;
                    const canToggle =
                      u.role === "CUSTOMER" && u.id !== currentAdminId;

                    return (
                      <tr key={u.id}>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.avatar}>{initials}</div>
                            <div className={styles.userInfo}>
                              <strong>{name}</strong>
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={styles.accountNumber}>
                            {primaryAccount?.accountNumber ?? "—"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${styles.roleBadge} ${
                              u.role === "ADMIN"
                                ? styles.adminRole
                                : styles.customerRole
                            }`}
                          >
                            {u.role === "ADMIN" && <FiShield />}
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <strong className={styles.balance}>
                            {primaryAccount
                              ? formatAdminMoney(
                                  primaryAccount.balance,
                                  primaryAccount.currency,
                                )
                              : "—"}
                          </strong>
                        </td>
                        <td>
                          {accountStatus === "active" ? (
                            <span className={styles.statusActive}>
                              <FiUserCheck /> Active
                            </span>
                          ) : accountStatus === "frozen" ? (
                            <span className={styles.statusFrozen}>
                              <FiLock /> Frozen
                            </span>
                          ) : (
                            <span className={styles.statusInactive}>
                              <FiUserX /> Inactive
                            </span>
                          )}
                        </td>
                        <td>
                          {canToggle ? (
                            <button
                              type="button"
                              className={
                                u.isActive
                                  ? styles.freezeButton
                                  : styles.unfreezeButton
                              }
                              onClick={() => handleFreezeToggle(u)}
                              disabled={isUpdating}
                              title={
                                u.isActive
                                  ? "Freeze account"
                                  : "Unfreeze account"
                              }
                            >
                              {isUpdating ? (
                                <FiRefreshCw className={styles.spinner} />
                              ) : u.isActive ? (
                                <>
                                  <FiLock /> Freeze
                                </>
                              ) : (
                                <>
                                  <FiUnlock /> Unfreeze
                                </>
                              )}
                            </button>
                          ) : (
                            <span className={styles.noAction}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminUsers;
