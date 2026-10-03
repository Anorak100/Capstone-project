import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const notice = (location.state as { notice?: string } | null)?.notice;
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.login}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.badge}>FHAST PAY</span>
          <h1>Welcome back</h1>
          <p>Sign in with your phone number and password.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              autoComplete="tel"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.passwordHeader}>
              <label htmlFor="password">Password</label>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {notice && <p className={styles.noticeMessage} role="status">{notice}</p>}
          {error && <p className={styles.errorMessage} role="alert">{error}</p>}

          <button type="submit" className={styles.loginButton} disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className={styles.registerText}>
          Don&apos;t have an account? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
