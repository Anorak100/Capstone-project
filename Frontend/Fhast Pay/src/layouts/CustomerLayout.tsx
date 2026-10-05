import { NavLink, Outlet } from "react-router-dom";
import {
  FiHome,
  FiSend,
  FiPlusCircle,
  FiMinusCircle,
  FiList,
  FiUser,
} from "react-icons/fi";
import styles from "./CustomerLayout.module.css";

function CustomerLayout() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <span className={styles.logo}>Fhast Pay </span>

        <nav className={styles.navigation}>
          <NavLink to="/dashboard">
            <FiHome />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/transfer">
            <FiSend />
            <span>Transfer</span>
          </NavLink>

          <NavLink to="/deposit">
            <FiPlusCircle />
            <span>Deposit</span>
          </NavLink>

          <NavLink to="/withdraw">
            <FiMinusCircle />
            <span>Withdraw</span>
          </NavLink>

          <NavLink to="/transactions">
            <FiList />
            <span>Transactions</span>
          </NavLink>

          <NavLink to="/profile">
            <FiUser />
            <span>Profile</span>
          </NavLink>
        </nav>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default CustomerLayout;
