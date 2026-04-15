import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function RegisterParentPage() {
  const navigate = useNavigate();
  const { registerParent } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerParent(form);
      navigate("/parent");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="mx-auto max-w-md card p-6">
      <h1 className="font-heading text-3xl">Parent Registration</h1>
      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <input className="input" placeholder="Full name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="input" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full">Create Parent Account</button>
      </form>
    </section>
  );
}
