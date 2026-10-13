import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Star, Leaf } from "lucide-react";
import { productApi, categoryApi } from "../../services/productApi.js";
import { useCartStore } from "../../store/cartStore.js";
import { useAuthStore } from "../../store/authStore.js";

const MarketHub = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    categoryApi
      .list()
      .then((res) => setCategories(res.data.data.categories))
      .catch(() => {}); // categories are a nice-to-have filter; don't block the page on failure
  }, []);

  useEffect(() => {
    setLoading(true);
    setErrorMessage("");
    const params = { page, limit: 12, sort: "newest" };
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory !== "all") params.category = selectedCategory;

    productApi
      .list(params)
      .then((res) => {
        setProducts(res.data.data.items);
        setPagination(res.data.data.pagination);
      })
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  }, [page, searchTerm, selectedCategory]);

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/markethub" } } });
      return;
    }
    setAddingId(product._id);
    try {
      await addItem(product._id, 1);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setAddingId(null);
    }
  };

  const handleBuyNow = async (e, product) => {
    await handleAddToCart(e, product);
    if (isAuthenticated) navigate("/markethub/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white py-2 overflow-hidden">
        <div className="animate-pulse text-center font-medium">
          Welcome to Kisan MarketHub - Your trusted farming partner
        </div>
      </div>

      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Leaf className="w-12 h-12" />
            Welcome to Kisan MarketHub
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Seeds • Fertilizers • Equipment • Crop Protection • Tools
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat._id
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">{errorMessage}</div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/markethub/product/${product.slug}`)}
                >
                  <img
                    src={product.images?.[0] || "https://placehold.co/300x200"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">{product.category?.name}</div>
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.shortDescription || product.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{product.rating ? product.rating.toFixed(1) : "0"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>{product.stock > 0 ? `Stock: ${product.stock}` : "Out of stock"}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock === 0 || addingId === product._id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {addingId === product._id ? "Adding..." : "Add to Cart"}
                      </button>
                      <button
                        onClick={(e) => handleBuyNow(e, product)}
                        disabled={product.stock === 0}
                        className="bg-white border border-green-600 text-green-600 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-green-50 disabled:opacity-50"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">No products found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default MarketHub;
