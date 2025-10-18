"use client";

import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store"; 
import { setToken } from "@/redux/slices/authSlice";
import Navbar from "./Navbar";


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


export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <InnerClient>{children}</InnerClient>
    </Provider>
  );
}
