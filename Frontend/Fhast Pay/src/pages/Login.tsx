import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  return (
    <main className={styles.login}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.badge}>FHAST PAY</span>

          <h1>Welcome back</h1>

          <p>Sign in to your account to continue banking.</p>
        </div>

        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            navigate("/dashboard");
          }}
        >
          <div className={styles.formGroup}>
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.passwordHeader}>
              <label htmlFor="password">Password</label>

              <a href="/forgot-password">Forgot password?</a>
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

          <button type="submit" className={styles.loginButton}>
            Sign In
          </button>
        </form>

        <p className={styles.registerText}>
          Don't have an account? <a href="/register">Create an account</a>
        </p>
      </div>
    </main>
  );
}

export default Login;
