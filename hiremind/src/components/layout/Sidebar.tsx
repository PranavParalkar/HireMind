"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Video,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/interviews", label: "Interviews", icon: Video },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-bg-secondary border-r border-border-default flex flex-col z-50 transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Logo */}
      <div className="h-[72px] flex items-center px-5 border-b border-border-default">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-accent-violet"
          >
            <Sparkles size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-text-primary tracking-tight leading-none">
                HireMind
              </span>
              <span className="text-[10px] text-text-muted mt-0.5">Talent Intelligence</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group relative ${
                isActive
                  ? "bg-accent-violet-dim text-accent-violet-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-accent-violet" />
              )}
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-3">
        {/* Upgrade CTA */}
        {!collapsed && (
          <div className="p-4 rounded-xl bg-accent-violet-dim border border-accent-violet/10">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap size={14} className="text-accent-violet-light" />
              <span className="text-xs font-semibold text-text-primary">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Unlock AI interview analysis & advanced predictions.
            </p>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 rounded-lg text-text-muted hover:text-text-secondary hover:bg-bg-card transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
