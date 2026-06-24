"use client";

import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const getActiveTabName = () => {
    const segments = pathname.split("/");
    const lastSegment = segments[segments.length - 1];
    if (lastSegment === "admin" || !lastSegment) return "OVERVIEW";
    if (lastSegment === "homepage") return "HOME CONTROL";
    return lastSegment.toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-main-bg text-white font-sans antialiased">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex h-16 items-center justify-between border-b border-border-color bg-surface-deep/30 px-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-text">
            SYSTEMS CONTROL PANEL &gt; <span className="text-white">{getActiveTabName()}</span>
          </h2>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
