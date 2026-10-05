import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import styles from "./Deposit.module.css";

function Deposit() {
  return (
    <main className={styles.deposit}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Deposit</h1>

          <p>Add money to your Fhast Pay account.</p>
        </header>

        <section className={styles.card}>
          <form className={styles.form}>
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
                placeholder="Add a note for this deposit"
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

export default Deposit;
