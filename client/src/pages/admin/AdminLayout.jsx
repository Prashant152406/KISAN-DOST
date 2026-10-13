import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Layers, ShoppingBag } from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Layers },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 pt-20 px-4 hidden md:block">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-3 px-2">Admin Panel</p>
        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 pt-20 px-4 sm:px-8 pb-12">
        <Outlet />
      </main>
    </div>
  );
}
