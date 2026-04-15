import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/client";
import MenuItemCard from "../../components/MenuItemCard";
import useCart from "../../hooks/useCart";

export default function ShopMenuPage() {
  const { shopId } = useParams();
  const { addItem } = useCart();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/parent/shops/${shopId}/menu`);
      setShop(data.shop);
    };
    load();
  }, [shopId]);

  if (!shop) return <div className="card p-4">Loading menu...</div>;

  return (
    <section>
      <div className="card mb-5 p-5">
        <h1 className="font-heading text-3xl">{shop.shopName}</h1>
        <p className="text-sm text-stone-600">{shop.city} | {shop.address}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shop.menu.filter((item) => item.isAvailable).map((item) => (
          <MenuItemCard key={item._id} item={item} onAdd={(menuItem) => addItem(shop, menuItem, 1)} />
        ))}
      </div>
    </section>
  );
}
