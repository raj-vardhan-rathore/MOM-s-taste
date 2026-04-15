import { createContext, useMemo, useState } from "react";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ shop: null, childId: "", items: [], emotionalMessage: "", scheduledFor: "" });

  const addItem = (shop, item, quantity = 1) => {
    setCart((prev) => {
      const currentShopId = prev.shop?._id;
      const nextShop = currentShopId && currentShopId !== shop._id ? shop : prev.shop || shop;
      const nextItems = currentShopId && currentShopId !== shop._id ? [] : prev.items;

      const existing = nextItems.find((x) => x.menuItemId === item._id);
      if (existing) {
        return {
          ...prev,
          shop: nextShop,
          items: nextItems.map((x) =>
            x.menuItemId === item._id ? { ...x, quantity: x.quantity + quantity } : x
          ),
        };
      }

      return {
        ...prev,
        shop: nextShop,
        items: [...nextItems, { menuItemId: item._id, name: item.name, price: item.price, image: item.image, quantity }],
      };
    });
  };

  const updateQty = (menuItemId, quantity) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items
        .map((item) => (item.menuItemId === menuItemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    }));
  };

  const clearCart = () => setCart({ shop: null, childId: "", items: [], emotionalMessage: "", scheduledFor: "" });

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(() => ({ cart, setCart, addItem, updateQty, clearCart, total }), [cart, total]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
