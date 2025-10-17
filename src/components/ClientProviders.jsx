"use client";

import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store"; // ✅ fixed import
import { setToken } from "@/redux/slices/authSlice";
import Navbar from "./Navbar";

// Separate client component that runs inside the Provider
function InnerClient({ children }) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(setToken(token));
    setMounted(true);
  }, [dispatch]);

  if (!mounted) return null;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

// Wrapper that provides Redux store
export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <InnerClient>{children}</InnerClient>
    </Provider>
  );
}
