"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { fetchCategories } from "@/redux/slices/productsSlice";
import { useDispatch } from "react-redux";

export default function ProductForm({ product = null, onSubmit }) {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
 const { categories, loading: categoriesLoading, error } = useSelector((state) => state.products);
  

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || "");
  const [images, setImages] = useState(product?.images?.join(", ") || "");
  const [categoryId, setCategoryId] = useState(product?.category?.id || "");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  
 useEffect(() => {
  if (token) {
    dispatch(fetchCategories({ token }));
  }
}, [token, dispatch]);

  
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!description.trim()) errs.description = "Description is required";
    if (!price || isNaN(price) || Number(price) <= 0)
      errs.price = "Price must be greater than 0";
    if (!images.trim()) errs.images = "At least one image URL is required";
    if (!categoryId) errs.categoryId = "Category is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    setErrors({});
    setSubmitError("");

    if (!validate()) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      images: images.split(",").map((img) => img.trim()),
      categoryId,
    };

    setLoading(true);

    try {
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-xl shadow-md max-w-2xl mx-auto"
      style={{
        backgroundColor: "#1C2321",
        color: "#EEF1EF",
        border: "1px solid #5E6572",
      }}
    >
      <h2 className="text-2xl font-bold mb-4 text-[#A9B4C2]">
        {product ? "Edit Product" : "Create Product"}
      </h2>

      {submitError && <p className="text-red-400 mb-3">{submitError}</p>}

      
      <div className="mb-4">
        <label className="block mb-1 text-[#A9B4C2]">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
            setSubmitError("");
          }}
          className="w-full px-3 py-2 rounded-md border border-[#5E6572] bg-[#252B2A] text-[#EEF1EF] focus:outline-none focus:ring-2 focus:ring-[#7D98A1]"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name}</p>
        )}
      </div>

     
      <div className="mb-4">
        <label className="block mb-1 text-[#A9B4C2]">Description *</label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrors((prev) => ({ ...prev, description: "" }));
            setSubmitError("");
          }}
          className="w-full px-3 py-2 rounded-md border border-[#5E6572] bg-[#252B2A] text-[#EEF1EF] focus:outline-none focus:ring-2 focus:ring-[#7D98A1]"
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">{errors.description}</p>
        )}
      </div>

    
      <div className="mb-4">
        <label className="block mb-1 text-[#A9B4C2]">Price *</label>
        <input
          type="number"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            setErrors((prev) => ({ ...prev, price: "" }));
            setSubmitError("");
          }}
          className="w-full px-3 py-2 rounded-md border border-[#5E6572] bg-[#252B2A] text-[#EEF1EF] focus:outline-none focus:ring-2 focus:ring-[#7D98A1]"
        />
        {errors.price && (
          <p className="text-red-400 text-sm mt-1">{errors.price}</p>
        )}
      </div>

  
      <div className="mb-4">
        <label className="block mb-1 text-[#A9B4C2]">
          Images (comma separated) *
        </label>
        <input
          type="text"
          value={images}
          onChange={(e) => {
            setImages(e.target.value);
            setErrors((prev) => ({ ...prev, images: "" }));
            setSubmitError("");
          }}
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
          className="w-full px-3 py-2 rounded-md border border-[#5E6572] bg-[#252B2A] text-[#EEF1EF] focus:outline-none focus:ring-2 focus:ring-[#7D98A1]"
        />
        {errors.images && (
          <p className="text-red-400 text-sm mt-1">{errors.images}</p>
        )}
      </div>

    
      <div className="mb-4">
        <label className="block mb-1 text-[#A9B4C2]">Category *</label>
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setErrors((prev) => ({ ...prev, categoryId: "" }));
            setSubmitError("");
          }}
          className="w-full px-3 py-2 rounded-md border border-[#5E6572] bg-[#252B2A] text-[#EEF1EF] focus:outline-none focus:ring-2 focus:ring-[#7D98A1]"
        >
          <option value="">
            {categoriesLoading ? "Loading categories..." : "Select Category"}
          </option>
          {categories?.map((cat) => (
  <option key={cat.id} value={cat.id}>
    {cat.name}
  </option>
))}

        </select>
        {errors.categoryId && (
          <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || categoriesLoading}
        className="w-full py-2 mt-2 font-semibold rounded-md transition duration-200"
        style={{
          backgroundColor: "#7D98A1",
          color: "#EEF1EF",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
