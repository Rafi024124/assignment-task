"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import ProductForm from "@/components/ProductForm";
import { fetchProducts } from "@/redux/slices/productsSlice";

export default function SingleProductPage() {
  const { slug } = useParams(); 
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(false);

  useEffect(() => {
    if (!slug || !token) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.bitechx.com/products/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Failed to fetch product. Status: ${res.status}`);

        const data = await res.json();
        setProduct(data[0] || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, token]);

  const handleDelete = async () => {
    if (!confirm("Are you sure to delete this product?")) return;

    try {
      const res = await fetch(`https://api.bitechx.com/products/${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete product");

      dispatch(fetchProducts({ token, offset: 0 }));
      router.push("/products");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (payload) => {
    try {
      const res = await fetch(`https://api.bitechx.com/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update product");

      const updatedProduct = await res.json();
      setProduct(updatedProduct);
      setEditingProduct(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!token) return <p className="text-[#EEF1EF]">Please login to view this product.</p>;
  if (loading) return <p className="text-[#EEF1EF]">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p className="text-[#EEF1EF]">Product not found</p>;

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#1C2321", color: "#EEF1EF" }}>
      {/* Back Button */}
      <button
        onClick={() => router.push("/products")}
        className="mb-6 px-4 py-2 rounded-md bg-[#5E6572]/30 backdrop-blur-sm hover:bg-[#7D98A1]/40 transition text-[#EEF1EF]"
      >
        &larr; Back to Products
      </button>

      <h1 className="text-4xl font-bold mb-8">{product.name}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Images */}
        <div className="flex-1">
          <div className="relative w-full h-96 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-[#7D98A1]/20 via-[#5E6572]/20 to-[#A9B4C2]/20 backdrop-blur-md shadow-lg group">
            <Image
              src={product.images?.[0]?.startsWith("http") ? product.images[0] : "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain rounded-xl"
            />
          </div>

          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-2">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#5E6572] bg-[#7D98A1]/20 backdrop-blur-sm"
                >
                  <Image
                    src={img.startsWith("http") ? img : "/placeholder.png"}
                    alt={`${product.name} ${idx}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-2xl font-bold text-green-400">${product.price}</p>

          {product.category && (
            <div className="flex items-center gap-3">
              {product.category.image && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#5E6572]">
                  <Image
                    src={product.category.image}
                    alt={product.category.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-[#EEF1EF] text-sm">
                Category: <span className="font-semibold">{product.category.name}</span>
              </p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-1 text-[#EEF1EF]">Description</h3>
            <p className="text-[#EEF1EF]">{product.description || "No description provided."}</p>
          </div>

          <div className="text-xs text-[#EEF1EF] mt-auto">
            <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setEditingProduct(true)}
              className="flex-1 px-4 py-2 rounded-md text-white bg-yellow-400 border border-yellow-300 transition transform hover:scale-105 hover:animate-shake"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
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
            <ProductForm product={product} onSubmit={handleUpdate} />
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
