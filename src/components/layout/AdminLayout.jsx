import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../routes/routePaths";
import { cn } from "../../lib/cn";

const NAV_ITEMS = [
  { to: ROUTES.ADMIN.DASHBOARD, label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: ROUTES.ADMIN.PRODUCTS, label: "Products", icon: Package },
  { to: ROUTES.ADMIN.CATEGORIES, label: "Categories", icon: Tags },
  { to: ROUTES.ADMIN.CUSTOMERS, label: "Customers", icon: Users },
];

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="flex h-full flex-col">
      <Link
        to="/"
        className="mb-8 block text-xl font-bold text-white"
        style={{ fontFamily: "Playfair Display" }}
      >
        Cushite Beauty
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-white/15 font-semibold text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )
            }
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 pt-4">
        <p
          className="mb-3 truncate text-xs text-white/60"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {user?.name || user?.email}
        </p>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-[var(--primary)] p-6 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-[var(--primary)] px-4 py-3 lg:hidden">
        <Link
          to="/"
          className="text-lg font-bold text-white"
          style={{ fontFamily: "Playfair Display" }}
        >
          Cushite Beauty
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-[var(--primary)] p-6 shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-4 top-4 text-white"
            >
              <X size={22} />
            </button>
            <div className="mt-8">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
