"use client";

import ProductForm from "@/components/ProductForm";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();

  const handleCreate = async (payload, token) => {
    const res = await fetch("https://api.bitechx.com/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create product");
    const data = await res.json();
    router.push(`/products/${data.slug}`); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#1C2321" }}>
      <div className="w-full max-w-2xl p-6 bg-[#7D98A1]/20 backdrop-blur-md rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-[#EEF1EF] mb-6 text-center">
          Create New Product
        </h1>
        <ProductForm onSubmit={handleCreate} buttonClassName="bg-blue-400 hover:bg-blue-500 text-[#EEF1EF] transition transform hover:scale-105 hover:animate-shake" />
      </div>

     
    </div>
  );
}
