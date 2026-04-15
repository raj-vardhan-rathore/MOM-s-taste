import { useEffect, useState } from "react";
import api from "../../api/client";
import useAuth from "../../hooks/useAuth";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const { socket } = useAuth();

  const load = async () => {
    const { data } = await api.get("/parent/notifications");
    setNotifications(data.notifications || []);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => load();
    socket.on("order:status", refresh);
    return () => socket.off("order:status", refresh);
  }, [socket]);

  const markRead = async (id) => {
    await api.patch(`/parent/notifications/${id}/read`);
    load();
  };

  return (
    <section>
      <h1 className="font-heading text-3xl">Notifications</h1>
      <div className="mt-4 space-y-3">
        {notifications.map((n) => (
          <article key={n._id} className="card p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold">{n.title}</h3>
              {!n.isRead && <button className="text-xs text-brand-coral" onClick={() => markRead(n._id)}>Mark read</button>}
            </div>
            <p className="text-sm text-stone-600">{n.message}</p>
            <p className="mt-1 text-xs text-stone-500">{new Date(n.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
