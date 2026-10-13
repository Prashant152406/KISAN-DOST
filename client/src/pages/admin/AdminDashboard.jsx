import React, { useEffect, useState } from "react";
import { Package, ShoppingBag, Users, IndianRupee, Clock } from "lucide-react";
import { adminApi } from "../../services/orderApi.js";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    adminApi
      .dashboard()
      .then((res) => setStats(res.data.data))
      .catch((err) => setErrorMessage(err.message));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}
      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Package} label="Active products" value={stats.activeProducts} />
          <StatCard icon={ShoppingBag} label="Total orders" value={stats.totalOrders} />
          <StatCard icon={Clock} label="Orders in progress" value={stats.pendingOrders} />
          <StatCard icon={Users} label="Active users" value={stats.totalUsers} />
          <StatCard icon={IndianRupee} label="Revenue (paid orders)" value={`₹${stats.totalRevenue}`} />
        </div>
      )}
    </div>
  );
}
