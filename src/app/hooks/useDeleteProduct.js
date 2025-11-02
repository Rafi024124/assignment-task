// src/hooks/useDeleteProduct.js
"use client";

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { deleteProduct, fetchProducts } from "@/redux/slices/productsSlice";

export default function useDeleteProduct(token,router = null) {
  const dispatch = useDispatch();

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This product will be deleted permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      try {
        await dispatch(deleteProduct({ token, id })).unwrap();
       

        Swal.fire("Deleted!", "Product has been deleted.", "success");
        if (router) router.push("/products");
      } catch (err) {
        Swal.fire("Error!", err.message || "Failed to delete product.", "error");
      }
    },
    [dispatch, token]
  );

  return { handleDelete };
}
