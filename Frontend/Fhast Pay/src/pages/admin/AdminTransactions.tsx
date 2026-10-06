import { useEffect, useState } from "react";
import {
  FiSearch,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import EmptyState from "../../components/common/EmptyState";
import {
  formatAdminDate,
  formatAdminMoney,
  getAdminTransactions,
  getTransactionUserLabel,
  type AdminTransaction,
} from "../../services/adminService";
import { getAuthToken } from "../../utils/authSession";
import styles from "./AdminTransactions.module.css";

type FilterType = "ALL" | "TRANSFER" | "DEPOSIT";

function AdminTransactions() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadTransactions = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("You are not signed in.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const result = await getAdminTransactions(token, {
          page: 1,
          limit: 50,
          type: filterType === "ALL" ? undefined : filterType,
          search: debouncedSearch || undefined,
        });
        setTransactions(result.transactions);
        setTotal(result.pagination.total);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load transactions",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [filterType, debouncedSearch]);

  return (
    <main className={styles.transactions}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <div className={styles.headerTag}>Global Ledger</div>
            <h1>All Transactions</h1>
            <p>
              Real-time audit log of transfers, deposits, and account
              activities across Fhast Pay.
            </p>
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

          <div className={styles.resultCount}>
            Showing <strong>{transactions.length}</strong> of{" "}
            <strong>{total}</strong> transactions
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
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState
              icon={<FiSearch />}
              title="No transactions found"
              description={
                debouncedSearch || filterType !== "ALL"
                  ? "Try adjusting your filters or search."
                  : "No ledger entries yet."
              }
            />
          ) : (
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
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <span className={styles.refCode}>{tx.reference}</span>
                      </td>
                      <td>
                        <strong className={styles.userName}>
                          {getTransactionUserLabel(tx)}
                        </strong>
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
                            tx.direction === "DEBIT"
                              ? styles.amountDebit
                              : styles.amountCredit
                          }`}
                        >
                          {formatAdminMoney(tx.amount)}
                        </strong>
                      </td>
                      <td>
                        <span
                          className={
                            tx.status === "SUCCESSFUL"
                              ? styles.statusSuccess
                              : tx.status === "FAILED"
                                ? styles.statusFailed
                                : styles.statusPending
                          }
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td>
                        <span className={styles.dateText}>
                          {formatAdminDate(tx.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminTransactions;
