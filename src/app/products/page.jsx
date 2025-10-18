"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Loader from "@/components/Loader";
import {
  fetchProducts,
  deleteProduct,
  fetchCategories,
  filterProductsByCategory,
  searchProducts,
} from "@/redux/slices/productsSlice";

// 💎 Lazy load ProductForm
const ProductForm = dynamic(() => import("@/components/ProductForm"), {
  ssr: false,
  loading: () => <Loader />,
});


function SafeImage({ src, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  const isLocal = !src?.startsWith("http");

  return (
    <img
      src={imgSrc || "/placeholder.png"}
      alt={alt || "Image"}
      {...props}
      onError={() => setImgSrc("/placeholder.png")}
    />
  );
}

export default function ProductsPage() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { list: products, categories, loading, error } = useSelector(
    (state) => state.products
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [offset, setOffset] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);

  //fetch cat
  useEffect(() => {
    if (token && categories.length === 0) {
      dispatch(fetchCategories({ token }));
    }
  }, [token, dispatch, categories.length]);

  // Fetch prod
  useEffect(() => {
    if (!token) return;
    if (selectedCategory) {
      dispatch(filterProductsByCategory({ token, categoryId: selectedCategory, offset }));
    } else if (!search) {
      dispatch(fetchProducts({ token, offset }));
    }
  }, [token, offset, selectedCategory, dispatch, search]);

  //debounce
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (value.trim()) {
          dispatch(searchProducts({ token, searchedText: value }));
        } else if (selectedCategory) {
          dispatch(filterProductsByCategory({ token, categoryId: selectedCategory, offset }));
        } else {
          dispatch(fetchProducts({ token, offset }));
        }
      }, 400),
    [dispatch, token, selectedCategory, offset]
  );

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search, debouncedSearch]);

  // Delete
  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This product will be deleted permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        dispatch(deleteProduct({ token, id }));
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      }
    },
    [dispatch, token]
  );

  // Edit 
  const handleEdit = useCallback(
    async (product) => {
      const result = await Swal.fire({
        title: "Edit Product?",
        text: "Do you want to edit this product?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
      });
      if (result.isConfirmed) setEditingProduct(product);
    },
    []
  );

  const closeModal = useCallback(() => setEditingProduct(null), []);

  const handleUpdate = useCallback(
    async (payload) => {
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
      Swal.fire("Updated!", "Product has been updated.", "success");
    },
    [dispatch, editingProduct, token, offset, closeModal]
  );

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
    setOffset(0);
    setSearch("");
  }, []);

  return (
    <div className="bg-[#1C2321] text-[#EEF1EF]">
       <div className="p-6 min-h-screen  max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

     
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

      
      {loading && <Loader />}
      
     {!token ? (
  <p className="mt-6 text-[#EEF1EF]">Please log in to see the products.</p>
) : loading ? (
  <Loader />
) : error ? (
  <p className="mt-6 text-[#EEF1EF]">{error}</p>
) : products.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {products.map((p, index) => (
      <ProductCard
        key={p.id || index}
        product={p}
        onEdit={handleEdit}
        onDelete={handleDelete}
        index={index}
      />
    ))}
  </div>
) : (
  <p className="mt-6 text-[#EEF1EF]">No products found.</p>
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
    </div>
    </div>
   
  );
}


const ProductCard = React.memo(({ product, onEdit, onDelete, index }) => (
  <div className="relative flex flex-col rounded-xl overflow-hidden border border-[#5E6572] bg-gradient-to-br from-[#7D98A1]/20 via-[#5E6572]/20 to-[#A9B4C2]/20 backdrop-blur-md shadow-lg transition hover:shadow-amber-50 group">
   
    <div className="relative w-full h-56">
      <SafeImage src={product.images?.[0]} alt={product.name} 
       className="object-contain w-full h-full transition-transform duration-300 ease-in-out hover:scale-105" />
    </div>

   
    <div className="p-4 flex flex-col flex-1">
      <h2 className="text-xl font-bold mb-2">{product.name}</h2>
      <p className="text-[#EEF1EF] mb-3 line-clamp-2 flex-1">{product.description}</p>
      <p className="font-semibold mb-1">${product.price}</p>
      <p className="text-sm mb-1">
        Category: <span className="font-semibold">{product.category?.name}</span>
      </p>
      <p className="text-xs mb-3">Created: {new Date(product.createdAt).toLocaleDateString()}</p>

      <div className="flex gap-2 mt-auto">
        <Link
          href={`/products/${product.slug}`}
          className="flex-1 px-3 py-1 rounded-md text-sm font-semibold text-white bg-blue-400 border border-blue-300 transition hover:scale-105 hover:bg-blue-300 hover:animate-shake"
        >
          View
        </Link>
        <button
          onClick={() => onEdit(product)}
          className="flex-1 px-3 py-1 rounded-md text-sm font-semibold text-white bg-yellow-400 border border-yellow-300 transition hover:scale-105 hover:bg-yellow-300 hover:animate-shake"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex-1 px-3 py-1 rounded-md text-sm font-semibold text-white bg-red-400 border border-red-300 transition hover:scale-105 hover:bg-red-300 hover:animate-shake"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
));
