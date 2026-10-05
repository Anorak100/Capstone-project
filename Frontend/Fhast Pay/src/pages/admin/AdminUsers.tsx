import { FiMoreVertical, FiSearch } from "react-icons/fi";
import Input from "../../components/common/Input";
import styles from "./AdminUsers.module.css";

function AdminUsers() {
  return (
    <main className={styles.users}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Administration</p>

            <h1>Users</h1>

            <p>View and manage Fhast Pay users.</p>
          </div>
        </header>

        <section className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.search}>
              <FiSearch />

              <Input
                type="search"
                placeholder="Search users..."
                aria-label="Search users"
              />
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Account number</th>
                  <th>Status</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Alice Peters</td>
                  <td>peters@example.com</td>
                  <td>####0000</td>
                  <td>
                    <span className={styles.status}>Active</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.actionButton}
                      aria-label="User actions"
                    >
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>Jane Joy</td>
                  <td>jane@example.com</td>
                  <td>####0001</td>
                  <td>
                    <span className={styles.status}>Active</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.actionButton}
                      aria-label="User actions"
                    >
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminUsers;
