"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { Search, Filter, Download, ChevronDown, Eye } from "lucide-react";
import { candidates } from "@/lib/mockData";

const statusColors: Record<string, { bg: string; text: string }> = {
  new: { bg: "rgba(96,165,250,0.12)", text: "#60a5fa" },
  screening: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24" },
  interview: { bg: "rgba(139,92,246,0.12)", text: "#a78bfa" },
  offer: { bg: "rgba(34,211,238,0.12)", text: "#22d3ee" },
  hired: { bg: "rgba(52,211,153,0.12)", text: "#34d399" },
  rejected: { bg: "rgba(251,113,133,0.12)", text: "#fb7185" },
};

export default function CandidatesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"fitScore" | "resumeScore" | "name">("fitScore");

  const filtered = candidates
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b[sortBy] - a[sortBy];
    });

  return (
    <>
      <Header title="Candidates" subtitle={`${candidates.length} total candidates in pipeline`} />
      <main style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 300px", maxWidth: 400 }}>
            <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: 38,
                paddingRight: 16,
                paddingTop: 10,
                paddingBottom: 10,
                borderRadius: 12,
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                fontSize: 13,
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                fontSize: 13,
                color: "var(--text-secondary)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "fitScore" | "resumeScore" | "name")}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                fontSize: 13,
                color: "var(--text-secondary)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="fitScore">Sort: Fit Score</option>
              <option value="resumeScore">Sort: Resume Score</option>
              <option value="name">Sort: Name</option>
            </select>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 16px",
                borderRadius: 12,
                background: "var(--accent-violet)",
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 200px 120px 80px 80px 50px",
              gap: 12,
              padding: "14px 24px",
              borderBottom: "1px solid var(--border-color)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-muted)",
            }}
          >
            <span>Candidate</span>
            <span>Skills</span>
            <span>Status</span>
            <span>Resume</span>
            <span>Fit Score</span>
            <span>Action</span>
          </div>

          {/* Table Rows */}
          {filtered.map((c) => {
            const sc = statusColors[c.status];
            return (
              <div
                key={c.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 200px 120px 80px 80px 50px",
                  gap: 12,
                  alignItems: "center",
                  padding: "16px 24px",
                  borderBottom: "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-card-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {/* Candidate */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                      background: c.fitScore >= 90 ? "#8b5cf6" : c.fitScore >= 80 ? "#22d3ee" : "#60a5fa",
                    }}
                  >
                    {c.avatar}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.role} · {c.experience}</div>
                  </div>
                </div>

                {/* Skills */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {c.skills.slice(0, 2).map((s) => (
                    <span key={s} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)", fontWeight: 500 }}>
                      {s}
                    </span>
                  ))}
                  {c.skills.length > 2 && <span style={{ fontSize: 10, color: "var(--text-muted)" }}>+{c.skills.length - 2}</span>}
                </div>

                {/* Status */}
                <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: sc.bg, color: sc.text, textTransform: "capitalize", display: "inline-block", width: "fit-content" }}>
                  {c.status}
                </span>

                {/* Resume Score */}
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{c.resumeScore}</span>

                {/* Fit Score */}
                <span style={{ fontSize: 18, fontWeight: 800, color: c.fitScore >= 90 ? "#34d399" : c.fitScore >= 80 ? "#22d3ee" : "#fbbf24" }}>
                  {c.fitScore}
                </span>

                {/* Action */}
                <button style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", cursor: "pointer" }}>
                  <Eye size={14} />
                </button>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontSize: 13 }}>
            No candidates match your filters.
          </div>
        )}
      </main>
    </>
  );
}
