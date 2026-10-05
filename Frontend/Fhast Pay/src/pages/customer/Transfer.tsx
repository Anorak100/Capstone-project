import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import styles from "./Transfer.module.css";

function Transfer() {
  return (
    <main className={styles.transfer}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Transfer Money</h1>
          <p>Send money securely to another account.</p>
        </header>

        <section className={styles.card}>
          <form className={styles.form}>
            <Input
              id="accountNumber"
              label="Recipient account number"
              type="text"
              placeholder="Enter account number"
              required
            />

            <Input
              id="amount"
              label="Amount"
              type="number"
              min="0"
              placeholder="Enter amount"
              required
            />

            <div className={styles.formGroup}>
              <label htmlFor="description">
                Description <span>(optional)</span>
              </label>

              <textarea
                id="description"
                placeholder="What is this transfer for?"
                rows={4}
              />
            </div>

            <Button type="submit">Continue</Button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Transfer;
