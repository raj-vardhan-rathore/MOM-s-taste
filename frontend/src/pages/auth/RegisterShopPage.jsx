import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function RegisterShopPage() {
  const navigate = useNavigate();
  const { registerShopOwner } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    shopName: "",
    city: "",
    address: "",
    contactNumber: "",
    description: "",
    deliveryMethods: ["self"],
  });
  const [error, setError] = useState("");

  const toggleMethod = (method) => {
    setForm((prev) => ({
      ...prev,
      deliveryMethods: prev.deliveryMethods.includes(method)
        ? prev.deliveryMethods.filter((m) => m !== method)
        : [...prev.deliveryMethods, method],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerShopOwner(form);
      navigate("/shop");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="mx-auto max-w-2xl card p-6">
      <h1 className="font-heading text-3xl">Shop Owner Registration</h1>
      <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
        <input className="input" placeholder="Owner full name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="input" placeholder="Owner email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Owner phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input className="input" placeholder="Shop name" required value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
        <input className="input" placeholder="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input className="input md:col-span-2" placeholder="Shop address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input className="input" placeholder="Contact number" required value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
        <input className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="md:col-span-2">
          <p className="label">Delivery methods</p>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.deliveryMethods.includes("self")} onChange={() => toggleMethod("self")} /> Self</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.deliveryMethods.includes("third_party")} onChange={() => toggleMethod("third_party")} /> Third-party</label>
          </div>
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
        <button className="btn-secondary md:col-span-2">Create Shop Owner Account</button>
      </form>
    </section>
  );
}
