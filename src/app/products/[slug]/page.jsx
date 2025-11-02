"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ProductForm from "@/components/ProductForm";
import Loader from "@/components/Loader";
import useDeleteProduct from "@/app/hooks/useDeleteProduct";
import useUpdateProduct from "@/app/hooks/useUpdateProduct";
import { fetchProductBySlug } from "@/redux/slices/productsSlice";

function SafeImage({ src, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const isValid = imgSrc && imgSrc.startsWith("http");

  return (
    <img
      src={isValid ? imgSrc : "/placeholder.png"}
      alt={alt || "Image"}
      className={className}
      {...props}
      onError={() => setImgSrc("/placeholder.png")}
    />
  );
}

export default function SingleProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { handleDelete } = useDeleteProduct(token);
  const { handleUpdate } = useUpdateProduct(token);

  const [editingProduct, setEditingProduct] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const { singleProduct: product, loadingSingle: loading, errorSingle: error } =
    useSelector((state) => state.products);

  // Fetch product by slug
  useEffect(() => {
    if (slug && token) {
      dispatch(fetchProductBySlug({ token, slug }));
    }
  }, [dispatch, slug, token]);

  const handlePrevImage = () =>
    setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  const handleNextImage = () =>
    setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));

  if (!token) return <p className="text-[#EEF1EF]">Please login to view this product.</p>;
  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error?.message || JSON.stringify(error)}</p>;

  if (!product) return <p className="text-[#EEF1EF]">Product not found</p>;

  return (
    <div className="p-6 min-h-screen bg-[#1C2321] text-[#EEF1EF]">
      <button
        onClick={() => router.push("/products")}
        className="mb-6 px-4 py-2 rounded-md bg-[#5E6572]/30 backdrop-blur-sm hover:bg-[#7D98A1]/40 transition"
      >
        &larr; Back to Products
      </button>

      <h1 className="text-4xl font-bold mb-8">{product.name}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Section */}
        <div className="flex-1">
          <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-[#7D98A1]/20 via-[#5E6572]/20 to-[#A9B4C2]/20 backdrop-blur-md shadow-lg flex items-center justify-center">
            {product.images?.[currentImage] ? (
              <SafeImage
                src={product.images[currentImage]}
                alt={`${product.name} image`}
                className="object-contain rounded-xl w-full h-full"
              />
            ) : (
              <p>No image available</p>
            )}

            {product.images?.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50"
                >
                  &#8592;
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50"
                >
                  &#8594;
                </button>
              </>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 cursor-pointer ${
                    idx === currentImage ? "border-blue-400" : "border-[#5E6572]"
                  }`}
                  onClick={() => setCurrentImage(idx)}
                >
                  <SafeImage src={img} alt={`${product.name} ${idx}`} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-2xl font-bold text-green-400">${product.price}</p>

          {product.category && (
            <div className="flex items-center gap-3">
              {product.category.image && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#5E6572]">
                  <SafeImage src={product.category.image} alt={product.category.name} className="object-cover w-full h-full" />
                </div>
              )}
              <p className="text-sm">
                Category: <span className="font-semibold">{product.category.name}</span>
              </p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-1">Description</h3>
            <p>{product.description || "No description provided."}</p>
          </div>

          <div className="text-xs mt-auto">
            <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setEditingProduct(true)}
              className="flex-1 px-4 py-2 rounded-md text-white bg-yellow-400 border border-yellow-300 transition transform hover:scale-105 hover:animate-shake"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="flex-1 px-4 py-2 rounded-md text-white bg-red-400 border border-red-300 transition transform hover:scale-105 hover:animate-shake"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="relative w-full max-w-2xl p-6 bg-[#1C2321]/30 backdrop-blur-md rounded-lg">
            <button
              onClick={() => setEditingProduct(false)}
              className="absolute top-2 right-2 text-[#EEF1EF] text-xl font-bold hover:text-[#A9B4C2]"
            >
              &times;
            </button>
            <ProductForm
              product={product}
              onSubmit={(payload) =>
                handleUpdate(product.id, payload, (updatedProduct) => {
  setEditingProduct(false);
  router.push(`/products/${updatedProduct.slug}`);
})

              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
