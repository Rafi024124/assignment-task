"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "@/components/ProductForm";
import {  updateProduct } from "@/redux/slices/productsSlice";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const { singleProduct: product, loading, error } = useSelector(
    (state) => state.products
  );

  // Fetch product details by ID
  useEffect(() => {
    if (id && token) {
      dispatch(fetchSingleProduct({ id, token }));
    }
  }, [id, token, dispatch]);

  // Handle update submit
  const handleUpdate = async (payload, token) => {
    try {
      const resultAction = await dispatch(updateProduct({ id, token, payload }));

      if (updateProduct.fulfilled.match(resultAction)) {
        const updatedProduct = resultAction.payload;
        router.push(`/products/${updatedProduct.slug}`);
      } else {
        console.error("Product update failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // UI States
  if (loading)
    return (
      <p className="text-center text-cyan-300 animate-pulse mt-10">
        Loading product...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-400 mt-10">
        Error: {error.message || error}
      </p>
    );
  if (!product)
    return (
      <p className="text-center text-gray-400 mt-10">Product not found</p>
    );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#1C2321" }}
    >
      <div className="w-full max-w-2xl p-6 bg-[#7D98A1]/20 backdrop-blur-md rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-[#EEF1EF] mb-6 text-center">
          Edit Product
        </h1>

        {/* show loading/error state */}
        {loading && (
          <p className="text-center text-blue-300 mb-4 animate-pulse">
            Updating product...
          </p>
        )}
        {error && (
          <p className="text-center text-red-400 mb-4">
            Error: {error.message || error}
          </p>
        )}

        <ProductForm
          product={product}
          onSubmit={handleUpdate}
          buttonClassName="bg-blue-400 hover:bg-blue-500 text-[#EEF1EF] transition transform hover:scale-105 hover:animate-shake"
        />
      </div>
    </div>
  );
}
