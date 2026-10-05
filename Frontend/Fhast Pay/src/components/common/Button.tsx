import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`${styles.button} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
