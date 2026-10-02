import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  resendVerification,
  verifyAccount,
} from "../services/authService";
import type { VerificationData } from "../services/authService";
import styles from "./VerifyAccount.module.css";

function VerifyAccount() {
  const location = useLocation();
  const routeState = location.state as
    | { email?: string; notice?: string }
    | null;
  const [email, setEmail] = useState(routeState?.email ?? "");
  const [notice, setNotice] = useState(routeState?.notice ?? "");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verification, setVerification] = useState<VerificationData | null>(null);

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const formData = new FormData(event.currentTarget);
    setIsVerifying(true);
    try {
      const response = await verifyAccount({
        identifier: email.trim(),
        code: String(formData.get("code") ?? "").trim(),
      });
      setVerification(response.data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to verify your account",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setNotice("");
    setIsResending(true);
    try {
      const response = await resendVerification(email.trim());
      setNotice(response.message);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to resend your verification code",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className={styles.verify}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.badge}>FHAST PAY</span>

          <h1>Verify your account</h1>

          <p>Enter the verification code sent to your email address to continue.</p>
        </div>

        {verification ? (
          <section className={styles.accountSummary} aria-live="polite">
            <h2>Your account is ready</h2>
            <p>Account number</p>
            <strong>{verification.account.accountNumber}</strong>
            <p>
              {verification.account.currency} {verification.account.balance}
            </p>
            <Link to="/login" className={styles.verifyButton}>
              Continue to sign in
            </Link>
          </section>
        ) : (
          <>
            <form className={styles.form} onSubmit={handleVerify}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email address</label>
                <input
                  className={styles.emailInput}
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="code">Verification code</label>
                <input
                  id="code"
                  type="text"
                  name="code"
                  placeholder="6-digit code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
              </div>

              {error && <p className={styles.errorMessage} role="alert">{error}</p>}
              {notice && <p className={styles.noticeMessage} role="status">{notice}</p>}

              <button
                type="submit"
                className={styles.verifyButton}
                disabled={isVerifying || !email.trim()}
              >
                {isVerifying ? "Verifying..." : "Verify Account"}
              </button>
            </form>

            <div className={styles.resend}>
              <p>Didn't receive the code?</p>
              <button
                type="button"
                className={styles.resendButton}
                onClick={handleResend}
                disabled={isResending || !email.trim()}
              >
                {isResending ? "Sending..." : "Resend code"}
              </button>
            </div>
          </>
        )}

        <Link to="/login" className={styles.backLink}>
          Back to Sign In
        </Link>
      </div>
    </main>
  );
}

export default VerifyAccount;
