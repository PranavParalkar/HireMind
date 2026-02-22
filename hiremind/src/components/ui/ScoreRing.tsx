"use client";

import React from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export default function ScoreRing({
  score,
  size = 48,
  strokeWidth = 4,
  color = "#7c3aed",
  label,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-ring-animated"
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>
          {score}
        </span>
        {label && <span className="text-[8px] text-text-muted">{label}</span>}
      </div>
    </div>
  );
}
