import styles from "./Profile.module.css";

function Profile() {
  return (
    <main className={styles.profile}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Profile</h1>

          <p>Manage your account information.</p>
        </header>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Personal information</h2>
          </div>

          <div className={styles.details}>
            <div className={styles.detail}>
              <span>Name</span>
              <strong>Blessing Ocheme</strong>
            </div>

            <div className={styles.detail}>
              <span>Email</span>
              <strong>blessing@example.com</strong>
            </div>

            <div className={styles.detail}>
              <span>Account number</span>
              <strong>####0000</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
