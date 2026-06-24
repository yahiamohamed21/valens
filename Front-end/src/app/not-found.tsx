import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-main-bg text-white px-4 text-center">
      {/* 404 badge */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-card-bg border border-border-color text-primary-coral mb-6 shadow-[0_0_20px_rgba(255,138,117,0.15)]">
        <span className="text-2xl font-black">404</span>
      </div>
      
      <h2 className="text-lg font-black uppercase tracking-wider text-white">FORMULATION OUT OF BOUNDS</h2>
      <p className="mt-2 text-xs text-muted-text max-w-xs leading-relaxed uppercase tracking-wider font-semibold">
        The segment or page you are requesting could not be located in the Valens database index.
      </p>
      
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-coral px-8 py-3.5 text-xs font-black tracking-widest text-main-bg hover:bg-white transition-luxury shadow-lg shadow-primary-coral/10 hover:scale-102"
      >
        RETURN TO LAB
      </Link>
    </div>
  );
}
