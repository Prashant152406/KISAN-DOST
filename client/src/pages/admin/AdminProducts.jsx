import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { productApi, categoryApi } from "../../services/productApi.js";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  images: "",
};

function ProductForm({ initial, categories, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await onSubmit({
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
      {errorMessage && <div className="rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">{errorMessage}</div>}
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
        <select name="category" value={form.category} onChange={handleChange} required className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <input name="price" type="number" min="0" step="0.01" placeholder="Price (₹)" value={form.price} onChange={handleChange} required className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
        <input name="stock" type="number" min="0" placeholder="Stock quantity" value={form.stock} onChange={handleChange} required className="px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
      </div>
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required rows={3} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
      <input name="images" placeholder="Image URLs, comma-separated" value={form.images} onChange={handleChange} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50">
          {submitting ? "Saving..." : "Save product"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 flex items-center gap-1">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([productApi.adminList({ limit: 50 }), categoryApi.list()])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data.data.items);
        setCategories(catRes.data.data.categories);
      })
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await productApi.update(editing._id, data);
      } else {
        await productApi.create(data);
      }
      setFormOpen(false);
      setEditing(null);
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await productApi.remove(id);
      load();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        {!formOpen && (
          <button onClick={openCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add product
          </button>
        )}
      </div>

      {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}

      {formOpen && (
        <ProductForm
          initial={
            editing
              ? {
                  name: editing.name,
                  description: editing.description,
                  category: editing.category?._id || editing.category,
                  price: editing.price,
                  stock: editing.stock,
                  images: (editing.images || []).join(", "),
                }
              : emptyForm
          }
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          submitting={submitting}
        />
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-5 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-5 py-3 text-gray-500">{p.category?.name}</td>
                  <td className="px-5 py-3">₹{p.price}</td>
                  <td className="px-5 py-3">{p.stock}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(p)} className="text-gray-500 hover:text-green-600">
                      <Pencil className="w-4 h-4 inline" />
                    </button>
                    {p.isActive && (
                      <button onClick={() => handleDeactivate(p._id)} className="text-gray-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="text-gray-400 text-sm px-5 py-6">No products yet.</p>}
        </div>
      )}
    </div>
  );
}
