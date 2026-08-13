import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Menu, X, ShoppingBag, Heart, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { cn } from "../../lib/cn";

function CountLink({ to, icon: Icon, label, count, loading, onClick, className, showLabel = false }) {
  return (
    <Link to={to} onClick={onClick} className={cn("relative flex items-center gap-2", className)}>
      <Icon size={20} />
      {showLabel && <span>{label}</span>}
      {!loading && count > 0 && (
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full bg-[#F59A23] text-[10px] font-semibold text-white",
            showLabel ? "" : "absolute -right-2 -top-2"
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems: cartCount, cartLoading } = useCart();
  const { totalItems: wishlistCount, wishlistLoading } = useWishlist();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = async () => {
    closeMobile();
    await logout();
    toast.success("Logged out");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    cn(
      "text-sm font-medium transition-colors",
      isActive ? "text-[#4A136C]" : "text-[#262626] hover:text-[#4A136C]"
    );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-bold text-[#4A136C] sm:text-2xl" onClick={closeMobile}>
          Cushite Beauty
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>

          <CountLink
            to="/wishlist"
            icon={Heart}
            label="Wishlist"
            count={wishlistCount}
            loading={wishlistLoading}
            className="text-[#262626] hover:text-[#4A136C]"
          />
          <CountLink
            to="/cart"
            icon={ShoppingBag}
            label="Cart"
            count={cartCount}
            loading={cartLoading}
            className="text-[#262626] hover:text-[#4A136C]"
          />

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>
              )}
              <NavLink to="/profile" className={linkClass}>
                {user?.name || "Profile"}
              </NavLink>
              <button onClick={handleLogout} className="text-sm font-medium text-[#4A136C]">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <CountLink to="/wishlist" icon={Heart} count={wishlistCount} loading={wishlistLoading} className="text-[#262626]" />
          <CountLink to="/cart" icon={ShoppingBag} count={cartCount} loading={cartLoading} className="text-[#262626]" />
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="text-[#262626]"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50"
              onClick={closeMobile}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white p-6 shadow-xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-lg font-bold text-[#4A136C]">Menu</span>
                <button onClick={closeMobile} aria-label="Close menu" className="text-[#262626]">
                  <X size={22} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1">
                <NavLink
                  to="/"
                  end
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    cn(
                      "rounded-[var(--radius-md)] px-3 py-3 text-base font-medium",
                      isActive ? "bg-[#4A136C]/10 text-[#4A136C]" : "text-[#262626]"
                    )
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/shop"
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    cn(
                      "rounded-[var(--radius-md)] px-3 py-3 text-base font-medium",
                      isActive ? "bg-[#4A136C]/10 text-[#4A136C]" : "text-[#262626]"
                    )
                  }
                >
                  Shop
                </NavLink>

                <CountLink
                  to="/wishlist"
                  icon={Heart}
                  label="Wishlist"
                  count={wishlistCount}
                  loading={wishlistLoading}
                  onClick={closeMobile}
                  showLabel
                  className="rounded-[var(--radius-md)] px-3 py-3 text-base font-medium text-[#262626]"
                />
                <CountLink
                  to="/cart"
                  icon={ShoppingBag}
                  label="Cart"
                  count={cartCount}
                  loading={cartLoading}
                  onClick={closeMobile}
                  showLabel
                  className="rounded-[var(--radius-md)] px-3 py-3 text-base font-medium text-[#262626]"
                />

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={closeMobile}
                    className="flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-3 text-base font-medium text-[#262626]"
                  >
                    <LayoutDashboard size={18} /> Admin
                  </NavLink>
                )}

                {isAuthenticated ? (
                  <NavLink
                    to="/profile"
                    onClick={closeMobile}
                    className="flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-3 text-base font-medium text-[#262626]"
                  >
                    <User size={18} /> {user?.name || "Profile"}
                  </NavLink>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={closeMobile}
                    className="flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-3 text-base font-medium text-[#262626]"
                  >
                    <User size={18} /> Login
                  </NavLink>
                )}
              </nav>

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="mt-4 flex items-center gap-2 rounded-[var(--radius-md)] border-t border-[var(--border)] px-3 pt-4 text-base font-medium text-[#4A136C]"
                >
                  <LogOut size={18} /> Logout
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
