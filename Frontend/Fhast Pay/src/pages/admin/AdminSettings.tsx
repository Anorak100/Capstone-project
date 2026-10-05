import { FiShield, FiBell, FiLock } from "react-icons/fi";
import styles from "./AdminSettings.module.css";

function AdminSettings() {
  return (
    <main className={styles.settings}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Administration</p>

          <h1>Settings</h1>

          <p>Manage administrative preferences for Fhast Pay.</p>
        </header>

        <section className={styles.card}>
          <div className={styles.setting}>
            <div className={styles.icon}>
              <FiShield />
            </div>

            <div className={styles.content}>
              <h2>Admin security</h2>

              <p>
                Manage security and access controls for the administration area.
              </p>
            </div>

            <span className={styles.status}>Enabled</span>
          </div>

          <div className={styles.setting}>
            <div className={styles.icon}>
              <FiBell />
            </div>

            <div className={styles.content}>
              <h2>Notifications</h2>

              <p>
                Configure notifications for important account and transaction
                activity.
              </p>
            </div>

            <span className={styles.status}>Enabled</span>
          </div>

          <div className={styles.setting}>
            <div className={styles.icon}>
              <FiLock />
            </div>

            <div className={styles.content}>
              <h2>Password security</h2>

              <p>Review password and authentication requirements.</p>
            </div>

            <span className={styles.status}>Enabled</span>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminSettings;
