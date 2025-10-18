"use client";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  return (
    <nav className="bg-[#1C2321] backdrop-blur-md p-4  gap-4 shadow-lg flex justify-center">
      <Link
        href="/products"
        className="text-[#5E6572] font-semibold hover:text-[#EEF1EF] hover:underline transition"
      >
        Products
      </Link>

      {token && (
        <>
          <Link
            href="/products/create"
            className="text-[#A9B4C2] font-semibold hover:text-[#EEF1EF] hover:underline transition"
          >
            Create Product
          </Link>
          <button
            onClick={() => {
              dispatch(logout());
              window.location.href = "/"; 
            }}
            className="text-[#EE6C6C] font-semibold hover:text-[#EEF1EF] hover:underline transition"
          >
            Logout
          </button>
        </>
      )}

      {!token && (
        <Link
          href="/login"
          className="text-[#7D98A1] font-semibold hover:text-[#EEF1EF] hover:underline transition"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
