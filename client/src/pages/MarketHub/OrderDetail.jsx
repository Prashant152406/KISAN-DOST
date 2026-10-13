import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Circle, XCircle } from "lucide-react";
import { orderApi } from "../../services/orderApi.js";

const TRACK_STEPS = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

function Timeline({ order }) {
  if (order.orderStatus === "cancelled" || order.orderStatus === "returned" || order.orderStatus === "refunded") {
    return (
      <div className="flex items-center gap-3 text-red-600">
        <XCircle className="w-6 h-6" />
        <div>
          <p className="font-medium capitalize">{order.orderStatus.replace(/_/g, " ")}</p>
          {order.cancelReason && <p className="text-sm text-gray-500">{order.cancelReason}</p>}
        </div>
      </div>
    );
  }

  const currentIndex = TRACK_STEPS.indexOf(order.orderStatus);

  return (
    <div className="flex flex-col gap-0">
      {TRACK_STEPS.map((step, idx) => {
        const done = idx <= currentIndex;
        const historyEntry = [...order.statusHistory].reverse().find((h) => h.status === step);
        return (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              {done ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
              {idx < TRACK_STEPS.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[24px] ${done ? "bg-green-600" : "bg-gray-200"}`} />
              )}
            </div>
            <div className="pb-6">
              <p className={`font-medium capitalize ${done ? "text-gray-900" : "text-gray-400"}`}>
                {step.replace(/_/g, " ")}
              </p>
              {historyEntry && (
                <p className="text-xs text-gray-400">{new Date(historyEntry.changedAt).toLocaleString()}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    setLoading(true);
    orderApi
      .getMine(id)
      .then((res) => setOrder(res.data.data.order))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await orderApi.cancelMine(id, "Cancelled by customer");
      load();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">{errorMessage || "Order not found."}</p>
        <button onClick={() => navigate("/markethub/orders")} className="text-green-600 hover:underline">
          Back to my orders
        </button>
      </div>
    );
  }

  const canCancel = ["pending", "confirmed", "processing"].includes(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => navigate("/markethub/orders")}
          className="text-green-600 hover:text-green-700 flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to my orders
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
            <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-500">
            {order.paymentStatus === "paid" ? "Paid" : order.paymentMethod === "cod" ? "Cash on Delivery" : "Payment pending"}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order status</h2>
          <Timeline order={order} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <img
                  src={item.image || "https://placehold.co/60x60"}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <span className="font-medium">₹{item.total}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{order.subtotal}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>₹{order.shippingFee}</span></div>
            {order.tax > 0 && <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>₹{order.tax}</span></div>}
            <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>₹{order.total}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Shipping to</h2>
          <p className="text-gray-700">{order.shippingAddress.fullName} · {order.shippingAddress.phone}</p>
          <p className="text-gray-500 text-sm">
            {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
        </div>

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel order"}
          </button>
        )}
      </div>
    </div>
  );
}
