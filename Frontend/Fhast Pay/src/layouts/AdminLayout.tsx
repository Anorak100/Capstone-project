import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiActivity,
  FiSettings,
  FiLogOut,
  FiShield,
} from "react-icons/fi";
import styles from "./AdminLayout.module.css";

function AdminLayout() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/dashboard");
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
            <span className={styles.adminBadge}>Admin Console</span>
          </div>
        </div>

        <nav className={styles.navigation}>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <FiGrid className={styles.navIcon} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <FiUsers className={styles.navIcon} />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/transactions"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <FiActivity className={styles.navIcon} />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <FiSettings className={styles.navIcon} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.exitButton}
            onClick={handleExit}
            title="Return to Customer App"
          >
            <FiLogOut className={styles.navIcon} />
            <span>Customer View</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
