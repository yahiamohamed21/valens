import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-main-bg text-white font-sans antialiased">
       {children}
    </div>
  );
}
