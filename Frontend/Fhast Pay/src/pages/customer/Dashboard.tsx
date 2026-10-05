import { useEffect, useState } from "react";
import { getBalance, type Account } from "../../services/accountService";
import EmptyState from "../../components/common/EmptyState";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBalance = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("You are not signed in.");
        setIsLoading(false);
        return;
      }

      try {
        const accounts = await getBalance(token);

        setAccount(accounts[0] ?? null);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load account balance",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBalance();
  }, []);

  return (
    <main className={styles.dashboard}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Customer dashboard</p>
            <h1>Welcome back</h1>
            <p>Here&apos;s an overview of your Fhast Pay account.</p>
          </div>
        </header>

        <section className={styles.balanceCard}>
          <div>
            <span>Available balance</span>

            {isLoading ? (
              <strong>Loading...</strong>
            ) : error ? (
              <strong>Unable to load balance</strong>
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

          <div>
            <span>Account</span>
            <strong>{account?.accountNumber ?? "—"}</strong>
          </div>
        </section>

        {error && <p role="alert">{error}</p>}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Recent transactions</h2>
              <p>Your latest account activity will appear here.</p>
            </div>
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

export default Dashboard;
