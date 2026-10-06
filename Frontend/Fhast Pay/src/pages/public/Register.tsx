import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShield,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiArrowRight,
  FiAlertCircle,
  FiGift,
  FiX,
} from "react-icons/fi";
import { registerUser } from "../../services/authService";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bonusDetails, setBonusDetails] = useState<{
    firstName: string;
    accountNumber: string;
  } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    if (!/^\d{6}$/.test(password)) {
      setError("Password must be a 6-digit number");
      return;
    }

    if (password !== String(formData.get("confirmPassword") ?? "")) {
      setError("Passwords do not match");
      return;
    }

    const firstName = String(formData.get("firstName") ?? "").trim();
    const data = {
      firstName,
      lastName: String(formData.get("lastName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      password,
    };

    setIsSubmitting(true);
    try {
      const response = await registerUser(data);
      // Display celebratory welcome bonus modal
      setBonusDetails({
        firstName: response.data?.user?.firstName || firstName,
        accountNumber: response.data?.account?.accountNumber || "",
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create your account",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToLogin = () => {
    navigate("/login", {
      state: {
        notice:
          "Account created with ₦100,000 welcome bonus! Please sign in with your phone number and 6-digit password.",
      },
    });
  };

  return (
    <main className={styles.register}>
      <div className={styles.ambientGlow} />
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoBadge}>
            <FiShield />
          </div>
          <span className={styles.badge}>FHAST PAY</span>
          <h1>Create your account</h1>
          <p>
            Open your personal banking account and start managing your finances securely.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.nameRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First name</label>
              <div className={styles.inputWrapper}>
                <FiUser className={styles.inputIcon} />
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last name</label>
              <div className={styles.inputWrapper}>
                <FiUser className={styles.inputIcon} />
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email address</label>
            <div className={styles.inputWrapper}>
              <FiMail className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone number</label>
            <div className={styles.inputWrapper}>
              <FiPhone className={styles.inputIcon} />
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="e.g. 08123456789"
                autoComplete="tel"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">6-Digit Password</label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                name="password"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="Enter 6-digit password"
                autoComplete="new-password"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.inputIcon} />
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="Confirm 6-digit password"
                autoComplete="new-password"
                required
                className={styles.input}
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage} role="alert">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={styles.registerButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Creating account..."
            ) : (
              <>
                Create Account <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      {bonusDetails && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard} role="dialog" aria-modal="true">
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={handleProceedToLogin}
              aria-label="Close"
            >
              <FiX />
            </button>

            <div className={styles.modalCelebrationBadge}>
              <FiGift className={styles.giftIcon} />
            </div>

            <span className={styles.modalPill}>WELCOME BONUS UNLOCKED</span>

            <h2 className={styles.modalTitle}>
              Congratulations, {bonusDetails.firstName}! 🎉
            </h2>

            <p className={styles.modalSubtitle}>
              Your Fhast Pay banking account has been created successfully.
            </p>

            <div className={styles.bonusAmountCard}>
              <span className={styles.bonusLabel}>Demo Balance Credited</span>
              <div className={styles.bonusAmount}>₦100,000.00</div>
              {bonusDetails.accountNumber && (
                <div className={styles.accountNumberBadge}>
                  Account Number: <strong>{bonusDetails.accountNumber}</strong>
                </div>
              )}
            </div>

            <p className={styles.modalNote}>
              You have been given a <strong>₦100,000 signup bonus</strong> to test instant transfers, explore your dashboard, and experience real-time transactions out of the box!
            </p>

            <button
              type="button"
              className={styles.modalActionBtn}
              onClick={handleProceedToLogin}
            >
              <span>Proceed to Sign In</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Register;
