import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function ShopDashboard() {
  const { shop } = useAuth();

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <article className="card p-5 md:col-span-2">
        <h1 className="font-heading text-3xl">{shop?.shopName || "Shop Dashboard"}</h1>
        <p className="mt-1 text-sm text-stone-600">Approval: <span className="font-semibold uppercase">{shop?.approvalStatus}</span></p>
        <p className="mt-2 text-stone-600">Manage menu, incoming orders, and delivery updates for students and parents.</p>
      </article>
      <article className="card p-5">
        <h2 className="font-semibold">Manage</h2>
        <div className="mt-3 grid gap-2 text-sm">
          <Link className="rounded-lg bg-orange-50 p-2" to="/shop/profile">Shop Profile</Link>
          <Link className="rounded-lg bg-orange-50 p-2" to="/shop/menu">Menu Items</Link>
          <Link className="rounded-lg bg-orange-50 p-2" to="/shop/orders">Incoming Orders</Link>
        </div>
      </article>
    </section>
  );
}
