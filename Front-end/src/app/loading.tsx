import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-main-bg text-white">
      <div className="flex flex-col items-center gap-4">
        {/* Glow spinner circle */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-border-color border-t-primary-coral shadow-[0_0_15px_rgba(255,138,117,0.2)]" />
        <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral animate-pulse">
          VALENS LAB LOADING...
        </span>
      </div>
    </div>
  );
}
