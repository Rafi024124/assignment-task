"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(email));
  };

  useEffect(() => {
    if (token) router.push("/products");
  }, [token, router]);

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{
        background: "linear-gradient(135deg, #1C2321, #5E6572)",
        color: "#EEF1EF",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md border border-[#7D98A1]/30"
        style={{
          background: "rgba(28, 35, 33, 0.6)",
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-[#A9B4C2] drop-shadow-md">
          Product Manager Login
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg outline-none text-[#EEF1EF] placeholder-gray-400 transition focus:ring-2 focus:ring-[#A9B4C2]"
            style={{
              backgroundColor: "#5E6572",
              border: "1px solid #7D98A1",
            }}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold transition transform hover:scale-105 active:scale-95 shadow-md"
            style={{
              background: "linear-gradient(90deg, #7D98A1, #A9B4C2)",
              color: "#1C2321",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {error && (
          <p className="text-red-400 mt-3 text-center text-sm">{error}</p>
        )}

        <p className="text-center text-sm mt-6 text-[#A9B4C2] opacity-80">
          Please enter your registered email to continue
        </p>
      </form>
    </div>
  );
}
