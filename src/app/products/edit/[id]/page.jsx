"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !token) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://api.bitechx.com/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleUpdate = async (payload, token) => {
    const res = await fetch(`https://api.bitechx.com/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update product");
    const data = await res.json();
    router.push(`/products/${data.slug}`);
  };

  if (loading) return <p className="text-cyan-300">Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p className="text-gray-400">Product not found</p>;

  return <ProductForm product={product} onSubmit={handleUpdate} />;
}
