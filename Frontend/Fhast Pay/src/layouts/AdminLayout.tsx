import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  getAuthToken,
  getStoredUser,
  isAdminUser,
} from "../utils/authSession";
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

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    if (!isAdminUser(getStoredUser())) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
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
            onClick={handleLogout}
            title="Sign out of admin console"
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

export default AdminLayout;
