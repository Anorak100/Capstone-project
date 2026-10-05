import { useState } from "react";
import { FiMoreVertical, FiSearch, FiUserCheck, FiShield } from "react-icons/fi";
import styles from "./AdminUsers.module.css";

const MOCK_USERS = [
  {
    id: "usr_1",
    name: "Alice Peters",
    email: "peters@example.com",
    accountNumber: "2084910283",
    role: "CUSTOMER",
    status: "Active",
    balance: "₦142,500.00",
  },
  {
    id: "usr_2",
    name: "Jane Joy",
    email: "jane@example.com",
    accountNumber: "2084910284",
    role: "CUSTOMER",
    status: "Active",
    balance: "₦85,000.00",
  },
  {
    id: "usr_3",
    name: "Blessing Ocheme",
    email: "blessing@example.com",
    accountNumber: "2084910285",
    role: "ADMIN",
    status: "Active",
    balance: "₦2,450,000.00",
  },
  {
    id: "usr_4",
    name: "Samuel Godswill",
    email: "samuel@example.com",
    accountNumber: "2084910286",
    role: "CUSTOMER",
    status: "Active",
    balance: "₦12,300.00",
  },
];

function AdminUsers() {
  const [search, setSearch] = useState("");

  const filteredUsers = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.accountNumber.includes(search),
  );

  return (
    <main className={styles.users}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <div className={styles.headerTag}>Platform Accounts</div>
            <h1>Users Directory</h1>
            <p>View, inspect, and manage registered account holders across the platform.</p>
          </div>
        </header>

        <section className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Search by name, email, or account number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
                aria-label="Search users"
              />
            </div>
            <span className={styles.userCount}>
              Showing <strong>{filteredUsers.length}</strong> accounts
            </span>
          </div>

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
                {filteredUsers.map((u) => {
                  const initials = u.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2);
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.avatar}>{initials}</div>
                          <div className={styles.userInfo}>
                            <strong>{u.name}</strong>
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.accountNumber}>{u.accountNumber}</span>
                      </td>
                      <td>
                        <span
                          className={`${styles.roleBadge} ${
                            u.role === "ADMIN" ? styles.adminRole : styles.customerRole
                          }`}
                        >
                          {u.role === "ADMIN" && <FiShield />}
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <strong className={styles.balance}>{u.balance}</strong>
                      </td>
                      <td>
                        <span className={styles.statusActive}>
                          <FiUserCheck /> Active
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.actionButton}
                          aria-label="User actions"
                          title="Options"
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
        </section>
      </div>
    </main>
  );
}

export default AdminUsers;
