import { useEffect, useState } from "react";
import api from "../../api/client";
import useAuth from "../../hooks/useAuth";

export default function ShopProfilePage() {
  const { refreshUser } = useAuth();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/shop/me");
      setForm(data.shop);
    };
    load();
  }, []);

  if (!form) return <div className="card p-4">Loading shop profile...</div>;

  const submit = async (e) => {
    e.preventDefault();
    await api.put("/shop/me", {
      shopName: form.shopName,
      city: form.city,
      address: form.address,
      contactNumber: form.contactNumber,
      description: form.description,
      coverImage: form.coverImage,
      isOpen: form.isOpen,
      deliveryMethods: form.deliveryMethods,
    });
    await refreshUser();
    alert("Shop profile updated");
  };

  const toggleMethod = (method) => {
    setForm((prev) => ({
      ...prev,
      deliveryMethods: prev.deliveryMethods.includes(method)
        ? prev.deliveryMethods.filter((x) => x !== method)
        : [...prev.deliveryMethods, method],
    }));
  };

  return (
    <form className="card mx-auto max-w-2xl p-5" onSubmit={submit}>
      <h1 className="font-heading text-3xl">Shop Profile</h1>
      <div className="mt-4 grid gap-3">
        <input className="input" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
        <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input className="input" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
        <textarea className="input min-h-24" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="input" placeholder="Cover image URL" value={form.coverImage || ""} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
      </div>
      <div className="mt-3 flex gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.deliveryMethods.includes("self")} onChange={() => toggleMethod("self")} /> Self</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.deliveryMethods.includes("third_party")} onChange={() => toggleMethod("third_party")} /> Third-party</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isOpen} onChange={(e) => setForm({ ...form, isOpen: e.target.checked })} /> Open now</label>
      </div>
      <button className="btn-secondary mt-4">Save Profile</button>
    </form>
  );
}
