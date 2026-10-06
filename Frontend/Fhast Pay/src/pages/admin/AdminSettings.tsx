import { useState } from "react";
import { FiShield, FiBell, FiLock, FiCheck } from "react-icons/fi";
import Toast from "../../components/common/Toast";
import styles from "./AdminSettings.module.css";

function AdminSettings() {
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [passwordPolicy, setPasswordPolicy] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const handleToggle = (setting: string, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => {
      const next = !prev;
      setToast(`${setting} has been ${next ? "enabled" : "disabled"}.`);
      return next;
    });
  };

  return (
    <main className={styles.settings}>
      {toast && (
        <Toast
          message={toast}
          type="info"
          onClose={() => setToast(null)}
        />
      )}
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTag}>System Configuration</div>
          <h1>Platform Settings</h1>
          <p>Configure security parameters, audit alerts, and authentication policies for Fhast Pay.</p>
        </header>

        <section className={styles.card}>
          <div className={styles.setting}>
            <div className={styles.icon}>
              <FiShield />
            </div>

            <div className={styles.content}>
              <h2>Multi-Admin Authorization</h2>
              <p>
                Require secondary administrative approval for high-value flagged transactions above ₦1,000,000.
              </p>
            </div>

            <button
              type="button"
              className={`${styles.toggle} ${securityEnabled ? styles.toggleActive : ""}`}
              onClick={() => handleToggle("Multi-Admin Authorization", setSecurityEnabled)}
              aria-label="Toggle Multi-Admin Authorization"
            >
              <span className={styles.toggleKnob}>
                {securityEnabled && <FiCheck className={styles.checkIcon} />}
              </span>
            </button>
          </div>

          <div className={styles.setting}>
            <div className={styles.icon}>
              <FiBell />
            </div>

            <div className={styles.content}>
              <h2>High-Volume Activity Alerts</h2>
              <p>
                Send real-time alerts to the administrative security team on sudden transaction velocity spikes.
              </p>
            </div>

            <button
              type="button"
              className={`${styles.toggle} ${notificationsEnabled ? styles.toggleActive : ""}`}
              onClick={() => handleToggle("High-Volume Alerts", setNotificationsEnabled)}
              aria-label="Toggle High-Volume Alerts"
            >
              <span className={styles.toggleKnob}>
                {notificationsEnabled && <FiCheck className={styles.checkIcon} />}
              </span>
            </button>
          </div>

          <div className={styles.setting}>
            <div className={styles.icon}>
              <FiLock />
            </div>

            <div className={styles.content}>
              <h2>6-Digit PIN Validation Strictness</h2>
              <p>
                Reject consecutive and repeated patterns (e.g. 111111, 123456) during user registration.
              </p>
            </div>

            <button
              type="button"
              className={`${styles.toggle} ${passwordPolicy ? styles.toggleActive : ""}`}
              onClick={() => handleToggle("Strict PIN Policy", setPasswordPolicy)}
              aria-label="Toggle PIN Policy"
            >
              <span className={styles.toggleKnob}>
                {passwordPolicy && <FiCheck className={styles.checkIcon} />}
              </span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminSettings;
