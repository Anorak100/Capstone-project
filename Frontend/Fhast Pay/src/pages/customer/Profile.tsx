import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShield,
  FiCopy,
  FiCheck,
  FiLogOut,
  FiLock,
  FiCheckCircle,
  FiSmartphone,
} from "react-icons/fi";
import { getBalance, type Account } from "../../services/accountService";
import styles from "./Profile.module.css";

function Profile() {
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account | null>(null);
  const [user, setUser] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    // Load account
    getBalance(token)
      .then((accs) => {
        if (accs[0]) setAccount(accs[0]);
      })
      .catch(() => {});

    // Try reading stored user or parse token
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleCopy = () => {
    if (!account?.accountNumber) return;
    navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const displayName = user?.fullName || "Fhast Pay Customer";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className={styles.profile}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTag}>My Account</div>
          <h1>Profile & Settings</h1>
          <p>Manage your account credentials and personal information.</p>
        </header>

        {/* HERO PROFILE CARD */}
        <section className={styles.heroCard}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.heroInfo}>
            <div className={styles.nameRow}>
              <h2>{displayName}</h2>
              <span className={styles.verifiedBadge}>
                <FiCheckCircle /> Verified
              </span>
            </div>
            <p className={styles.emailText}>
              {user?.email || "Personal Banking Account"}
            </p>
          </div>
        </section>

        {/* ACCOUNT INFORMATION */}
        <section className={styles.sectionCard}>
          <h3 className={styles.cardTitle}>Account Details</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Account Number</span>
              <div className={styles.accountNumberRow}>
                <strong className={styles.detailValue}>
                  {account?.accountNumber || "Loading..."}
                </strong>
                {account?.accountNumber && (
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={handleCopy}
                    title="Copy account number"
                  >
                    {copied ? <FiCheck className={styles.greenCheck} /> : <FiCopy />}
                  </button>
                )}
              </div>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Account Type</span>
              <strong className={styles.detailValue}>Standard Checking</strong>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Base Currency</span>
              <strong className={styles.detailValue}>
                {account?.currency || "NGN"} (Nigerian Naira)
              </strong>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Account Status</span>
              <span className={styles.statusActive}>Active & Operational</span>
            </div>
          </div>
        </section>

        {/* SECURITY & PREFERENCES */}
        <section className={styles.sectionCard}>
          <h3 className={styles.cardTitle}>Security & Credentials</h3>
          <div className={styles.securityList}>
            <div className={styles.securityItem}>
              <div className={styles.secIcon}>
                <FiLock />
              </div>
              <div className={styles.secContent}>
                <strong>6-Digit Transaction PIN</strong>
                <p>Used to authorize money transfers and account changes</p>
              </div>
              <span className={styles.statusPill}>Protected</span>
            </div>

            <div className={styles.securityItem}>
              <div className={styles.secIcon}>
                <FiSmartphone />
              </div>
              <div className={styles.secContent}>
                <strong>Phone Authentication</strong>
                <p>{user?.phone ? `Linked to ${user.phone}` : "Linked to registered mobile"}</p>
              </div>
              <span className={styles.statusPill}>Active</span>
            </div>

            <div className={styles.securityItem}>
              <div className={styles.secIcon}>
                <FiShield />
              </div>
              <div className={styles.secContent}>
                <strong>Bank-Grade Encryption</strong>
                <p>256-bit TLS encryption across all endpoints</p>
              </div>
              <span className={styles.statusPill}>Enabled</span>
            </div>
          </div>
        </section>

        {/* DANGER ZONE */}
        <div className={styles.logoutWrapper}>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default Profile;
