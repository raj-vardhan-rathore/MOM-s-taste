import { useEffect, useState } from "react";
import api from "../../api/client";
import useCart from "../../hooks/useCart";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    const existing = document.querySelector("script[data-rzp]");
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.setAttribute("data-rzp", "true");
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  const { cart, setCart, updateQty, clearCart, total } = useCart();
  const [children, setChildren] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/parent/children");
      setChildren(data.children || []);
      if (!cart.childId && data.children?.[0]?._id) setCart((prev) => ({ ...prev, childId: data.children[0]._id }));
    };
    load();
  }, []);

  const deliveryFee = total > 499 ? 0 : total ? 40 : 0;
  const grandTotal = total + deliveryFee;

  const placeOrderWithPayment = async () => {
    if (!cart.shop?._id || !cart.items.length || !cart.childId || !cart.scheduledFor) return;
    setProcessing(true);

    try {
      const orderPayload = {
        childId: cart.childId,
        shopId: cart.shop._id,
        items: cart.items.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
        emotionalMessage: cart.emotionalMessage,
        scheduledFor: new Date(cart.scheduledFor).toISOString(),
      };

      const { data: placed } = await api.post("/parent/orders", orderPayload);
      const appOrder = placed.order;

      const sdkReady = await loadRazorpayScript();
      if (!sdkReady) throw new Error("Razorpay SDK failed to load");

      const { data: paymentData } = await api.post("/payment/create-order", { orderId: appOrder._id });

      await new Promise((resolve, reject) => {
        const options = {
          key: paymentData.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: paymentData.razorpayOrder.amount,
          currency: paymentData.razorpayOrder.currency,
          name: "Moms Taste",
          description: `Order ${appOrder.orderNumber}`,
          order_id: paymentData.razorpayOrder.id,
          handler: async function (response) {
            try {
              await api.post("/payment/verify", {
                orderId: appOrder._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              clearCart();
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          theme: { color: "#FF7A59" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", reject);
        rzp.open();
      });

      alert("Order placed and payment successful");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Unable to place order");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <article className="card p-4">
          <h1 className="font-heading text-2xl">Cart</h1>
          <p className="text-sm text-stone-600">Shop: {cart.shop?.shopName || "No shop selected"}</p>
        </article>
        {cart.items.map((item) => (
          <article key={item.menuItemId} className="card flex items-center justify-between gap-3 p-4">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-stone-600">INR {item.price}</p>
            </div>
            <input
              className="input w-20"
              type="number"
              min="0"
              value={item.quantity}
              onChange={(e) => updateQty(item.menuItemId, Number(e.target.value))}
            />
          </article>
        ))}
      </div>

      <aside className="card h-fit p-4">
        <h2 className="font-semibold">Checkout</h2>
        <label className="label mt-3">Select child</label>
        <select className="input" value={cart.childId} onChange={(e) => setCart((prev) => ({ ...prev, childId: e.target.value }))}>
          <option value="">Choose child</option>
          {children.map((child) => <option key={child._id} value={child._id}>{child.name} - {child.city}</option>)}
        </select>

        <label className="label mt-3">Delivery schedule</label>
        <input className="input" type="datetime-local" value={cart.scheduledFor} onChange={(e) => setCart((prev) => ({ ...prev, scheduledFor: e.target.value }))} />

        <label className="label mt-3">Message</label>
        <textarea className="input min-h-24" value={cart.emotionalMessage} onChange={(e) => setCart((prev) => ({ ...prev, emotionalMessage: e.target.value }))} placeholder="Take care beta" />

        <div className="mt-3 space-y-1 text-sm">
          <p>Subtotal: INR {total}</p>
          <p>Delivery fee: INR {deliveryFee}</p>
          <p className="font-semibold">Total: INR {grandTotal}</p>
        </div>

        <button disabled={processing || !cart.items.length} className="btn-primary mt-4 w-full disabled:opacity-60" onClick={placeOrderWithPayment}>
          {processing ? "Processing..." : "Pay & Place Order"}
        </button>
      </aside>
    </section>
  );
}
