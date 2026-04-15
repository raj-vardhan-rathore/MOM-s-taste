import { useEffect, useState } from "react";
import api from "../../api/client";

const newItem = { name: "", description: "", category: "Sweet", image: "", price: "" };

export default function MenuManagerPage() {
  const [shop, setShop] = useState(null);
  const [form, setForm] = useState(newItem);

  const load = async () => {
    const { data } = await api.get("/shop/me");
    setShop(data.shop);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await api.post("/shop/menu", { ...form, price: Number(form.price) });
    setForm(newItem);
    load();
  };

  const remove = async (itemId) => {
    await api.delete(`/shop/menu/${itemId}`);
    load();
  };

  if (!shop) return <div className="card p-4">Loading menu...</div>;

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <form className="card p-5" onSubmit={add}>
        <h1 className="font-heading text-2xl">Add Menu Item</h1>
        <div className="mt-4 grid gap-3">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>Sweet</option><option>Snacks</option><option>Beverages</option><option>Combo</option><option>Festival</option>
          </select>
          <input className="input" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <input className="input" placeholder="Price" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        </div>
        <button className="btn-secondary mt-4 w-full">Add Item</button>
      </form>

      <div className="space-y-3">
        {shop.menu.map((item) => (
          <article key={item._id} className="card flex items-center justify-between gap-3 p-4">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-stone-600">{item.category} | INR {item.price}</p>
            </div>
            <button className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => remove(item._id)}>Delete</button>
          </article>
        ))}
      </div>
    </section>
  );
}
