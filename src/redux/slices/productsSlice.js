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
      // Assuming API returns an array sometimes
      return Array.isArray(res.data) ? res.data[0] : res.data;
    } catch (err) {
      if (err.response?.status === 429) {
        
        return rejectWithValue("Too many requests. Please try again later.");
      }
      return rejectWithValue(handleApiError(err, "Failed to fetch product"));
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
  async ({ token, payload }, { rejectWithValue }) => {
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
  async ({ token, id, payload }) => {
    const res = await fetch(`https://api.bitechx.com/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return await res.json();
  }
);



export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`https://api.bitechx.com/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id; 
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
      return rejectWithValue(err.response?.data || "Failed to fetch categories");
    }
  }
);


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

      .addCase(fetchProductBySlug.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchProductBySlug.fulfilled, (state, action) => {
  state.loading = false;
  state.singleProduct = action.payload; // add this field in initialState
})
.addCase(fetchProductBySlug.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


      
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

      .addCase(createProduct.pending, (state) => {
  state.loading = true;
})
.addCase(createProduct.fulfilled, (state, action) => {
  state.loading = false;
  state.list.push(action.payload);
})
.addCase(createProduct.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

.addCase(updateProduct.pending, (state) => {
    state.loading = true;
  })
  .addCase(updateProduct.fulfilled, (state, action) => {
  state.loading = false;

 
  if (state.list?.length) {
    const index = state.list.findIndex(p => p._id === action.payload._id);
    if (index !== -1) state.list[index] = action.payload;
  }

 
  if (state.singleProduct?._id === action.payload._id) {
    state.singleProduct = action.payload;
  }
})

  .addCase(updateProduct.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message;
  })

      
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
