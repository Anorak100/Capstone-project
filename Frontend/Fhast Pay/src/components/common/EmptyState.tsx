import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      {icon && <div className={styles.icon}>{icon}</div>}

      <h2>{title}</h2>

      {description && <p>{description}</p>}

      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

export default EmptyState;
