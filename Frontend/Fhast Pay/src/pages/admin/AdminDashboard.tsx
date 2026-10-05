import {
  FiUsers,
  FiActivity,
  FiArrowDownCircle,
  FiArrowUpCircle,
} from "react-icons/fi";
import EmptyState from "../../components/common/EmptyState";
import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
  return (
    <main className={styles.dashboard}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Administration</p>

            <h1>Dashboard</h1>

            <p>Monitor Fhast Pay activity and manage the platform.</p>
          </div>
        </header>

        <section className={styles.metrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <FiUsers />
            </div>

            <div>
              <span>Total users</span>
              <strong>0</strong>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <FiActivity />
            </div>

            <div>
              <span>Total transactions</span>
              <strong>0</strong>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <FiArrowDownCircle />
            </div>

            <div>
              <span>Total deposits</span>
              <strong>₦0.00</strong>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <FiArrowUpCircle />
            </div>

            <div>
              <span>Total withdrawals</span>
              <strong>₦0.00</strong>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Recent activity</h2>

              <p>Recent transactions across the platform.</p>
            </div>
          </div>

          <EmptyState
            icon={<FiActivity />}
            title="No activity yet"
            description="Platform activity will appear here once users begin making transactions."
          />
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
