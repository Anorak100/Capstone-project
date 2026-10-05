import { useEffect, useState } from "react";
import {
  FiMoreVertical,
  FiSearch,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import EmptyState from "../../components/common/EmptyState";
import {
  formatAdminMoney,
  getAdminUsers,
  type AdminUser,
} from "../../services/adminService";
import { getAuthToken } from "../../utils/authSession";
import styles from "./AdminUsers.module.css";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadUsers = async () => {
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
    };

    loadUsers();
  }, [debouncedSearch]);

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
                    <th aria-label="Actions"></th>
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
                          {u.isActive ? (
                            <span className={styles.statusActive}>
                              <FiUserCheck /> Active
                            </span>
                          ) : (
                            <span className={styles.statusInactive}>
                              <FiUserX /> Inactive
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.actionButton}
                            aria-label="User actions"
                            title="Options"
                            disabled
                          >
                            <FiMoreVertical />
                          </button>
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
