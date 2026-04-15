import { useEffect, useState } from "react";
import api from "../../api/client";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [pendingShops, setPendingShops] = useState([]);

  const load = async () => {
    const [an, ps] = await Promise.all([api.get("/admin/analytics"), api.get("/admin/shops/pending")]);
    setAnalytics(an.data.analytics);
    setPendingShops(ps.data.shops || []);
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (shopId, status) => {
    await api.patch(`/admin/shops/${shopId}/approval`, { status });
    load();
  };

  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl">Admin Control Center</h1>

      {analytics && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <article className="card p-4"><p className="text-xs text-stone-500">Users</p><p className="text-2xl font-bold">{analytics.userCount}</p></article>
          <article className="card p-4"><p className="text-xs text-stone-500">Shops</p><p className="text-2xl font-bold">{analytics.shopCount}</p></article>
          <article className="card p-4"><p className="text-xs text-stone-500">Approved Shops</p><p className="text-2xl font-bold">{analytics.approvedShops}</p></article>
          <article className="card p-4"><p className="text-xs text-stone-500">Orders</p><p className="text-2xl font-bold">{analytics.orderCount}</p></article>
          <article className="card p-4"><p className="text-xs text-stone-500">Delivered</p><p className="text-2xl font-bold">{analytics.deliveredCount}</p></article>
          <article className="card p-4"><p className="text-xs text-stone-500">Revenue</p><p className="text-2xl font-bold">INR {analytics.totalRevenue}</p></article>
        </div>
      )}

      <section className="card p-4">
        <h2 className="font-semibold">Pending Shop Approvals</h2>
        <div className="mt-3 space-y-3">
          {pendingShops.map((shop) => (
            <article key={shop._id} className="rounded-xl border border-orange-100 p-3">
              <p className="font-semibold">{shop.shopName} ({shop.city})</p>
              <p className="text-sm text-stone-600">Owner: {shop.owner?.fullName} | {shop.owner?.email}</p>
              <div className="mt-2 flex gap-2">
                <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => decide(shop._id, "approved")}>Approve</button>
                <button className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => decide(shop._id, "rejected")}>Reject</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
