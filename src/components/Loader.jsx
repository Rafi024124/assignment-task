"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1C2321] bg-opacity-90 z-50">
      {/* Spinning circle */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-t-[#EEF1EF] border-r-[#7D98A1] border-b-[#A9B4C2] border-l-[#5E6572] animate-spin"></div>
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#EEF1EF] animate-spin-slow"></div>
      </div>

      {/* Optional text */}
      <p className="absolute bottom-20 text-[#EEF1EF] text-lg font-semibold tracking-wide">
        Loading...
      </p>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
