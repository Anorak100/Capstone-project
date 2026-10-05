import { Link } from "react-router-dom";
import styles from "./Welcome.module.css";

function Welcome() {
  return (
    <main className={styles.welcome}>
      <div className={styles.content}>
        <span className={styles.badge}>FHAST PAY</span>

        <h1>Simple, Secure Banking.</h1>

        <p>
          Manage your account, send money, and keep track of your transactions
          in one place.
        </p>

        <div className={styles.actions}>
          <Link to="/register" className={styles.primaryButton}>
            Get Started
          </Link>

          <Link to="/login" className={styles.secondaryButton}>
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Welcome;
