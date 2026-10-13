import React, { useState } from "react";
import { Leaf, Menu, X, User, LogOut, ShoppingCart, ShieldCheck, Package } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { useCartStore } from "../store/cartStore.js";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount());

  const navItems = [
    { name: "Home", path: "/" },
    { name: "MarketHub", path: "/markethub" },
    { name: "Crop Season", path: "/crop-seasons" },
    { name: "Recommendations", path: "/recommendations" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Kisan Dost</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-green-600 font-semibold"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Auth Buttons / User menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigation("/markethub/cart")}
                  className="relative text-gray-700 hover:text-green-600 transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNavigation("/markethub/orders")}
                  className="text-gray-700 hover:text-green-600 transition-colors"
                  aria-label="My Orders"
                >
                  <Package className="w-5 h-5" />
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={() => handleNavigation("/admin")}
                    className="text-gray-700 hover:text-green-600 transition-colors"
                    aria-label="Admin panel"
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  {user?.name?.split(" ")[0]}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation("/login")}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-green-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`block w-full text-left px-3 py-2 font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-green-600 font-semibold bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                {item.name}
              </button>
            ))}

            {isAuthenticated ? (
              <div className="px-3 py-2 space-y-2">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleNavigation("/markethub/cart")} className="text-gray-700 hover:text-green-600 flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" /> Cart{itemCount > 0 ? ` (${itemCount})` : ""}
                  </button>
                  <button onClick={() => handleNavigation("/markethub/orders")} className="text-gray-700 hover:text-green-600 flex items-center gap-1">
                    <Package className="w-4 h-4" /> Orders
                  </button>
                  {user?.role === "admin" && (
                    <button onClick={() => handleNavigation("/admin")} className="text-gray-700 hover:text-green-600 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Admin
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    {user?.name?.split(" ")[0]}'s Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2 px-3 py-2">
                <button
                  onClick={() => handleNavigation("/login")}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
