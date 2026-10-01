import styles from "./Dashboard.module.css";
import { FiSend, FiPlus, FiMinus, FiUser } from "react-icons/fi";

function Dashboard() {
  return (
    <main className={styles.dashboard}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.greeting}>Welcome back</p>
            <h1>John</h1>
          </div>

          <button
            type="button"
            className={styles.profileButton}
            aria-label="Profile"
          >
            <FiUser />
            <span className={styles.profileTooltip}>Profile</span>
          </button>
        </header>

        <section className={styles.balanceCard}>
          <div>
            <p className={styles.balanceLabel}>Available balance</p>

            <h2>#0.00</h2>

            <p className={styles.accountNumber}>Account ####0000</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Quick actions</h2>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.actionCard}>
              <FiSend className={styles.actionIcon} />
              <span>
                <strong>Transfer</strong>
                <small>Send money</small>
              </span>
            </button>

            <button type="button" className={styles.actionCard}>
              <FiPlus className={styles.actionIcon} />
              <span>
                <strong>Deposit</strong>
                <small>Add money</small>
              </span>
            </button>

            <button type="button" className={styles.actionCard}>
              <FiMinus className={styles.actionIcon} />
              <span>
                <strong>Withdraw</strong>
                <small>Take out money</small>
              </span>
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Recent transactions</h2>

            <button type="button" className={styles.viewAll}>
              View all
            </button>
          </div>

          <div className={styles.Recenttransactions}>
            <div className={styles.transactionsIcon}>#</div>

            <h3>No transactions yet</h3>

            <p>
              Your recent transactions will appear here once you start using
              your account.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
