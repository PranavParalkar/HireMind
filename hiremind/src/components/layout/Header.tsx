"use client";

import React from "react";
import { Search, Bell, Plus, Settings } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-[64px] border-b border-border-default bg-bg-secondary/90 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-[15px] font-semibold text-text-primary leading-none">{title}</h1>
          {subtitle && (
            <p className="text-[11px] text-text-muted mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="w-52 pl-8 pr-4 py-1.5 rounded-lg bg-bg-card border border-border-default text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet/30 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg bg-bg-card border border-border-default flex items-center justify-center text-text-muted hover:text-text-secondary hover:border-border-hover transition-all">
          <Bell size={15} />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent-violet text-white text-[9px] font-bold flex items-center justify-center">
            3
          </span>
        </button>

        {/* Settings icon */}
        <button className="w-8 h-8 rounded-lg bg-bg-card border border-border-default flex items-center justify-center text-text-muted hover:text-text-secondary hover:border-border-hover transition-all">
          <Settings size={15} />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2.5 ml-1 border-l border-border-default">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white bg-accent-violet"
          >
            RC
          </div>
          {/* <span className="text-[13px] text-text-secondary hidden lg:block">Ryan C.</span> */}
        </div>
      </div>
    </header>
  );
}
