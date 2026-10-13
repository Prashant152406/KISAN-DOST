import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Tag, Package } from "lucide-react";

import productsData from "../../data/product.json"; // Import local JSON

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Find product by id from local JSON data
    const foundProduct = productsData.find((p) => p.id === id);
    setProduct(foundProduct || null);
  }, [id]);

  const handleAddToCart = () => {
    console.log("Adding to cart:", { product, quantity });
    alert(`Added ${quantity} ${product.title} to cart`);
  };

  const handleBuyNow = () => {
    navigate("/cart", { state: { product, quantity } });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found.
          </h2>
          <button
            onClick={() => navigate("/markethub")}
            className="text-green-600 hover:text-green-700"
          >
            Back to MarketHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate("/markethub")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to MarketHub
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "https://placehold.co/800x600"
                }
                alt={product.title}
                className="w-full h-96 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Tag className="w-4 h-4" />
                <span>{product.category}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-green-600">
                  ₹{product.price}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {product.rating?.toFixed(1) || "0"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">
                  Stock: {product.stock} units available
                </span>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.min(
                          Math.max(1, parseInt(e.target.value) || 1),
                          product.stock
                        )
                      )
                    }
                    className="w-20 text-center py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 border border-green-600 text-green-600 hover:bg-green-50 py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Buy Now
                </button>
              </div>

              {product.specifications && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-gray-100"
                        >
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
