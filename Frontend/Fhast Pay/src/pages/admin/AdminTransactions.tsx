import { FiSearch } from "react-icons/fi";
import Input from "../../components/common/Input";
import styles from "./AdminTransactions.module.css";

function AdminTransactions() {
  return (
    <main className={styles.transactions}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Administration</p>

            <h1>Transactions</h1>

            <p>View and monitor all Fhast Pay transactions.</p>
          </div>
        </header>

        <section className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.search}>
              <FiSearch />

              <Input
                type="search"
                placeholder="Search transactions..."
                aria-label="Search transactions"
              />
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>#TXN0001</td>
                  <td>Samuel Godswill</td>
                  <td>Transfer</td>
                  <td>₦25,000.00</td>
                  <td>
                    <span className={styles.status}>Completed</span>
                  </td>
                  <td>-</td>
                </tr>

                <tr>
                  <td>#TXN0002</td>
                  <td>Mark Philip</td>
                  <td>Deposit</td>
                  <td>₦50,000.00</td>
                  <td>
                    <span className={styles.status}>Completed</span>
                  </td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminTransactions;
