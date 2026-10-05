import { BrowserRouter, Routes, Route } from "react-router-dom";

// public pages
import Welcome from "./pages/public/Welcome";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

// customer pages
import Dashboard from "./pages/customer/Dashboard";
import CustomerLayout from "./layouts/CustomerLayout";
import Transfer from "./pages/customer/Transfer";
import Deposit from "./pages/customer/Deposit";
import Withdraw from "./pages/customer/Withdraw";
import Transactions from "./pages/customer/Transactions";
import Profile from "./pages/customer/Profile";

// admin pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public pages */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* customer pages */}
        <Route element={<CustomerLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
