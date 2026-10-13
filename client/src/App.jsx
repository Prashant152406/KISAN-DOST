import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./pages/Navbar";
import HeroSection from "./pages/Hero";
import DigitalEcosystemSection from "./pages/DigitalEcosystemSection";
import TransformingAgricultureSection from "./pages/TransformingAgricultureSection";
import Recommendation from "./pages/Recommendation";
import Footer from "./pages/Footer";
import CropSeasons from "./pages/CropSeasons";
import NotFound from "./pages/NotFound";

import DiseaseDetection from "./pages/DiseaseDetection";


import Cucumber from "./components/Cucumber";
import Rice from "./components/Rice";
import Soybean from "./components/Soybean";
import Wheat from "./components/Wheat";
import Bajra from "./components/Bajra";
import Jowar from "./components/Jowar";
import Barley from "./components/Barley";
import Bittergourd from "./components/BitterGourd";
import Gram from "./components/Gram";
import Maize from "./components/Maize";
import Millet from "./components/Millet";
import Oat from "./components/Oat";
import Pumpkin from "./components/Pumpkin";
import Rapeseed from "./components/Rapeseed";

// MarketHub pages
import MarketHub from "./pages/MarketHub/MarketHub";
import ProductDetail from "./pages/MarketHub/ProductDetail";
import Cart from "./pages/MarketHub/Cart";
import Checkout from "./pages/MarketHub/Checkout";
import OrderDetail from "./pages/MarketHub/OrderDetail";
import MyOrders from "./pages/dashboard/MyOrders";

// Admin panel
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";


// Auth pages
import AuthLogin from "./pages/auth/Login";
import AuthRegister from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/auth/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AdminRoute from "./components/AdminRoute";
import { useAuthStore } from "./store/authStore";
import { useCartStore } from "./store/cartStore";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const clearLocalCart = useCartStore((s) => s.clearLocal);

  // Runs once on app startup: GET /api/auth/me to check the session cookie
  // and populate the auth store before any route renders its real content.
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Keep the cart in sync with login state: load it once authenticated,
  // and drop any stale in-memory cart the instant the user logs out.
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      clearLocalCart();
    }
  }, [isAuthenticated, fetchCart, clearLocalCart]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <DigitalEcosystemSection />
              <TransformingAgricultureSection />
              <Footer />
            </>
          }
        />
        <Route path="/home" element={<HeroSection />} />
        <Route path="/digitalecosystem" element={<DigitalEcosystemSection />} />
        <Route path="/transformingagriculture" element={<TransformingAgricultureSection />} />
        <Route path="/crop-seasons" element={<CropSeasons />} />
        <Route path="/recommendations" element={<Recommendation />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/footer" element={<Footer />} />

        <Route path="/bajra" element={<Bajra />} />
        <Route path="/barley" element={<Barley />} />
        <Route path="/jowar" element={<Jowar />} />
        <Route path="/bittergourd" element={<Bittergourd />} />
        <Route path="/gram" element={<Gram />} />
        <Route path="/maize" element={<Maize />} />
        <Route path="/millet" element={<Millet />} />
        <Route path="/oat" element={<Oat />} />
        <Route path="/pumpkin" element={<Pumpkin />} />
        <Route path="/cucumber" element={<Cucumber />} />
        <Route path="/rice" element={<Rice />} />
        <Route path="/soybean" element={<Soybean />} />
        <Route path="/wheat" element={<Wheat />} />
        <Route path="/rapeseed" element={<Rapeseed />} />

        {/* MarketHub — public browsing */}
        <Route path="/markethub" element={<MarketHub />} />
        <Route path="/markethub/product/:slug" element={<ProductDetail />} />

        {/* MarketHub — requires login (cart, checkout, orders) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/markethub/cart" element={<Cart />} />
          <Route path="/markethub/checkout" element={<Checkout />} />
          <Route path="/markethub/orders" element={<MyOrders />} />
          <Route path="/markethub/orders/:id" element={<OrderDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin panel — requires login AND role === "admin" */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

        {/* Guest-only routes — bounce logged-in users back out instead of
            letting them view forms that only make sense while logged out */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/register" element={<AuthRegister />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Catch-all — any unmatched URL lands here instead of a blank page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
