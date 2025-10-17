"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductForm from "@/components/ProductForm";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  fetchCategories,
  filterProductsByCategory,
  searchProducts,
} from "@/redux/slices/productsSlice";
import debounce from "lodash.debounce";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const products = useSelector((state) => state.products.list);
  const categories = useSelector((state) => state.products.categories);
  const loading = useSelector((state) => state.products.loading);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [offset, setOffset] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchCategories({ token }));
    if (selectedCategory) {
      dispatch(filterProductsByCategory({ token, categoryId: selectedCategory, offset }));
    } else if (!search) {
      dispatch(fetchProducts({ token, offset }));
    }
  }, [token, offset, selectedCategory, dispatch, search]);

  useEffect(() => {
    const delayedSearch = debounce(() => {
      if (search.trim()) {
        dispatch(searchProducts({ token, searchedText: search }));
        setSelectedCategory("");
      } else if (selectedCategory) {
        dispatch(filterProductsByCategory({ token, categoryId: selectedCategory, offset }));
      } else {
        dispatch(fetchProducts({ token, offset }));
      }
    }, 300);

    delayedSearch();
    return () => delayedSearch.cancel();
  }, [search, token, selectedCategory, offset, dispatch]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct({ token, id }));
    }
  };

  const handleEdit = (product) => setEditingProduct(product);
  const closeModal = () => setEditingProduct(null);

  const handleUpdate = async (payload) => {
    if (!editingProduct) return;

    const res = await fetch(`https://api.bitechx.com/products/${editingProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update product");

    closeModal();
    dispatch(fetchProducts({ token, offset }));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setOffset(0);
    setSearch("");
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{ backgroundColor: "#1C2321", color: "#EEF1EF" }}
    >
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 rounded-md border bg-[#3c4042] text-[#EEF1EF] backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#EEF1EF]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-md border border-[#7D98A1] bg-[#7D98A1]/30 text-[#EEF1EF] backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#EEF1EF]"
        />
      </div>

      {/* Loading */}
      {loading && <p className="text-[#EEF1EF]">Loading products...</p>}

      {/* Products Grid */}
      {!loading && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="relative flex flex-col rounded-xl overflow-hidden border border-[#5E6572] bg-gradient-to-br from-[#7D98A1]/20 via-[#5E6572]/20 to-[#A9B4C2]/20 backdrop-blur-md shadow-lg transition hover:shadow-amber-50 group"
            >
              {/* Glossy hover animation */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 pointer-events-none animate-glossy"></div>

              {/* Image */}
              <div className="relative w-full h-56">
                <img
                  src={p.images?.[0]?.startsWith("http") ? p.images[0] : "/placeholder.png"}
                  alt={p.name}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-xl font-bold mb-2">{p.name}</h2>
                <p className="text-[#EEF1EF] mb-3 line-clamp-2 flex-1">{p.description}</p>
                <p className="font-semibold mb-1">${p.price}</p>
                <p className="text-sm mb-1">
                  Category: <span className="font-semibold">{p.category?.name}</span>
                </p>
                <p className="text-xs mb-3">Created: {new Date(p.createdAt).toLocaleDateString()}</p>

                {/* Buttons */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/products/${p.slug}`}
                    className="flex-1 px-3 py-1 rounded-md text-sm font-semibold text-white bg-blue-400 border border-blue-300 relative overflow-hidden transition-transform transform hover:scale-105 hover:bg-blue-300 hover:animate-shake"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleEdit(p)}
                    className="flex-1 px-3 py-1 rounded-md text-sm font-semibold text-white bg-yellow-400 border border-yellow-300 relative overflow-hidden transition-transform transform hover:scale-105 hover:bg-yellow-300 hover:animate-shake"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 px-3 py-1 rounded-md text-sm font-semibold text-white bg-red-400 border border-red-300 relative overflow-hidden transition-transform transform hover:scale-105 hover:bg-red-300 hover:animate-shake"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="mt-6 text-[#EEF1EF]">No products found.</p>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4 flex-wrap">
        <button
          disabled={offset === 0}
          onClick={() => setOffset(Math.max(0, offset - 50))}
          className="bg-[#5E6572]/30 text-[#EEF1EF] font-semibold px-4 py-2 rounded-md disabled:opacity-50 transition hover:bg-[#7D98A1]/40"
        >
          Prev
        </button>
        <button
          onClick={() => setOffset(offset + 50)}
          className="bg-[#5E6572]/30 text-[#EEF1EF] font-semibold px-4 py-2 rounded-md transition hover:bg-[#7D98A1]/40"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-2xl p-6 bg-[#1C2321]/30 backdrop-blur-md rounded-lg">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-[#EEF1EF] text-xl font-bold hover:text-[#A9B4C2]"
            >
              &times;
            </button>
            <ProductForm product={editingProduct} onSubmit={handleUpdate} />
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes glossy {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }

        .animate-glossy::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          transform: skewX(-20deg);
          animation: glossy 1.2s linear infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
