import React from "react";
import Link from "next/link";
import { SafeImage } from "@/app/products/page";


const ProductCard = React.memo(({ product, onEdit, onDelete }) => (
  <div className="relative flex flex-col rounded-xl overflow-hidden border border-[#5E6572] bg-gradient-to-br from-[#7D98A1]/20 via-[#5E6572]/20 to-[#A9B4C2]/20 backdrop-blur-md shadow-lg transition hover:shadow-amber-50 group">
    <div className="relative w-full h-56">
      <SafeImage
        src={product.images?.[0]}
        alt={product.name}
        className="object-contain w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
      />
    </div>
    <div className="p-4 flex flex-col flex-1">
      <h2 className="text-xl font-bold mb-2">{product.name}</h2>
      <p className="text-[#EEF1EF] mb-3 line-clamp-2 flex-1">{product.description}</p>
      <p className="font-semibold mb-1">${product.price}</p>
      <p className="text-sm mb-1">
        Category: <span className="font-semibold">{product.category?.name}</span>
      </p>
      <p className="text-xs mb-3">
        Created: {new Date(product.createdAt).toLocaleDateString()}
      </p>
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

export default ProductCard;
