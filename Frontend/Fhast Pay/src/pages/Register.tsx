import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    if (password !== String(formData.get("confirmPassword") ?? "")) {
      setError("Passwords do not match");
      return;
    }

    const data = {
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      password,
    };

    setIsSubmitting(true);
    try {
      const response = await registerUser(data);
      navigate("/verify-account", {
        state: { email: data.email, notice: response.message },
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

        <form className={styles.form} onSubmit={handleSubmit}>
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

          {error && <p className={styles.errorMessage} role="alert">{error}</p>}

          <button
            type="submit"
            className={styles.registerButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
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
