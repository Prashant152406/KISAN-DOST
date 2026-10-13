import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { categoryApi } from "../../services/productApi.js";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    categoryApi
      .list()
      .then((res) => setCategories(res.data.data.categories))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setErrorMessage("");
    try {
      await categoryApi.create({ name: name.trim() });
      setName("");
      load();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setErrorMessage("");
    try {
      await categoryApi.remove(id);
      load();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6 max-w-md">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md divide-y">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between px-5 py-3">
              <span className="font-medium text-gray-800">{cat.name}</span>
              <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-gray-400 text-sm px-5 py-6">
              No categories yet — add one above, or run <code>npm run seed:categories</code> on the backend.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
