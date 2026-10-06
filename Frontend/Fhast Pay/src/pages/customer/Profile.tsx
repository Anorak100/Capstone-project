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
  FiX,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import {
  getBalance,
  getPinStatus,
  setTransactionPin,
  type Account,
} from "../../services/accountService";
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

  // PIN state
  const [hasPin, setHasPin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [isSubmittingPin, setIsSubmittingPin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    // Load account
    getBalance(token)
      .then((accs) => {
        if (accs[0]) setAccount(accs[0]);
      })
      .catch(() => {});

    // Check transaction PIN status
    getPinStatus(token)
      .then((status) => setHasPin(status))
      .catch(() => {});

    // Try reading stored user or parse token
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as {
          fullName?: string;
          email?: string;
          phone?: string;
          hasPin?: boolean;
        };
        setUser(parsed);
        if (parsed.hasPin) {
          setHasPin(true);
        }
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

  const handleOpenPinModal = () => {
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setPinError("");
    setShowPinModal(true);
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setPinSuccess("");

    if (hasPin && !/^\d{4}$/.test(currentPin)) {
      setPinError("Please enter your current 4-digit PIN");
      return;
    }
    if (!/^\d{4}$/.test(newPin)) {
      setPinError("New PIN must be a 4-digit number");
      return;
    }
    if (newPin !== confirmPin) {
      setPinError("New PINs do not match");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsSubmittingPin(true);
    try {
      await setTransactionPin(token, {
        pin: newPin,
        currentPin: hasPin ? currentPin : undefined,
      });
      setHasPin(true);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser) as Record<string, unknown>;
          localStorage.setItem(
            "user",
            JSON.stringify({ ...parsed, hasPin: true }),
          );
        } catch {
          // ignore
        }
      }
      setShowPinModal(false);
      setPinSuccess(
        hasPin
          ? "Transaction PIN updated successfully!"
          : "Transaction PIN created successfully!",
      );
      setTimeout(() => setPinSuccess(""), 4000);
    } catch (err) {
      setPinError(
        err instanceof Error ? err.message : "Failed to update transaction PIN",
      );
    } finally {
      setIsSubmittingPin(false);
    }
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

          {pinSuccess && (
            <div className={styles.successBanner} role="status">
              <FiCheckCircle />
              <span>{pinSuccess}</span>
            </div>
          )}

          <div className={styles.securityList}>
            <div className={styles.securityItem}>
              <div className={styles.secIcon}>
                <FiLock />
              </div>
              <div className={styles.secContent}>
                <strong>4-Digit Transaction PIN</strong>
                <p>Used to authorize money transfers and transactions</p>
              </div>
              <div className={styles.secActionCol}>
                <span
                  className={
                    hasPin ? styles.statusPillActive : styles.statusPillInactive
                  }
                >
                  {hasPin ? "Active & Protected" : "Not Set Up"}
                </span>
                <button
                  type="button"
                  className={styles.pinActionBtn}
                  onClick={handleOpenPinModal}
                >
                  {hasPin ? "Change PIN" : "Create PIN"}
                </button>
              </div>
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

      {/* TRANSACTION PIN MODAL */}
      {showPinModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard} role="dialog" aria-modal="true">
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setShowPinModal(false)}
              aria-label="Close"
            >
              <FiX />
            </button>

            <div className={styles.modalIconBadge}>
              <FiLock />
            </div>

            <span className={styles.modalTag}>SECURITY SETTINGS</span>
            <h2 className={styles.modalTitle}>
              {hasPin ? "Change Transaction PIN" : "Create Transaction PIN"}
            </h2>
            <p className={styles.modalDesc}>
              {hasPin
                ? "Enter your current PIN and choose a new 4-digit PIN for authorizing transfers."
                : "Create a 4-digit PIN to authorize transfers and secure your transactions."}
            </p>

            <form onSubmit={handleSavePin} className={styles.pinForm}>
              {hasPin && (
                <div className={styles.formGroup}>
                  <label htmlFor="currentPin">Current 4-Digit PIN</label>
                  <input
                    id="currentPin"
                    type="password"
                    inputMode="numeric"
                    pattern="\d{4}"
                    maxLength={4}
                    required
                    autoFocus
                    placeholder="Enter current PIN"
                    value={currentPin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setCurrentPin(val);
                      if (pinError) setPinError("");
                    }}
                    className={styles.pinInput}
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="newPin">
                  {hasPin ? "New 4-Digit PIN" : "4-Digit PIN"}
                </label>
                <input
                  id="newPin"
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  required
                  autoFocus={!hasPin}
                  placeholder="Enter 4-digit PIN"
                  value={newPin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setNewPin(val);
                    if (pinError) setPinError("");
                  }}
                  className={styles.pinInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPin">Confirm 4-Digit PIN</label>
                <input
                  id="confirmPin"
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  required
                  placeholder="Re-enter 4-digit PIN"
                  value={confirmPin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setConfirmPin(val);
                    if (pinError) setPinError("");
                  }}
                  className={styles.pinInput}
                />
              </div>

              {pinError && (
                <div className={styles.modalErrorAlert} role="alert">
                  <FiAlertCircle />
                  <span>{pinError}</span>
                </div>
              )}

              <div className={styles.modalBtnRow}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowPinModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.confirmBtn}
                  disabled={
                    isSubmittingPin ||
                    newPin.length !== 4 ||
                    confirmPin.length !== 4 ||
                    (hasPin && currentPin.length !== 4)
                  }
                >
                  {isSubmittingPin ? (
                    <>
                      <FiRefreshCw className={styles.spinner} /> Saving...
                    </>
                  ) : hasPin ? (
                    "Update PIN"
                  ) : (
                    "Create PIN"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Profile;
