"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/slices/authSlice";

export default function TokenLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(setToken(token));
  }, [dispatch]);

  return null; 
}
