import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



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
      if (err.response?.status === 429) {
        return rejectWithValue("Too many requests. Please try again later.");
      }
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",
  async ({ token, slug }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`https://api.bitechx.com/products/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      if (err.response?.status === 429) {
        return rejectWithValue("Too many requests. Please try again later.");
      }
      return rejectWithValue(err.response?.data || "Failed to fetch product");
    }
  }
);

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

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ payload }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.post("https://api.bitechx.com/products", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, payload }, { getState, rejectWithValue }) => {
    const token = getState().auth.token; 
    try {
      const res = await axios.put(
        `https://api.bitechx.com/products/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update product");
    }
  }
);


export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const res= await axios.delete(`https://api.bitechx.com/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Delete response:", res.data);

       if (res.status === 200 && res.data?.success !== false) {
        return id;
      } else {
        throw new Error("API did not confirm deletion");
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete product");
    }
  }
);

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
      return rejectWithValue(
        err.response?.data || "Failed to fetch categories"
      );
    }
  }
);



const productsSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loadingList: false,
    errorList: null,
    categories: [],
    loadingCategories: false,
    errorCategories: null,
    singleProduct: null,
    loadingSingle: false,
    errorSingle: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Products
      .addCase(fetchProducts.pending, (state) => {
        state.loadingList = true;
        state.errorList = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loadingList = false;
        state.errorList = action.payload;
      })

      // Single Product
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loadingSingle = true;
        state.errorSingle = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loadingSingle = false;
        state.singleProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loadingSingle = false;
        state.errorSingle = action.payload;
      })

      // Search
      .addCase(searchProducts.pending, (state) => {
        state.loadingList = true;
        state.errorList = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loadingList = false;
        state.errorList = action.payload;
      })

      // Filter by category
      .addCase(filterProductsByCategory.pending, (state) => {
        state.loadingList = true;
        state.errorList = null;
      })
      .addCase(filterProductsByCategory.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
      })
      .addCase(filterProductsByCategory.rejected, (state, action) => {
        state.loadingList = false;
        state.errorList = action.payload;
      })

      // Create
      .addCase(createProduct.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loadingList = false;
        state.errorList = action.payload;
      })

      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loadingList = false;
        const index = state.list.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) state.list[index] = action.payload;

        if (state.singleProduct?.id === action.payload.id) {
          state.singleProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loadingList = false;
        state.errorList = action.error.message;
      })

      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loadingList = true;
        state.errorList = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = state.list.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loadingList = false;
        state.errorList = action.payload;
      })

      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loadingCategories = true;
        state.errorCategories = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loadingCategories = false;
        state.errorCategories = action.payload;
      });
  },
});

export default productsSlice.reducer;
