import { Link } from "react-router-dom";
import styles from "./Register.module.css";

function Register() {
  return (
    <main className={styles.register}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.badge}>FHAST PAY</span>

          <h1>Create your account</h1>

          <p>
            Open your Fhast Pay account and start managing your finances
            securely.
          </p>
        </div>

        <form className={styles.form}>
          <div className={styles.nameRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First name</label>

              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First name"
                autoComplete="given-name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last name</label>

              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last name"
                autoComplete="family-name"
                required
              />
            </div>
          </div>

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
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm password</label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className={styles.registerButton}>
            Create Account
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
