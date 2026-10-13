import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Truck } from "lucide-react";
import { orderApi } from "../../services/orderApi.js";
import { useCartStore } from "../../store/cartStore.js";
import { useAuthStore } from "../../store/authStore.js";

/** Loads the Razorpay checkout.js script once, reusing it on subsequent checkouts. */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const emptyAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  village: "",
  city: "",
  district: "",
  state: "",
  postalCode: "",
  landmark: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { items, subtotal, fetchCart } = useCartStore();

  const [address, setAddress] = useState({ ...emptyAddress, fullName: user?.name || "" });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [paymentsConfigured, setPaymentsConfigured] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCart();
    orderApi
      .paymentStatus()
      .then((res) => setPaymentsConfigured(res.data.data.configured))
      .catch(() => setPaymentsConfigured(false));
  }, [fetchCart]);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setPlacing(true);

    try {
      const res = await orderApi.create({ shippingAddress: address, paymentMethod });
      const { order, razorpay } = res.data.data;

      if (paymentMethod === "cod" || !razorpay) {
        navigate(`/markethub/orders/${order._id}`, { replace: true });
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMessage("Could not load the payment gateway. Please check your connection and try again.");
        setPlacing(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: razorpay.keyId,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "Kisan MarketHub",
        description: `Order ${order.orderNumber}`,
        order_id: razorpay.orderId,
        prefill: {
          name: address.fullName,
          contact: address.phone,
          email: user?.email,
        },
        theme: { color: "#16a34a" },
        handler: async (response) => {
          try {
            await orderApi.verifyPayment({
              orderId: order._id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            navigate(`/markethub/orders/${order._id}`, { replace: true });
          } catch (err) {
            setErrorMessage(
              `Payment was processed but verification failed (${err.message}). Contact support with order ${order.orderNumber}.`
            );
          }
        },
        modal: {
          // If the user closes the Razorpay modal without paying, the order
          // stays "pending" — they can retry from My Orders instead of losing it.
          ondismiss: () => {
            setPlacing(false);
            navigate(`/markethub/orders/${order._id}`, { replace: true });
          },
        },
      });

      rzp.open();
    } catch (err) {
      setErrorMessage(err.message);
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Your cart is empty.</p>
        <button onClick={() => navigate("/markethub")} className="text-green-600 hover:underline">
          Browse products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {errorMessage && (
          <div className="mb-6 rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">{errorMessage}</div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <form onSubmit={handlePlaceOrder} className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold">Shipping address</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="fullName" placeholder="Full name" value={address.fullName} onChange={handleChange} required className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <input name="phone" placeholder="Phone number" value={address.phone} onChange={handleChange} required className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <input name="addressLine1" placeholder="Address line 1" value={address.addressLine1} onChange={handleChange} required className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent sm:col-span-2" />
                <input name="addressLine2" placeholder="Address line 2 (optional)" value={address.addressLine2} onChange={handleChange} className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent sm:col-span-2" />
                <input name="village" placeholder="Village (optional)" value={address.village} onChange={handleChange} className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <input name="city" placeholder="City" value={address.city} onChange={handleChange} className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <input name="district" placeholder="District" value={address.district} onChange={handleChange} className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <input name="state" placeholder="State" value={address.state} onChange={handleChange} required className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <input name="postalCode" placeholder="Postal code" value={address.postalCode} onChange={handleChange} required className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                <input name="landmark" placeholder="Landmark (optional)" value={address.landmark} onChange={handleChange} className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold">Payment method</h2>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer has-[:checked]:border-green-600 has-[:checked]:bg-green-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    disabled={!paymentsConfigured}
                  />
                  <span>Pay online (Card / UPI / Netbanking via Razorpay)</span>
                </label>
                {!paymentsConfigured && (
                  <p className="text-xs text-amber-600 pl-8">
                    Online payments aren't configured on this server yet — use Cash on Delivery.
                  </p>
                )}
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer has-[:checked]:border-green-600 has-[:checked]:bg-green-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Cash on Delivery
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {placing ? "Placing order..." : "Place order"}
            </button>
          </form>

          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order summary</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">₹{item.lineTotal}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Shipping and tax are calculated by the server at order creation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
