import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import ShopCard from "../../components/ShopCard";

export default function ShopsPage() {
  const navigate = useNavigate();
  const [city, setCity] = useState("Pune");
  const [shops, setShops] = useState([]);

  const search = async (e) => {
    e.preventDefault();
    const { data } = await api.get(`/parent/shops?city=${encodeURIComponent(city)}`);
    setShops(data.shops || []);
  };

  return (
    <section>
      <form onSubmit={search} className="card mb-5 p-4">
        <h1 className="font-heading text-2xl">Shops by City</h1>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
          <button className="btn-primary">Search</button>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <ShopCard key={shop._id} shop={shop} onViewMenu={() => navigate(`/parent/shops/${shop._id}/menu`)} />
        ))}
      </div>
    </section>
  );
}
