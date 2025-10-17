"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useEffect } from "react";
import { setToken } from "@/redux/slices/authSlice";

export default function ReduxProviderWrapper({ children }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) store.dispatch(setToken(token));
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
