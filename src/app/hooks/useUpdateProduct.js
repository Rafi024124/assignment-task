
"use client";

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { fetchProducts, updateProduct } from "@/redux/slices/productsSlice";

export default function useUpdateProduct(token, offset = 0) {
  const dispatch = useDispatch();

  const handleUpdate = useCallback(
    async (id, payload, onSuccess = () => {}) => {
      try {
       const updatedProduct= await dispatch(updateProduct({ token, id, payload })).unwrap();

       
        onSuccess(updatedProduct);

        
        dispatch(fetchProducts({ token, offset }));

        Swal.fire("Updated!", "Product has been updated successfully.", "success");
      } catch (error) {
        console.error("Update failed:", error);
        Swal.fire("Error!", error?.message || "Failed to update product", "error");
      }
    },
    [dispatch, token, offset]
  );

  return { handleUpdate };
}
