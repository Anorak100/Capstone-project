import { NavLink } from "react-router-dom";
import { FiSend, FiPlusCircle, FiMinusCircle, FiUser } from "react-icons/fi";
import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <main className={styles.dashboard}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.greeting}>Welcome back</p>
            <h1>Blessing</h1>
          </div>

          <NavLink
            to="/profile"
            className={styles.profileButton}
            aria-label="Profile"
          >
            <FiUser />
          </NavLink>
        </header>

        <section className={styles.balanceCard}>
          <div>
            <p className={styles.balanceLabel}>Available balance</p>

            <h2>₦0.00</h2>

            <p className={styles.accountNumber}>Account ####0000</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Quick actions</h2>
          </div>

          <div className={styles.actions}>
            <NavLink to="/transfer" className={styles.actionCard}>
              <FiSend className={styles.actionIcon} />

              <span>
                <strong>Transfer</strong>
                <small>Send money</small>
              </span>
            </NavLink>

            <NavLink to="/deposit" className={styles.actionCard}>
              <FiPlusCircle className={styles.actionIcon} />

              <span>
                <strong>Deposit</strong>
                <small>Add money</small>
              </span>
            </NavLink>

            <NavLink to="/withdraw" className={styles.actionCard}>
              <FiMinusCircle className={styles.actionIcon} />

              <span>
                <strong>Withdraw</strong>
                <small>Take out money</small>
              </span>
            </NavLink>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Recent transactions</h2>

            <NavLink to="/transactions" className={styles.viewAll}>
              View all
            </NavLink>
          </div>

          <div className={styles.Recenttransactions}>
            <div className={styles.transactionsIcon}>#</div>

            <h3>No transactions yet</h3>

            <p>
              Your transactions will appear here once you start using your Fhast
              Pay account.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
