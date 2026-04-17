"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

const authRoutes = ["/login", "/signup"];

export default function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Don't show sidebar on auth pages
  const isAuthPage = authRoutes.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      {/* Spacer that matches sidebar width — prevents overlap */}
      <div
        className="shrink-0 transition-all duration-300"
        style={{ width: sidebarCollapsed ? "76px" : "270px" }}
      />
      {/* Main content — takes remaining width */}
      <div className="flex-1 min-w-0 min-h-screen">
        {children}
      </div>
    </div>
  );
}
