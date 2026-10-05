import { useEffect, useState } from "react";
import {
  FiUsers,
  FiActivity,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiRefreshCw,
  FiAlertCircle,
  FiArrowUpRight,
  FiArrowDownLeft,
} from "react-icons/fi";
import EmptyState from "../../components/common/EmptyState";
import {
  formatAdminDate,
  formatAdminMoney,
  getAdminMetrics,
  getAdminTransactions,
  getTransactionUserLabel,
  type AdminMetrics,
  type AdminTransaction,
} from "../../services/adminService";
import { getAuthToken } from "../../utils/authSession";
import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<AdminTransaction[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("You are not signed in.");
        setIsLoading(false);
        return;
      }

      try {
        const [metricsData, txData] = await Promise.all([
          getAdminMetrics(token),
          getAdminTransactions(token, { page: 1, limit: 8 }),
        ]);
        setMetrics(metricsData);
        setRecentActivity(txData.transactions);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load admin dashboard",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <main className={styles.dashboard}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <div className={styles.systemStatus}>
              <span className={styles.statusDot} />
              Platform Operational
            </div>
            <h1>Admin Overview</h1>
            <p>
              Monitor system volume, active accounts, and transactions across
              Fhast Pay.
            </p>
          </div>
        </header>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className={styles.loadingState}>
            <FiRefreshCw className={styles.spinner} />
            <p>Loading platform metrics...</p>
          </div>
        ) : metrics ? (
          <>
            <section className={styles.metrics}>
              <div className={styles.metricCard}>
                <div className={styles.metricTop}>
                  <div className={`${styles.metricIcon} ${styles.usersIcon}`}>
                    <FiUsers />
                  </div>
                  <span className={styles.metaPill}>
                    {metrics.users.active} active
                  </span>
                </div>
                <div className={styles.metricContent}>
                  <span className={styles.metricLabel}>Total Users</span>
                  <strong className={styles.metricValue}>
                    {metrics.users.total.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricTop}>
                  <div
                    className={`${styles.metricIcon} ${styles.activityIcon}`}
                  >
                    <FiActivity />
                  </div>
                  <span className={styles.metaPill}>
                    {metrics.accounts.active} active accounts
                  </span>
                </div>
                <div className={styles.metricContent}>
                  <span className={styles.metricLabel}>Total Transactions</span>
                  <strong className={styles.metricValue}>
                    {metrics.transactions.total.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricTop}>
                  <div
                    className={`${styles.metricIcon} ${styles.depositIcon}`}
                  >
                    <FiArrowDownCircle />
                  </div>
                </div>
                <div className={styles.metricContent}>
                  <span className={styles.metricLabel}>Processed Volume</span>
                  <strong className={styles.metricValue}>
                    {formatAdminMoney(metrics.volume.processed)}
                  </strong>
                </div>
              </div>

              <div className={styles.metricCard}>
                <div className={styles.metricTop}>
                  <div
                    className={`${styles.metricIcon} ${styles.withdrawIcon}`}
                  >
                    <FiArrowUpCircle />
                  </div>
                </div>
                <div className={styles.metricContent}>
                  <span className={styles.metricLabel}>Today&apos;s Volume</span>
                  <strong className={styles.metricValue}>
                    {formatAdminMoney(metrics.volume.today)}
                  </strong>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Recent Platform Activity</h2>
                  <p>Latest ledger entries across the platform.</p>
                </div>
              </div>

              <div className={styles.activityCard}>
                {recentActivity.length === 0 ? (
                  <EmptyState
                    icon={<FiActivity />}
                    title="No transactions yet"
                    description="Platform activity will appear here as users transact."
                  />
                ) : (
                  <ul className={styles.activityList}>
                    {recentActivity.map((tx) => (
                      <li key={tx.id} className={styles.activityItem}>
                        <div className={styles.activityIconWrap}>
                          {tx.direction === "DEBIT" ? (
                            <FiArrowUpRight />
                          ) : (
                            <FiArrowDownLeft />
                          )}
                        </div>
                        <div className={styles.activityDetails}>
                          <strong>{getTransactionUserLabel(tx)}</strong>
                          <span>
                            {tx.type} · {tx.reference}
                          </span>
                        </div>
                        <div className={styles.activityMeta}>
                          <strong>{formatAdminMoney(tx.amount)}</strong>
                          <span>{formatAdminDate(tx.createdAt)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

export default AdminDashboard;
