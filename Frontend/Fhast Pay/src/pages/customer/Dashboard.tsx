import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSend,
  FiList,
  FiUser,
  FiCopy,
  FiCheck,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiWifi,
} from "react-icons/fi";
import { getBalance, type Account } from "../../services/accountService";
import {
  getTransactions,
  type Transaction,
} from "../../services/transactionService";
import EmptyState from "../../components/common/EmptyState";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [account, setAccount] = useState<Account | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("You are not signed in.");
        setIsLoading(false);
        return;
      }

      try {
        const [accounts, txData] = await Promise.all([
          getBalance(token).catch(() => []),
          getTransactions(token, { page: 1, limit: 5 }).catch(() => ({
            transactions: [],
          })),
        ]);

        setAccount(accounts[0] ?? null);
        setRecentTransactions(txData.transactions ?? []);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load dashboard information",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleCopyAccount = () => {
    if (!account?.accountNumber) return;
    navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className={styles.dashboard}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <div className={styles.welcomeBadge}>
              <span className={styles.pulseDot} />
              Verified Account
            </div>
            <h1>Welcome back</h1>
            <p>Here is an overview of your Fhast Pay finances.</p>
          </div>
        </header>

        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        {/* LUXURY FINTECH DEBIT CARD */}
        <section className={styles.cardSection}>
          <div className={styles.creditCard}>
            <div className={styles.cardGlow} />
            <div className={styles.cardTop}>
              <div className={styles.cardBrand}>
                <span className={styles.cardLogo}>FHAST PAY</span>
                <span className={styles.cardType}>Debit</span>
              </div>
              <FiWifi className={styles.wirelessIcon} />
            </div>

            <div className={styles.chipGraphic}>
              <div className={styles.chipLine} />
              <div className={styles.chipLine} />
            </div>

            <div className={styles.balanceDisplay}>
              <span className={styles.balanceLabel}>Available Balance</span>
              <div className={styles.balanceAmount}>
                {isLoading ? (
                  <span className={styles.skeletonText}>Loading...</span>
                ) : (
                  <strong>
                    {account?.currency ?? "NGN"}{" "}
                    {Number(account?.balance ?? 0).toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                )}
              </div>
            </div>

            <div className={styles.cardBottom}>
              <div className={styles.accountBlock}>
                <span className={styles.accountNumberLabel}>Account Number</span>
                <div className={styles.accountNumberRow}>
                  <strong className={styles.accountNumber}>
                    {account?.accountNumber ?? "•••• •••• ••••"}
                  </strong>
                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={handleCopyAccount}
                    title="Copy account number"
                    disabled={!account?.accountNumber}
                  >
                    {copied ? (
                      <span className={styles.copiedText}>
                        <FiCheck /> Copied
                      </span>
                    ) : (
                      <FiCopy />
                    )}
                  </button>
                </div>
              </div>
              <div className={styles.currencyBadge}>
                <span>{account?.currency ?? "NGN"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className={styles.actionsSection}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <Link to="/transfer" className={styles.actionCard}>
              <div className={`${styles.actionIcon} ${styles.sendIcon}`}>
                <FiSend />
              </div>
              <div className={styles.actionDetails}>
                <strong>Send Money</strong>
                <p>Transfer instantly to any account</p>
              </div>
            </Link>

            <Link to="/transactions" className={styles.actionCard}>
              <div className={`${styles.actionIcon} ${styles.historyIcon}`}>
                <FiList />
              </div>
              <div className={styles.actionDetails}>
                <strong>History</strong>
                <p>View all statements & activity</p>
              </div>
            </Link>

            <Link to="/profile" className={styles.actionCard}>
              <div className={`${styles.actionIcon} ${styles.profileIcon}`}>
                <FiUser />
              </div>
              <div className={styles.actionDetails}>
                <strong>Profile</strong>
                <p>Manage security & details</p>
              </div>
            </Link>
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Recent Activity</h2>
              <p>Your latest incoming and outgoing transactions.</p>
            </div>
            {recentTransactions.length > 0 && (
              <Link to="/transactions" className={styles.viewAllLink}>
                View all activity →
              </Link>
            )}
          </div>

          <div className={styles.transactionsCard}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <p>Loading transactions...</p>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className={styles.emptyContainer}>
                <EmptyState
                  title="No transactions yet"
                  description="Your transactions will appear here once you start using your Fhast Pay account."
                />
                <Link to="/transfer" className={styles.firstTransferButton}>
                  <FiSend /> Send your first transfer
                </Link>
              </div>
            ) : (
              <div className={styles.transactionsList}>
                {recentTransactions.map((tx) => {
                  const isDebit = tx.direction === "DEBIT";
                  return (
                    <div key={tx.id} className={styles.transactionRow}>
                      <div
                        className={`${styles.txIconWrapper} ${
                          isDebit ? styles.debitIcon : styles.creditIcon
                        }`}
                      >
                        {isDebit ? <FiArrowUpRight /> : <FiArrowDownLeft />}
                      </div>

                      <div className={styles.txInfo}>
                        <strong className={styles.txType}>{tx.type}</strong>
                        <span className={styles.txDescription}>
                          {tx.description || (isDebit ? "Sent money" : "Received money")}
                        </span>
                        <small className={styles.txDate}>
                          {new Date(tx.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>

                      <div className={styles.txAmountWrapper}>
                        <strong
                          className={`${styles.txAmount} ${
                            isDebit ? styles.amountDebit : styles.amountCredit
                          }`}
                        >
                          {isDebit ? "-" : "+"}
                          {Number(tx.amount).toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </strong>
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
