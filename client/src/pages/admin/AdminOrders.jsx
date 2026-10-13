import React, { useEffect, useState } from "react";
import { orderApi } from "../../services/orderApi.js";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
];

function OrderRow({ order, onUpdated }) {
  const [status, setStatus] = useState(order.orderStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdate = async () => {
    setSaving(true);
    setErrorMessage("");
    try {
      await orderApi.adminUpdateStatus(order._id, { status, trackingNumber });
      onUpdated();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr>
      <td className="px-5 py-3 font-medium text-gray-800">{order.orderNumber}</td>
      <td className="px-5 py-3 text-gray-500">{order.user?.name || "—"}</td>
      <td className="px-5 py-3">₹{order.total}</td>
      <td className="px-5 py-3">{order.paymentStatus}</td>
      <td className="px-5 py-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-2 py-1 text-sm capitalize"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </td>
      <td className="px-5 py-3">
        <input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Tracking #"
          className="border border-gray-300 rounded-lg px-2 py-1 text-sm w-28"
        />
      </td>
      <td className="px-5 py-3">
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update"}
        </button>
        {errorMessage && <p className="text-xs text-red-600 mt-1">{errorMessage}</p>}
      </td>
    </tr>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = () => {
    setLoading(true);
    orderApi
      .adminList(statusFilter ? { status: statusFilter } : {})
      .then((res) => setOrders(res.data.data.items))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-5 py-3">Order #</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Tracking</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <OrderRow key={order._id} order={order} onUpdated={load} />
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-gray-400 text-sm px-5 py-6">No orders found.</p>}
        </div>
      )}
    </div>
  );
}
