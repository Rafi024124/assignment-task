import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --------------------
// THUNKS
// --------------------

// Fetch products with optional pagination
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ token, offset = 0, limit = 50 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://api.bitechx.com/products?offset=${offset}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);

// Search products by name
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async ({ token, searchedText }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://api.bitechx.com/products/search?searchedText=${encodeURIComponent(
          searchedText
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to search products");
    }
  }
);

// Filter products by category
export const filterProductsByCategory = createAsyncThunk(
  "products/filterProductsByCategory",
  async ({ token, categoryId, offset = 0, limit = 50 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://api.bitechx.com/products?categoryId=${categoryId}&offset=${offset}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to filter products");
    }
  }
);


// Delete product by id
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`https://api.bitechx.com/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id; // Return the deleted id for updating the state
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete product");
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async ({ token, offset = 0, limit = 50 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://api.bitechx.com/categories?offset=${offset}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch categories");
    }
  }
);

// --------------------
// SLICE
// --------------------
const productsSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Filter by Category
      .addCase(filterProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(filterProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
