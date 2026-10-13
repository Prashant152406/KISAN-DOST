import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, AlertTriangle } from "lucide-react";
import { useCartStore } from "../../store/cartStore.js";

const Cart = () => {
  const navigate = useNavigate();
  const { items, subtotal, isLoading, fetchCart, updateItem, removeItem } = useCartStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (productId, quantity) => {
    setBusyId(productId);
    setErrorMessage("");
    try {
      await updateItem(productId, quantity);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (productId) => {
    setBusyId(productId);
    try {
      await removeItem(productId);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/markethub")}
            className="text-green-600 hover:text-green-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to MarketHub
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">{errorMessage}</div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">Your cart is empty</h3>
              <p className="text-gray-400 mb-6">Add some products to get started</p>
              <button
                onClick={() => navigate("/markethub")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={item.image || "https://placehold.co/100x100"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <div className="text-green-600 font-bold">₹{item.price}</div>
                      {item.priceChanged && (
                        <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          Price changed since you added this (was ₹{item.priceWhenAdded})
                        </p>
                      )}
                      {item.availableStock < item.quantity && (
                        <p className="text-xs text-red-600 mt-1">Only {item.availableStock} left in stock</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={busyId === item.productId}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={busyId === item.productId || item.quantity >= item.availableStock}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={busyId === item.productId}
                      className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-gray-900">Subtotal: ₹{subtotal}</div>
                  <button
                    onClick={() => navigate("/markethub/checkout")}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Checkout
                  </button>
                </div>
                <p className="text-sm text-gray-500">Shipping and tax are calculated at checkout.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
