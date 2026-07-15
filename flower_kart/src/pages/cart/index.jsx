import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartCard } from "../../components/cartCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionIntro } from "../../components/ui/SectionIntro";
import { useCart } from "../../context/card.context/useCartContext.js";
import { useAuth } from "../../context/auth.context";
import { useLocationContext } from "../../context/locationContext/useLocationContext";
import { useToast } from "../../components/ui/ToastProvider.jsx";

export const Cart = () => {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { cart } = useCart();
  const { user } = useAuth();
  const { address, coordinates } = useLocationContext();
  const [loading, setLoading] = useState(false);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePayment = async () => {
    if (cart.length === 0) {
      notify({
        title: "Your cart is empty",
        message: "Add a few products before heading to payment.",
        type: "info",
      });
      return;
    }

    setLoading(true);

    if (!address || address === "Select Location") {
      notify({
        title: "Delivery address required",
        message: "Set your location from the navbar before continuing.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-order`,
        { amount: subtotal, userId: user?._id, cartItems: cart, deliveryAddress: address, coordinates },
        { headers: { "Content-Type": "application/json" } }
      );

      const order = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "FlowerKart",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          setLoading(false);
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/verify-payment`,
            { ...response },
            { headers: { "Content-Type": "application/json" } }
          );

          if (verifyRes.data.success) {
            notify({
              title: "Payment successful",
              message: "Your order has been placed successfully.",
              type: "success",
            });
            navigate("/profile");
          } else {
            notify({
              title: "Payment verification failed",
              message: "Please contact support if the amount was deducted.",
              type: "error",
            });
          }
        },
        theme: {
          color: "#e11d48",
        },
        modal: {
          ondismiss: async function () {
            setLoading(false);
            try {
              await axios.post(
                `${import.meta.env.VITE_API_URL}/update-payment-status`,
                { razorpay_order_id: order.id, status: "Cancelled" },
                { headers: { "Content-Type": "application/json" } }
              );
            } catch (err) {
              console.error("Failed to update cancelled order", err);
            }
            notify({
              title: "Payment cancelled",
              message: "Your order was not charged and the checkout has been closed.",
              type: "info",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      notify({
        title: "Checkout failed",
        message: "Something went wrong while creating your order. Please try again.",
        type: "error",
      });
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-shell px-4 py-14 md:px-6">
        <div className="mx-auto max-w-4xl">
          <EmptyState
            icon="shopping_bag"
            title="Your cart is waiting for its first bouquet"
            description="A more production-ready cart needs a thoughtful empty state too. Browse the catalog, save a few favorites, and return when you're ready."
            action={
              <Link to="/products" className="cta-button px-6 py-3 text-sm">
                Explore products
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-shell pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionIntro
          eyebrow="Your cart"
          title="Review items, confirm delivery, and check out with confidence"
          description="This cart now behaves more like a real pre-checkout step, with clearer summary blocks and less visual noise."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            {cart.map((item) => (
              <CartCard key={item._id} item={item} />
            ))}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="surface-card rounded-[32px] p-6">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">Delivery</h2>
              <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Delivering to
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{address}</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Need to change this? Update the delivery address from the navbar location control before placing the order.
              </p>
            </div>

            <div className="surface-card rounded-[32px] p-6">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">Order summary</h2>
              <div className="mt-5 space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-start justify-between gap-4 text-sm text-slate-600">
                    <div>
                      <p className="font-medium text-slate-800">{item.name || item.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">Qty {item.qty}</p>
                    </div>
                    <p className="font-semibold text-slate-900">₹{(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-emerald-700">Free</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-lg font-semibold tracking-[-0.03em] text-slate-950">
                    <span>Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="cta-button mt-6 w-full px-6 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handlePayment}
                disabled={loading}
              >
                <span className="material-symbols-outlined text-base">
                  {loading ? "hourglass_top" : "payments"}
                </span>
                {loading ? "Processing payment..." : "Proceed to secure payment"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
