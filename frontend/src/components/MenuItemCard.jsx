export default function MenuItemCard({ item, onAdd }) {
  return (
    <article className="card overflow-hidden">
      <img
        src={item.image || "https://images.unsplash.com/photo-1606787366850-de6330128bfc"}
        alt={item.name}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h4 className="font-semibold text-stone-800">{item.name}</h4>
          <span className="text-sm font-bold text-brand-coral">INR {item.price}</span>
        </div>
        <p className="mb-1 text-xs text-stone-500">{item.category}</p>
        <p className="min-h-10 text-sm text-stone-600">{item.description}</p>
        <button className="btn-primary mt-3 w-full" onClick={() => onAdd(item)}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}
