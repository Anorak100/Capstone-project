import EmptyState from "../../components/common/EmptyState";

import styles from "./Transactions.module.css";

function Transactions() {
  return (
    <main className={styles.transactions}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Account activity</p>

            <h1>Transactions</h1>

            <p>View your recent account activity and transaction history.</p>
          </div>
        </header>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Transaction history</h2>
          </div>

          <EmptyState
            title="No transactions yet"
            description="Your transactions will appear here once you start using your Fhast Pay account."
          />
        </section>
      </div>
    </main>
  );
}

export default Transactions;
