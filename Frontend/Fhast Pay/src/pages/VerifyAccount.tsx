import { Link } from "react-router-dom";
import styles from "./VerifyAccount.module.css";

function VerifyAccount() {
  return (
    <main className={styles.verify}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.badge}>FHAST PAY</span>

          <h1>Verify your account</h1>

          <p>
            Enter the verification code sent to your email address to continue.
          </p>
        </div>

        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="verificationCode">Verification code</label>

            <input
              id="verificationCode"
              type="text"
              name="verificationCode"
              placeholder="Enter verification code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
            />
          </div>

          <button type="submit" className={styles.verifyButton}>
            Verify Account
          </button>
        </form>

        <div className={styles.resend}>
          <p>Didn't receive the code?</p>

          <button type="button" className={styles.resendButton}>
            Resend code
          </button>
        </div>

        <Link to="/login" className={styles.backLink}>
          Back to Sign In
        </Link>
      </div>
    </main>
  );
}

export default VerifyAccount;
