import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiSend,
  FiList,
  FiUser,
  FiLogOut,
  FiShield,
} from "react-icons/fi";
import styles from "./CustomerLayout.module.css";

function CustomerLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <FiShield />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>FHAST PAY</span>
            <span className={styles.brandTag}>Personal Banking</span>
          </div>
        </div>

        <nav className={styles.navigation}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <FiHome className={styles.navIcon} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/transfer"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <FiSend className={styles.navIcon} />
            <span>Transfer</span>
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <FiList className={styles.navIcon} />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <FiUser className={styles.navIcon} />
            <span>Profile</span>
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
            title="Sign out of your account"
          >
            <FiLogOut className={styles.navIcon} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default CustomerLayout;
