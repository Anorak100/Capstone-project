import {
  FiUsers,
  FiActivity,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiTrendingUp,
} from "react-icons/fi";
import EmptyState from "../../components/common/EmptyState";
import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
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
            <p>Monitor system volume, active accounts, and transactions across Fhast Pay.</p>
          </div>
        </header>

        <section className={styles.metrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricTop}>
              <div className={`${styles.metricIcon} ${styles.usersIcon}`}>
                <FiUsers />
              </div>
              <span className={styles.trendPill}>
                <FiTrendingUp /> +14%
              </span>
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Total Users</span>
              <strong className={styles.metricValue}>1,248</strong>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricTop}>
              <div className={`${styles.metricIcon} ${styles.activityIcon}`}>
                <FiActivity />
              </div>
              <span className={styles.trendPill}>
                <FiTrendingUp /> +22%
              </span>
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Total Transactions</span>
              <strong className={styles.metricValue}>8,490</strong>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricTop}>
              <div className={`${styles.metricIcon} ${styles.depositIcon}`}>
                <FiArrowDownCircle />
              </div>
              <span className={styles.trendPill}>
                <FiTrendingUp /> +18%
              </span>
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Processed Volume</span>
              <strong className={styles.metricValue}>₦42,850,000.00</strong>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricTop}>
              <div className={`${styles.metricIcon} ${styles.withdrawIcon}`}>
                <FiArrowUpCircle />
              </div>
              <span className={styles.trendPill}>
                <FiTrendingUp /> +9%
              </span>
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Daily Volume</span>
              <strong className={styles.metricValue}>₦3,120,500.00</strong>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Recent Platform Activity</h2>
              <p>Real-time audit log of ledger actions and account creations.</p>
            </div>
          </div>

          <div className={styles.activityCard}>
            <EmptyState
              icon={<FiActivity />}
              title="Platform Ledger Synchronized"
              description="All background jobs, transactions, and account events are operating normally."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
