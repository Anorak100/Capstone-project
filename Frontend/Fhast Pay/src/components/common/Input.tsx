import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <input
        id={id}
        className={`${styles.input} ${error ? styles.inputError : ""} ${className}`}
        {...props}
      />

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default Input;
