import { useEffect, useState } from "react";
import api from "../../api/client";

const initialChild = {
  name: "",
  rollNumber: "",
  hostelId: "",
  roomNumber: "",
  city: "",
  hostelAddress: "",
};

export default function ChildrenPage() {
  const [children, setChildren] = useState([]);
  const [form, setForm] = useState(initialChild);
  const [editingId, setEditingId] = useState("");

  const loadChildren = async () => {
    const { data } = await api.get("/parent/children");
    setChildren(data.children);
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) await api.put(`/parent/children/${editingId}`, form);
    else await api.post("/parent/children", form);

    setForm(initialChild);
    setEditingId("");
    loadChildren();
  };

  const removeChild = async (childId) => {
    await api.delete(`/parent/children/${childId}`);
    loadChildren();
  };

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <form onSubmit={submit} className="card p-5">
        <h1 className="font-heading text-2xl">{editingId ? "Update Child" : "Add Child"}</h1>
        <div className="mt-4 grid gap-3">
          {Object.keys(initialChild).map((field) => (
            <input
              key={field}
              className="input"
              required
              placeholder={field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}
        </div>
        <button className="btn-primary mt-4 w-full">{editingId ? "Save Changes" : "Add Child"}</button>
      </form>

      <div className="space-y-3">
        {children.map((child) => (
          <article key={child._id} className="card p-4">
            <h3 className="font-semibold">{child.name}</h3>
            <p className="text-sm text-stone-600">{child.city} | {child.hostelId} - Room {child.roomNumber}</p>
            <p className="text-xs text-stone-500">{child.hostelAddress}</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-lg bg-brand-leaf px-3 py-1.5 text-xs font-semibold text-white" onClick={() => { setEditingId(child._id); setForm({ ...child }); }}>Edit</button>
              <button className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => removeChild(child._id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
