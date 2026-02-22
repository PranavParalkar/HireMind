import React from "react";

interface BadgeProps {
  label: string;
  variant?: "violet" | "cyan" | "emerald" | "amber" | "rose" | "blue" | "default";
  size?: "sm" | "md";
}

const variantStyles: Record<string, string> = {
  violet: "bg-accent-violet/10 text-accent-violet-light border-accent-violet/15",
  cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/15",
  emerald: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/15",
  amber: "bg-accent-amber/10 text-accent-amber border-accent-amber/15",
  rose: "bg-accent-rose/10 text-accent-rose border-accent-rose/15",
  blue: "bg-accent-blue/10 text-accent-blue border-accent-blue/15",
  default: "bg-bg-elevated text-text-secondary border-border-default",
};

export default function Badge({ label, variant = "default", size = "sm" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium border rounded-md ${variantStyles[variant]} ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-[12px]"
      }`}
    >
      {label}
    </span>
  );
}
