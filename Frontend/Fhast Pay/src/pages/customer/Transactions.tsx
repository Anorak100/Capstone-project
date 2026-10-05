import { useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import {
  getTransactions,
  type Transaction,
} from "../../services/transactionService";

import styles from "./Transactions.module.css";

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("You are not signed in.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getTransactions(token, {
          page: 1,
          limit: 10,
        });

        setTransactions(data.transactions);
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
  }, []);

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

          {isLoading ? (
            <p>Loading transactions...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : transactions.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              description="Your transactions will appear here once you start using your Fhast Pay account."
            />
          ) : (
            <div>
              {transactions.map((transaction) => (
                <article key={transaction.id}>
                  <div>
                    <strong>{transaction.type}</strong>

                    <p>{transaction.description || "Transaction"}</p>
                  </div>

                  <div>
                    <strong>
                      {transaction.direction === "DEBIT" ? "-" : "+"}
                      {Number(transaction.amount).toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>

                    <p>{transaction.status}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Transactions;
