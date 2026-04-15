import { useEffect, useState } from "react";
import api from "../../api/client";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import useAuth from "../../hooks/useAuth";

export default function ParentOrdersPage() {
  const [orders, setOrders] = useState([]);
  const { socket } = useAuth();

  const load = async () => {
    const { data } = await api.get("/parent/orders");
    setOrders(data.orders || []);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = () => load();
    socket.on("order:status", handler);
    return () => socket.off("order:status", handler);
  }, [socket]);

  return (
    <section className="space-y-3">
      <h1 className="font-heading text-3xl">Your Orders</h1>
      {orders.map((order) => (
        <article key={order._id} className="card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">{order.orderNumber}</h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-stone-600">Child: {order.child.name} | Shop: {order.shop?.shopName}</p>
          <p className="text-sm text-stone-600">Scheduled: {new Date(order.scheduledFor).toLocaleString()}</p>
          <p className="text-sm text-stone-600">Message: {order.emotionalMessage || "-"}</p>
          <p className="mt-1 text-sm font-semibold">Total: INR {order.totalAmount}</p>
        </article>
      ))}
    </section>
  );
}
