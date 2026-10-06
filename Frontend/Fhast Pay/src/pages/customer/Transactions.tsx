import { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiCalendar,
} from "react-icons/fi";
import EmptyState from "../../components/common/EmptyState";
import {
  getTransactions,
  type Transaction,
} from "../../services/transactionService";
import styles from "./Transactions.module.css";

type FilterType = "ALL" | "TRANSFER" | "DEPOSIT";

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const loadTransactions = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("You are not signed in.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await getTransactions(token, {
        page: 1,
        limit: 50,
      });

      setTransactions(data.transactions);
      setError("");
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

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter =
      activeFilter === "ALL" ? true : tx.type === activeFilter;
    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : tx.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className={styles.transactions}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <div className={styles.headerTag}>Statement & Activity</div>
            <h1>Transactions</h1>
            <p>View your full history of incoming and outgoing transfers.</p>
          </div>

          <button
            type="button"
            className={styles.refreshBtn}
            onClick={loadTransactions}
            title="Refresh transactions"
            disabled={isLoading}
          >
            <FiRefreshCw className={isLoading ? styles.spinner : ""} />
            <span>Refresh</span>
          </button>
        </header>

        {error && (
          <div className={styles.errorAlert} role="alert">
            {error}
          </div>
        )}

        <section className={styles.card}>
          {/* TOOLBAR */}
          <div className={styles.toolbar}>
            <div className={styles.filterTabs}>
              <button
                type="button"
                className={`${styles.tab} ${
                  activeFilter === "ALL" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveFilter("ALL")}
              >
                All
              </button>
              <button
                type="button"
                className={`${styles.tab} ${
                  activeFilter === "TRANSFER" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveFilter("TRANSFER")}
              >
                Transfers
              </button>
              <button
                type="button"
                className={`${styles.tab} ${
                  activeFilter === "DEPOSIT" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveFilter("DEPOSIT")}
              >
                Deposits
              </button>
            </div>

            <div className={styles.searchWrapper}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Search reference or note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* CONTENT */}
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <FiRefreshCw className={styles.spinner} />
              <p>Loading your transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className={styles.emptyContainer}>
              <EmptyState
                icon={<FiFilter />}
                title={
                  transactions.length === 0
                    ? "No transactions yet"
                    : "No matching transactions"
                }
                description={
                  transactions.length === 0
                    ? "Your transactions will appear here once you send or receive money."
                    : "Try adjusting your search query or filter tab."
                }
              />
            </div>
          ) : (
            <div className={styles.transactionsList}>
              {filteredTransactions.map((tx) => {
                const isDebit = tx.direction === "DEBIT";
                return (
                  <article key={tx.id} className={styles.transactionItem}>
                    <div
                      className={`${styles.iconCircle} ${
                        isDebit ? styles.debitBg : styles.creditBg
                      }`}
                    >
                      {isDebit ? <FiArrowUpRight /> : <FiArrowDownLeft />}
                    </div>

                    <div className={styles.primaryInfo}>
                      <div className={styles.titleRow}>
                        <strong className={styles.txTitle}>
                          {tx.description || (isDebit ? "Sent money" : "Received money")}
                        </strong>
                        <span className={styles.typeBadge}>{tx.type}</span>
                      </div>
                      <div className={styles.metaRow}>
                        <span className={styles.refCode}>Ref: {tx.reference}</span>
                        <span className={styles.dot}>•</span>
                        <span className={styles.txDate}>
                          <FiCalendar className={styles.dateIcon} />
                          {new Date(tx.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className={styles.amountCol}>
                      <span
                        className={`${styles.amountText} ${
                          isDebit ? styles.amountDebit : styles.amountCredit
                        }`}
                      >
                        {isDebit ? "-" : "+"}
                        ₦
                        {Number(tx.amount).toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span
                        className={`${styles.statusBadge} ${
                          tx.status === "SUCCESSFUL"
                            ? styles.statusSuccess
                            : tx.status === "FAILED"
                            ? styles.statusFailed
                            : styles.statusPending
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Transactions;
