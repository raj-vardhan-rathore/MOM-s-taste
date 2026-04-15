import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { user } = await login(form);
      if (user.role === "parent") navigate("/parent");
      else if (user.role === "shop_owner") navigate("/shop");
      else navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="mx-auto max-w-md card p-6">
      <h1 className="font-heading text-3xl">Welcome Back</h1>
      <p className="mt-1 text-sm text-stone-600">Login to manage orders and delight your child.</p>
      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full">Login</button>
      </form>
      <div className="mt-4 flex flex-col gap-1 text-sm">
        <Link className="text-brand-leaf" to="/register-parent">Register as Parent</Link>
        <Link className="text-brand-leaf" to="/register-shop">Register as Shop Owner</Link>
      </div>
    </section>
  );
}
