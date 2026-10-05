import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiUsers, FiActivity, FiSettings } from "react-icons/fi";
import styles from "./AdminLayout.module.css";

function AdminLayout() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span>Fhast</span> Pay
          <small>Admin</small>
        </div>

        <nav className={styles.navigation}>
          <NavLink to="/admin">
            <FiGrid />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/users">
            <FiUsers />
            <span>Users</span>
          </NavLink>

          <NavLink to="/admin/transactions">
            <FiActivity />
            <span>Transactions</span>
          </NavLink>

          <NavLink to="/admin/settings">
            <FiSettings />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
