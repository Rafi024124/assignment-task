// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.post("https://api.bitechx.com/auth", { email });
      return res.data.token;
    } catch (error) {
      const message =
        error.response?.data?.message ||  
        error.response?.data ||          
        "Login failed";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      if (typeof window !== "undefined") localStorage.removeItem("token");
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        if (typeof window !== "undefined") localStorage.setItem("token", action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
