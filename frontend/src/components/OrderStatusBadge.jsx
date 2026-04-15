const colorByStatus = {
  placed: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  out_for_delivery: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colorByStatus[status] || "bg-stone-100 text-stone-700"}`}>
      {status?.replaceAll("_", " ")}
    </span>
  );
}
