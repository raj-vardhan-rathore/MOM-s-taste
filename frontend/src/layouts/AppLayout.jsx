import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const navByRole = {
  parent: [
    { to: "/parent", label: "Dashboard" },
    { to: "/parent/children", label: "Children" },
    { to: "/parent/shops", label: "Shops" },
    { to: "/parent/cart", label: "Cart" },
    { to: "/parent/orders", label: "Orders" },
    { to: "/parent/notifications", label: "Notifications" },
  ],
  shop_owner: [
    { to: "/shop", label: "Dashboard" },
    { to: "/shop/profile", label: "Profile" },
    { to: "/shop/menu", label: "Menu" },
    { to: "/shop/orders", label: "Orders" },
  ],
  admin: [
    { to: "/admin", label: "Admin Dashboard" },
  ],
};

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user ? navByRole[user.role] || [] : [];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-heading text-xl font-bold text-brand-ink">
            Moms Taste
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden text-sm text-stone-600 sm:block">{user.fullName}</span>
                <button
                  className="rounded-xl bg-stone-900 px-3 py-2 text-xs font-semibold text-white"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link className="btn-primary" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
        {!!links.length && (
          <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    isActive ? "bg-brand-ink text-white" : "bg-orange-50 text-stone-700 hover:bg-orange-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
