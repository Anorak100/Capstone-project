import { Link } from "react-router-dom";
import {
  FiShield,
  FiZap,
  FiLock,
  FiActivity,
  FiArrowRight,
  FiWifi,
  FiCheckCircle,
} from "react-icons/fi";
import styles from "./Welcome.module.css";

function Welcome() {
  return (
    <div className={styles.page}>
      {/* NAVBAR */}
      <header className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <FiShield />
            </div>
            <span>FHAST PAY</span>
          </div>

          <nav className={styles.navLinks}>
            <Link to="/login" className={styles.loginLink}>
              Sign In
            </Link>
            <Link to="/register" className={styles.registerLink}>
              Create Account
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.pillBadge}>
              <FiZap className={styles.zapIcon} />
              <span>Next-Gen Personal Banking</span>
            </div>

            <h1 className={styles.heroTitle}>
              Simple, Instant, & <br />
              <span className={styles.highlightText}>Secure Banking.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Experience seamless peer-to-peer transfers, real-time balances, and
              rock-solid security. Open your free Fhast Pay account in less than
              two minutes.
            </p>

            <div className={styles.heroActions}>
              <Link to="/register" className={styles.primaryBtn}>
                <span>Open Your Account</span>
                <FiArrowRight />
              </Link>
              <Link to="/login" className={styles.secondaryBtn}>
                Sign In to Banking
              </Link>
            </div>

            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <FiCheckCircle className={styles.trustIcon} />
                <span>Zero Account Fees</span>
              </div>
              <div className={styles.trustItem}>
                <FiCheckCircle className={styles.trustIcon} />
                <span>Instant Settlement</span>
              </div>
              <div className={styles.trustItem}>
                <FiCheckCircle className={styles.trustIcon} />
                <span>256-bit TLS Encrypted</span>
              </div>
            </div>
          </div>

          {/* CARD PREVIEW MOCKUP */}
          <div className={styles.cardPreviewWrapper}>
            <div className={styles.cardMockup}>
              <div className={styles.cardTop}>
                <span className={styles.cardBrand}>FHAST PAY</span>
                <FiWifi className={styles.cardWifi} />
              </div>

              <div className={styles.cardChip}>
                <div className={styles.chipSegment} />
              </div>

              <div className={styles.cardBalance}>
                <span className={styles.balanceLabel}>Account Balance</span>
                <strong className={styles.balanceValue}>₦1,450,000.00</strong>
              </div>

              <div className={styles.cardBottom}>
                <div>
                  <span className={styles.cardHolderLabel}>Cardholder</span>
                  <span className={styles.cardHolderName}>ALEXANDER COLE</span>
                </div>
                <div className={styles.cardExpiry}>
                  <span className={styles.cardHolderLabel}>Account</span>
                  <span className={styles.accountDigits}>•••• 4892</span>
                </div>
              </div>
            </div>

            {/* FLOATING SUCCESS PILL */}
            <div className={styles.floatingPill}>
              <div className={styles.floatingIcon}>
                <FiZap />
              </div>
              <div>
                <strong>Transfer Sent</strong>
                <p>₦50,000.00 to Sarah B.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FEATURES SECTION */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.zapBg}`}>
              <FiZap />
            </div>
            <h3>Lightning Fast Transfers</h3>
            <p>
              Send funds instantly to any account number with real-time receipt
              verification and immediate settlement.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.lockBg}`}>
              <FiLock />
            </div>
            <h3>Bank-Grade Security</h3>
            <p>
              Protected by multi-layered encryption, 4-digit transaction PINs,
              and strict data privacy protocols.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.activityBg}`}>
              <FiActivity />
            </div>
            <h3>Real-Time Ledger</h3>
            <p>
              Monitor every transaction with comprehensive timestamps,
              reference numbers, and accurate balance tracking.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.attributionBadge}>
            <span>
              Made with <span className={styles.heart}>❤️</span> by{" "}
              <strong>Group 13</strong> · TS Academy · Hajime Cohort (Backend Development)
            </span>
          </div>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Fhast Pay Banking. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Welcome;
