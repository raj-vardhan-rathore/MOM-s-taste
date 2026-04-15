import { useEffect, useState } from "react";
import api from "../../api/client";
import OrderStatusBadge from "../../components/OrderStatusBadge";

export default function ShopOrdersPage() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { data } = await api.get("/shop/orders");
    setOrders(data.orders || []);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (orderId, status) => {
    await api.patch(`/shop/orders/${orderId}/status`, { status });
    load();
  };

  return (
    <section>
      <h1 className="font-heading text-3xl">Incoming Orders</h1>
      <div className="mt-4 space-y-3">
        {orders.map((order) => (
          <article key={order._id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">{order.orderNumber} | {order.child.name}</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-stone-600">Parent: {order.parent?.fullName} ({order.parent?.phone})</p>
            <p className="text-sm text-stone-600">Schedule: {new Date(order.scheduledFor).toLocaleString()}</p>
            <p className="text-sm text-stone-600">Message: {order.emotionalMessage || "-"}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => updateStatus(order._id, "accepted")}>Accept</button>
              <button className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => updateStatus(order._id, "rejected")}>Reject</button>
              <button className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => updateStatus(order._id, "out_for_delivery")}>Out for Delivery</button>
              <button className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => updateStatus(order._id, "delivered")}>Delivered</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
