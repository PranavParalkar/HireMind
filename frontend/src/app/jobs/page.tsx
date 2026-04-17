"use client";

import React from "react";
import Header from "@/components/layout/Header";
import { MapPin, Users, Plus, MoreHorizontal, Briefcase } from "lucide-react";
import { jobs } from "@/lib/mockData";

const typeColors: Record<string, { bg: string; text: string }> = {
  "full-time": { bg: "rgba(52,211,153,0.12)", text: "#34d399" },
  "part-time": { bg: "rgba(251,191,36,0.12)", text: "#fbbf24" },
  contract: { bg: "rgba(34,211,238,0.12)", text: "#22d3ee" },
  remote: { bg: "rgba(139,92,246,0.12)", text: "#a78bfa" },
};

const statusDot: Record<string, string> = {
  active: "#34d399",
  paused: "#fbbf24",
  closed: "#55555f",
};

export default function JobsPage() {
  return (
    <>
      <Header title="Jobs" subtitle={`${jobs.length} open positions`} />
      <main style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "Active Jobs", value: jobs.filter((j) => j.status === "active").length, color: "#34d399", icon: <Briefcase size={20} /> },
            { label: "Total Applicants", value: jobs.reduce((s, j) => s + j.applicants, 0), color: "#22d3ee", icon: <Users size={20} /> },
            { label: "Avg. Score", value: Math.round(jobs.reduce((s, j) => s + j.avgScore, 0) / jobs.length), color: "#8b5cf6", icon: <Briefcase size={20} /> },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: `${s.color}15`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Job Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {/* Create New Job */}
          <button
            style={{
              background: "var(--bg-card)",
              border: "2px dashed var(--border-color)",
              borderRadius: 16,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              minHeight: 240,
              cursor: "pointer",
              transition: "border-color 0.2s",
              color: "var(--text-muted)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-violet)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--accent-violet-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={22} color="var(--accent-violet-light)" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Create New Job</span>
          </button>

          {jobs.map((job) => {
            const tc = typeColors[job.type];
            return (
              <div key={job.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: statusDot[job.status] }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusDot[job.status] }} />
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </div>
                    <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{job.title}</h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>{job.department}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "var(--text-muted)", marginBottom: 14 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{job.location}</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, background: tc.bg, color: tc.text, fontWeight: 600 }}>{job.type}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
                    {job.skills.map((s) => (
                      <span key={s} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)", fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
                    <Users size={13} />
                    <span><strong style={{ color: "var(--text-primary)" }}>{job.applicants}</strong> applicants</span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: job.avgScore >= 80 ? "#34d399" : job.avgScore >= 70 ? "#22d3ee" : "#fbbf24" }}>{job.avgScore}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
