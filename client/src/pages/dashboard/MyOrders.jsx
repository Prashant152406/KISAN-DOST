import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { orderApi } from "../../services/orderApi.js";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  out_for_delivery: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
  refunded: "bg-gray-100 text-gray-800",
};

function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[status] || "bg-gray-100 text-gray-800"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    orderApi
      .listMine()
      .then((res) => setOrders(res.data.data.items))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <button onClick={() => navigate("/markethub")} className="text-green-600 hover:underline">
              Browse MarketHub
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/markethub/orders/${order._id}`)}
                className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                  <StatusBadge status={order.orderStatus} />
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {order.paymentStatus === "paid" ? "Paid" : order.paymentMethod === "cod" ? "Cash on Delivery" : "Payment pending"}
                  </span>
                  <span className="font-bold text-green-600">₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
