import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function ParentDashboard() {
  const { user } = useAuth();

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <article className="card p-5 md:col-span-2">
        <h1 className="font-heading text-3xl">Hello {user?.fullName?.split(" ")[0]}, send a little love today.</h1>
        <p className="mt-2 text-stone-600">Choose your child, find a trusted shop in their city, and schedule delivery with your message.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/parent/children">Manage Children</Link>
          <Link className="btn-secondary" to="/parent/shops">Browse Shops</Link>
        </div>
      </article>
      <article className="card p-5">
        <h2 className="font-semibold">Quick Actions</h2>
        <div className="mt-3 grid gap-2 text-sm">
          <Link className="rounded-lg bg-orange-50 p-2" to="/parent/cart">Open Cart</Link>
          <Link className="rounded-lg bg-orange-50 p-2" to="/parent/orders">Track Orders</Link>
          <Link className="rounded-lg bg-orange-50 p-2" to="/parent/notifications">View Notifications</Link>
        </div>
      </article>
    </section>
  );
}
