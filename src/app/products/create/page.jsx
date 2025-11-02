"use client";

import ProductForm from "@/components/ProductForm";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/redux/slices/productsSlice";

export default function CreateProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loadingList, errorList } = useSelector((state) => state.products);

  const handleCreate = async (payload) => {
    try {
      const resultAction = await dispatch(createProduct({ payload }));

      if (createProduct.fulfilled.match(resultAction)) {
        const createdProduct = resultAction.payload;
        router.push(`/products/${createdProduct.slug}`);
      } else {
        console.error("Product creation failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#1C2321" }}
    >
      <div className="w-full max-w-2xl p-6 bg-[#7D98A1]/20 backdrop-blur-md rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-[#EEF1EF] mb-6 text-center">
          Create New Product
        </h1>

        {loadingList && (
          <p className="text-center text-blue-300 mb-4 animate-pulse">
            Creating product...
          </p>
        )}
        {errorList && (
          <p className="text-center text-red-400 mb-4">
            Error: {typeof errorList === "string" ? errorList : errorList.message}
          </p>
        )}

        <ProductForm
          onSubmit={handleCreate}
          buttonClassName="bg-blue-400 hover:bg-blue-500 text-[#EEF1EF] transition transform hover:scale-105 hover:animate-shake"
        />
      </div>
    </div>
  );
}
