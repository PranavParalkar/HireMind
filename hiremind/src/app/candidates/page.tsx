"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Badge from "@/components/ui/Badge";
import ScoreRing from "@/components/ui/ScoreRing";
import { Search, Filter, SlidersHorizontal, FileText, Brain, ChevronDown } from "lucide-react";
import { candidates } from "@/lib/mockData";

const statusColors: Record<string, "violet" | "cyan" | "emerald" | "amber" | "rose" | "blue"> = {
  new: "blue",
  screening: "amber",
  interview: "violet",
  offer: "cyan",
  hired: "emerald",
  rejected: "rose",
};

const skillVariants: ("violet" | "cyan" | "emerald" | "amber" | "blue")[] = [
  "violet", "cyan", "emerald", "amber", "blue",
];

export default function CandidatesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"fitScore" | "resumeScore" | "name">("fitScore");

  const filtered = candidates
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
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
      <main className="p-8 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name, role, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-lg bg-bg-card border border-border-default text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet/30 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-7 pr-7 py-2 rounded-lg bg-bg-card border border-border-default text-[13px] text-text-secondary focus:outline-none focus:border-accent-violet/30 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
            <div className="relative">
              <SlidersHorizontal size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "fitScore" | "resumeScore" | "name")}
                className="appearance-none pl-7 pr-7 py-2 rounded-lg bg-bg-card border border-border-default text-[13px] text-text-secondary focus:outline-none focus:border-accent-violet/30 cursor-pointer"
              >
                <option value="fitScore">Sort: Fit Score</option>
                <option value="resumeScore">Sort: Resume Score</option>
                <option value="name">Sort: Name</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table-style candidate list */}
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_200px_120px_80px_80px] gap-4 px-6 py-3 border-b border-border-subtle text-[11px] text-text-muted uppercase tracking-wider font-medium">
            <span>Candidate</span>
            <span className="hidden md:block">Skills</span>
            <span>Status</span>
            <span>Resume</span>
            <span className="text-right">Fit</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border-subtle">
            {filtered.map((candidate) => (
              <div
                key={candidate.id}
                className="grid grid-cols-[1fr_200px_120px_80px_80px] gap-4 items-center px-6 py-4 hover:bg-bg-card-hover transition-colors cursor-pointer"
              >
                {/* Candidate */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                    style={{
                      background:
                        candidate.fitScore >= 90
                          ? "#8b5cf6"
                          : candidate.fitScore >= 80
                          ? "#22d3ee"
                          : "#60a5fa",
                    }}
                  >
                    {candidate.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-text-primary truncate">{candidate.name}</span>
                      {candidate.biasFlag && <Badge label="Bias" variant="amber" />}
                    </div>
                    <p className="text-[11px] text-text-muted truncate">{candidate.role} · {candidate.experience}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="hidden md:flex items-center gap-1 flex-wrap">
                  {candidate.skills.slice(0, 2).map((skill, i) => (
                    <Badge key={skill} label={skill} variant={skillVariants[i % skillVariants.length]} />
                  ))}
                  {candidate.skills.length > 2 && (
                    <span className="text-[10px] text-text-muted">+{candidate.skills.length - 2}</span>
                  )}
                </div>

                {/* Status */}
                <Badge label={candidate.status} variant={statusColors[candidate.status]} size="md" />

                {/* Resume */}
                <span className="text-[13px] font-medium text-text-secondary">{candidate.resumeScore}</span>

                {/* Fit Score */}
                <div className="text-right">
                  <span
                    className="text-[15px] font-bold"
                    style={{
                      color:
                        candidate.fitScore >= 90
                          ? "#34d399"
                          : candidate.fitScore >= 80
                          ? "#22d3ee"
                          : candidate.fitScore >= 70
                          ? "#fbbf24"
                          : "#fb7185",
                    }}
                  >
                    {candidate.fitScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted text-[13px]">No candidates match your filters.</p>
          </div>
        )}
      </main>
    </>
  );
}
