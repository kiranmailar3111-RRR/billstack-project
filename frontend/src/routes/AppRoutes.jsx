import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/products/Products";
import Customers from "../pages/customers/Customers";
import Invoices from "../pages/invoices/Invoices";
import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import CustomerDashboard from "../pages/customers/CustomerDashboard";
import Categories from "../pages/categories/Categories";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;