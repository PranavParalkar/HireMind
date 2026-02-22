"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

export default function StatCard({ title, value, trend, icon, color, delay = 0 }: StatCardProps) {
  const isPositive = trend >= 0;

  return (
    <div
      className="card p-5 relative overflow-hidden fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] text-text-secondary font-medium">{title}</span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}12`, color }}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[28px] font-bold text-text-primary leading-none tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          <div
            className={`flex items-center gap-1 text-[12px] font-medium mt-2 ${
              isPositive ? "text-accent-emerald" : "text-accent-rose"
            }`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? "+" : ""}{trend}%
          </div>
        </div>
      </div>
    </div>
  );
}
