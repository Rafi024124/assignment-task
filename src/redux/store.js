// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setToken } from "./slices/authSlice";
import productsReducer from "./slices/productsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
     products: productsReducer
  },
});


if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) store.dispatch(setToken(token));
}
