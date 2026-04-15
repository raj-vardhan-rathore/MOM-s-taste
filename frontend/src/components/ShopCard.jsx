export default function ShopCard({ shop, onViewMenu }) {
  return (
    <article className="card p-4 animate-floatIn">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="font-heading text-xl text-stone-800">{shop.shopName}</h3>
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">{shop.city}</span>
      </div>
      <p className="text-sm text-stone-600">{shop.description || "Fresh sweets and snacks."}</p>
      <p className="mt-2 text-xs text-stone-500">{shop.address}</p>
      <button className="btn-secondary mt-4 w-full" onClick={() => onViewMenu(shop)}>
        View Menu
      </button>
    </article>
  );
}
