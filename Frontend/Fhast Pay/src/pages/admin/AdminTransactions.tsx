import { useState } from "react";
import { FiSearch, FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import styles from "./AdminTransactions.module.css";

const MOCK_ADMIN_TXS = [
  {
    id: "tx_1",
    reference: "FP-TXN-849102",
    user: "Samuel Godswill",
    type: "TRANSFER",
    amount: "₦25,000.00",
    status: "SUCCESSFUL",
    date: "Oct 5, 2026 · 14:32",
    direction: "DEBIT",
  },
  {
    id: "tx_2",
    reference: "FP-TXN-849103",
    user: "Mark Philip",
    type: "DEPOSIT",
    amount: "₦50,000.00",
    status: "SUCCESSFUL",
    date: "Oct 5, 2026 · 13:15",
    direction: "CREDIT",
  },
  {
    id: "tx_3",
    reference: "FP-TXN-849104",
    user: "Alice Peters",
    type: "TRANSFER",
    amount: "₦12,000.00",
    status: "SUCCESSFUL",
    date: "Oct 5, 2026 · 11:40",
    direction: "DEBIT",
  },
  {
    id: "tx_4",
    reference: "FP-TXN-849105",
    user: "Jane Joy",
    type: "TRANSFER",
    amount: "₦5,500.00",
    status: "SUCCESSFUL",
    date: "Oct 5, 2026 · 09:20",
    direction: "CREDIT",
  },
];

function AdminTransactions() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "TRANSFER" | "DEPOSIT">("ALL");

  const filtered = MOCK_ADMIN_TXS.filter((tx) => {
    const matchesFilter = filterType === "ALL" ? true : tx.type === filterType;
    const matchesSearch =
      tx.reference.toLowerCase().includes(search.toLowerCase()) ||
      tx.user.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className={styles.transactions}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <div className={styles.headerTag}>Global Ledger</div>
            <h1>All Transactions</h1>
            <p>Real-time audit log of transfers, deposits, and account activities across Fhast Pay.</p>
          </div>
        </header>

        <section className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.filterTabs}>
              <button
                type="button"
                className={`${styles.tab} ${filterType === "ALL" ? styles.activeTab : ""}`}
                onClick={() => setFilterType("ALL")}
              >
                All
              </button>
              <button
                type="button"
                className={`${styles.tab} ${filterType === "TRANSFER" ? styles.activeTab : ""}`}
                onClick={() => setFilterType("TRANSFER")}
              >
                Transfers
              </button>
              <button
                type="button"
                className={`${styles.tab} ${filterType === "DEPOSIT" ? styles.activeTab : ""}`}
                onClick={() => setFilterType("DEPOSIT")}
              >
                Deposits
              </button>
            </div>

            <div className={styles.searchWrapper}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Search by reference or user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
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
                  <th>Timestamp</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span className={styles.refCode}>{tx.reference}</span>
                    </td>
                    <td>
                      <strong className={styles.userName}>{tx.user}</strong>
                    </td>
                    <td>
                      <span className={styles.typeBadge}>
                        {tx.direction === "DEBIT" ? (
                          <FiArrowUpRight className={styles.debitIcon} />
                        ) : (
                          <FiArrowDownLeft className={styles.creditIcon} />
                        )}
                        {tx.type}
                      </span>
                    </td>
                    <td>
                      <strong
                        className={`${styles.amount} ${
                          tx.direction === "DEBIT" ? styles.amountDebit : styles.amountCredit
                        }`}
                      >
                        {tx.amount}
                      </strong>
                    </td>
                    <td>
                      <span className={styles.statusSuccess}>{tx.status}</span>
                    </td>
                    <td>
                      <span className={styles.dateText}>{tx.date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminTransactions;
