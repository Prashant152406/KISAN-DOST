import { useState, useEffect } from 'react';
import { marketHubApi } from '../services/marketHubApi';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await marketHubApi.getProducts(filters);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (searchTerm) => {
    await fetchProducts({ search: searchTerm });
  };

  const filterByCategory = async (category) => {
    const filters = category === 'all' ? {} : { category };
    await fetchProducts(filters);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    searchProducts,
    filterByCategory,
    refetch: fetchProducts
  };
};
