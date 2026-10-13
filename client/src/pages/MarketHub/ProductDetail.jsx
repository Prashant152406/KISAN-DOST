import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { productApi } from "../../services/productApi.js";
import { useCartStore } from "../../store/cartStore.js";
import { useAuthStore } from "../../store/authStore.js";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    productApi
      .getBySlug(slug)
      .then((res) => setProduct(res.data.data.product))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/markethub/product/${slug}` } } });
      return;
    }
    setAdding(true);
    try {
      await addItem(product._id, quantity);
      navigate("/markethub/cart");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  if (errorMessage || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">{errorMessage || "Product not found."}</p>
        <button onClick={() => navigate("/markethub")} className="text-green-600 hover:underline">
          Back to MarketHub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate("/markethub")}
          className="text-green-600 hover:text-green-700 flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to MarketHub
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden grid md:grid-cols-2 gap-8 p-6">
          <img
            src={product.images?.[0] || "https://placehold.co/500x400"}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />

          <div>
            <p className="text-sm text-gray-500 mb-1">{product.category?.name}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && <p className="text-gray-500 mb-4">by {product.brand}</p>}

            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">{product.rating?.toFixed(1) || "0"}</span>
              <span className="text-gray-400 text-sm">({product.reviewCount || 0} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            {(product.cropTypes?.length > 0 || product.dosage || product.usageInstructions) && (
              <div className="mb-6 bg-green-50 rounded-lg p-4 text-sm text-gray-700 space-y-1">
                {product.cropTypes?.length > 0 && (
                  <p><span className="font-medium">Suitable crops:</span> {product.cropTypes.join(", ")}</p>
                )}
                {product.dosage && <p><span className="font-medium">Dosage:</span> {product.dosage}</p>}
                {product.usageInstructions && (
                  <p><span className="font-medium">Usage:</span> {product.usageInstructions}</p>
                )}
              </div>
            )}

            <p className="text-sm text-gray-500 mb-4">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>

            {errorMessage && <p className="text-sm text-red-600 mb-4">{errorMessage}</p>}

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
