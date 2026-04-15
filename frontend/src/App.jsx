import { Link, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterParentPage from "./pages/auth/RegisterParentPage";
import RegisterShopPage from "./pages/auth/RegisterShopPage";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ChildrenPage from "./pages/parent/ChildrenPage";
import ShopsPage from "./pages/parent/ShopsPage";
import ShopMenuPage from "./pages/parent/ShopMenuPage";
import CartPage from "./pages/parent/CartPage";
import ParentOrdersPage from "./pages/parent/ParentOrdersPage";
import NotificationsPage from "./pages/parent/NotificationsPage";
import ShopDashboard from "./pages/shop/ShopDashboard";
import ShopProfilePage from "./pages/shop/ShopProfilePage";
import MenuManagerPage from "./pages/shop/MenuManagerPage";
import ShopOrdersPage from "./pages/shop/ShopOrdersPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import useAuth from "./hooks/useAuth";

function HomePage() {
  const { user } = useAuth();

  if (user?.role === "parent") return <Navigate to="/parent" replace />;
  if (user?.role === "shop_owner") return <Navigate to="/shop" replace />;
  if (user?.role === "admin") return <Navigate to="/admin" replace />;

  return (
    <section className="grid gap-8 rounded-3xl bg-white/80 p-8 shadow-card md:grid-cols-2">
      <div>
        <p className="mb-2 text-sm uppercase tracking-widest text-brand-leaf">Family-first food ordering</p>
        <h1 className="font-heading text-4xl leading-tight text-brand-ink md:text-5xl">
          Moms Taste brings home-like sweets to your child in any city.
        </h1>
        <p className="mt-4 max-w-xl text-stone-600">
          Parents can schedule treats with loving notes, verified shops can deliver reliably, and admins keep everything safe.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/register-parent" className="btn-primary">
            Register as Parent
          </Link>
          <Link to="/register-shop" className="btn-secondary">
            Register as Shop Owner
          </Link>
        </div>
      </div>
      <div className="card p-4">
        <img
          src="https://images.unsplash.com/photo-1613141412501-9012977f1969"
          alt="Indian sweets"
          className="h-72 w-full rounded-2xl object-cover"
        />
      </div>
    </section>
  );
}

function UnauthorizedPage() {
  return <div className="card p-6 text-center">You do not have access to this page.</div>;
}

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-parent" element={<RegisterParentPage />} />
        <Route path="/register-shop" element={<RegisterShopPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/parent/children" element={<ProtectedRoute allowedRoles={["parent"]}><ChildrenPage /></ProtectedRoute>} />
        <Route path="/parent/shops" element={<ProtectedRoute allowedRoles={["parent"]}><ShopsPage /></ProtectedRoute>} />
        <Route path="/parent/shops/:shopId/menu" element={<ProtectedRoute allowedRoles={["parent"]}><ShopMenuPage /></ProtectedRoute>} />
        <Route path="/parent/cart" element={<ProtectedRoute allowedRoles={["parent"]}><CartPage /></ProtectedRoute>} />
        <Route path="/parent/orders" element={<ProtectedRoute allowedRoles={["parent"]}><ParentOrdersPage /></ProtectedRoute>} />
        <Route path="/parent/notifications" element={<ProtectedRoute allowedRoles={["parent"]}><NotificationsPage /></ProtectedRoute>} />

        <Route path="/shop" element={<ProtectedRoute allowedRoles={["shop_owner"]}><ShopDashboard /></ProtectedRoute>} />
        <Route path="/shop/profile" element={<ProtectedRoute allowedRoles={["shop_owner"]}><ShopProfilePage /></ProtectedRoute>} />
        <Route path="/shop/menu" element={<ProtectedRoute allowedRoles={["shop_owner"]}><MenuManagerPage /></ProtectedRoute>} />
        <Route path="/shop/orders" element={<ProtectedRoute allowedRoles={["shop_owner"]}><ShopOrdersPage /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboardPage /></ProtectedRoute>} />
      </Routes>
    </AppLayout>
  );
}
