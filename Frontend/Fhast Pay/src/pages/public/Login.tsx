import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShield, FiPhone, FiLock, FiArrowRight } from "react-icons/fi";
import { loginUser } from "../../services/authService";
import Toast from "../../components/common/Toast";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const notice = (location.state as { notice?: string } | null)?.notice;
  const [toastMessage, setToastMessage] = useState<string | null>(notice ?? null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (notice) {
      setToastMessage(notice);
      window.history.replaceState({}, document.title);
    }
  }, [notice]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await loginUser({
        phone: String(formData.get("phone") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
      });
      localStorage.setItem("authToken", response.data.token);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      const destination =
        response.data.user?.role === "ADMIN" ? "/admin" : "/dashboard";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to sign in",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.login}>
      <div className={styles.ambientGlow} />
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoBadge}>
            <FiShield />
          </div>
          <span className={styles.badge}>FHAST PAY</span>
          <h1>Welcome back</h1>
          <p>Sign in with your phone number and 6-digit password.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
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
            <div className={styles.passwordHeader}>
              <label htmlFor="password">6-Digit Password</label>
            </div>
            <div className={styles.inputWrapper}>
              <FiLock className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                name="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                autoComplete="current-password"
                required
                className={styles.input}
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Signing in..."
            ) : (
              <>
                Sign In <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <p className={styles.registerText}>
          Don&apos;t have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
