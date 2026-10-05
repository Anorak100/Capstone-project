import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import styles from "./Withdraw.module.css";

function Withdraw() {
  return (
    <main className={styles.withdraw}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Withdraw</h1>

          <p>Withdraw money from your Fhast Pay account.</p>
        </header>

        <section className={styles.card}>
          <form className={styles.form}>
            <Input
              id="amount"
              label="Amount"
              type="number"
              min="0"
              placeholder="Enter amount"
            />

            <div className={styles.formGroup}>
              <label htmlFor="description">
                Description <span>(optional)</span>
              </label>

              <textarea
                id="description"
                placeholder="Add a note for this withdrawal"
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

export default Withdraw;
