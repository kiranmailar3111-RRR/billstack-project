import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  UserRound,
  Menu,
  X,
  Layers3,
  Sparkles,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const userRole = localStorage.getItem("billstack_role") || "Admin";
  const user = JSON.parse(localStorage.getItem("billstack_user"));

  const [mobileSidebar, setMobileSidebar] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("billstack_auth");
      localStorage.removeItem("billstack_token");
      localStorage.removeItem("billstack_user");
      localStorage.removeItem("billstack_role");

      navigate("/login");
    }
  };

  const menus = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      roles: ["Admin", "Manager", "Customer"],
    },
    {
      name: "My Dashboard",
      path: "/customer-dashboard",
      icon: UserRound,
      roles: ["Customer"],
    },
    {
      name: "Categories",
      path: "/categories",
      icon: Layers3,
      roles: ["Admin", "Manager"],
    },
    {
      name: "Products",
      path: "/products",
      icon: Package,
      roles: ["Admin", "Manager"],
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
      roles: ["Admin", "Manager"],
    },
    {
      name: "Invoices",
      path: "/invoices",
      icon: FileText,
      roles: ["Admin", "Manager", "Customer"],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
      roles: ["Admin", "Manager"],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      roles: ["Admin"],
    },
  ];

  const visibleMenus = menus.filter((menu) => menu.roles.includes(userRole));

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/30">
              <Sparkles className="text-white" size={22} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-white">
                BillStack
              </h1>
              <p className="text-xs text-slate-400">
                Inventory Billing
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileSidebar(false)}
            className="md:hidden w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* User Card */}
      <div className="px-4 py-5">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || "user@email.com"}
              </p>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-semibold">
            {userRole}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {visibleMenus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.name}
              to={menu.path}
              end={menu.path === "/"}
              onClick={() => setMobileSidebar(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-slate-950 shadow-lg shadow-black/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{menu.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-3 rounded-2xl font-semibold transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-slate-950 text-white flex-col fixed left-0 top-0 bottom-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileSidebar && (
        <div
          onClick={() => setMobileSidebar(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-72 bg-slate-950 text-white flex flex-col z-50 transform transition-transform duration-300 md:hidden ${
          mobileSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Area */}
      <div className="md:ml-72 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebar(true)}
              className="md:hidden w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">
                Inventory Billing SaaS
              </h2>
              <p className="hidden sm:block text-sm text-slate-500 mt-1">
                Manage products, invoices, customers and reports
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500">
                {userRole}
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-3 sm:p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;