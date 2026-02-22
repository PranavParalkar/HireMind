"use client";

import React from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import ScoreRing from "@/components/ui/ScoreRing";
import {
  Briefcase,
  Users,
  CalendarCheck,
  UserCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { candidates, interviews, analyticsData, funnelData, kpiStats } from "@/lib/mockData";

const statusColors: Record<string, string> = {
  new: "blue",
  screening: "amber",
  interview: "violet",
  offer: "cyan",
  hired: "emerald",
  rejected: "rose",
};

export default function DashboardPage() {
  const topCandidates = candidates
    .filter((c) => c.status !== "rejected")
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 5);

  const upcomingInterviews = interviews
    .filter((i) => i.status === "scheduled")
    .slice(0, 4);

  const biasCandidates = candidates.filter((c) => c.biasFlag);

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's your recruitment overview."
      />
      <main className="p-8 space-y-8">
        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          <StatCard
            title="Active Jobs"
            value={kpiStats.activeJobs}
            trend={kpiStats.activeJobsTrend}
            icon={<Briefcase size={18} />}
            color="#8b5cf6"
            delay={0.03}
          />
          <StatCard
            title="Total Candidates"
            value={kpiStats.totalCandidates}
            trend={kpiStats.candidatesTrend}
            icon={<Users size={18} />}
            color="#22d3ee"
            delay={0.06}
          />
          <StatCard
            title="Scheduled Interviews"
            value={kpiStats.scheduledInterviews}
            trend={kpiStats.interviewsTrend}
            icon={<CalendarCheck size={18} />}
            color="#fbbf24"
            delay={0.09}
          />
          <StatCard
            title="Hires This Month"
            value={kpiStats.hiresThisMonth}
            trend={kpiStats.hiresTrend}
            icon={<UserCheck size={18} />}
            color="#34d399"
            delay={0.12}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pipeline Chart */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[15px] font-semibold text-text-primary">Candidate Pipeline</h2>
                <p className="text-[11px] text-text-muted mt-1">Last 6 months breakdown</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-violet" /> Applications
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-cyan" /> Interviewed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-emerald" /> Hired
                </span>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="gradViolet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#55555f", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#55555f", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#111116",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      color: "#f0f0f3",
                      fontSize: "12px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="#8b5cf6" fill="url(#gradViolet)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="interviewed" stroke="#22d3ee" fill="url(#gradCyan)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="hired" stroke="#34d399" fill="url(#gradEmerald)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hiring Funnel */}
          <div className="card p-6">
            <h2 className="text-[15px] font-semibold text-text-primary mb-1">Hiring Funnel</h2>
            <p className="text-[11px] text-text-muted mb-6">Current cycle conversion</p>
            <div className="space-y-5">
              {funnelData.map((item, index) => {
                const widthPercent = (item.count / funnelData[0].count) * 100;
                const prevCount = index > 0 ? funnelData[index - 1].count : null;
                const convRate = prevCount ? ((item.count / prevCount) * 100).toFixed(0) : null;
                return (
                  <div key={item.stage}>
                    <div className="flex items-center justify-between text-[12px] mb-2">
                      <span className="text-text-secondary">{item.stage}</span>
                      <div className="flex items-center gap-2">
                        {convRate && (
                          <span className="text-text-muted text-[10px]">{convRate}%</span>
                        )}
                        <span className="font-semibold text-text-primary">{item.count.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${widthPercent}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top Candidates */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[15px] font-semibold text-text-primary">Top Candidates</h2>
                <p className="text-[11px] text-text-muted mt-1">Ranked by AI fit score</p>
              </div>
              <button className="flex items-center gap-1.5 text-[12px] text-text-muted hover:text-text-secondary transition-colors">
                View all <ArrowUpRight size={12} />
              </button>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[32px_1fr_180px_100px_60px] gap-4 px-3 pb-3 border-b border-border-subtle text-[11px] text-text-muted uppercase tracking-wider font-medium">
              <span>#</span>
              <span>Candidate</span>
              <span className="hidden md:block">Skills</span>
              <span>Status</span>
              <span className="text-right">Score</span>
            </div>

            <div className="divide-y divide-border-subtle">
              {topCandidates.map((candidate, i) => (
                <div
                  key={candidate.id}
                  className="grid grid-cols-[32px_1fr_180px_100px_60px] gap-4 items-center px-3 py-3.5 hover:bg-bg-card-hover transition-colors rounded-lg cursor-pointer"
                >
                  {/* Rank */}
                  <span className="text-[12px] font-medium text-text-muted">
                    {i + 1}
                  </span>
                  {/* Candidate */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                      style={{
                        background: i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#22d3ee" : "#34d399",
                      }}
                    >
                      {candidate.avatar}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[13px] font-medium text-text-primary truncate block">
                        {candidate.name}
                      </span>
                      <span className="text-[11px] text-text-muted truncate block">{candidate.role}</span>
                    </div>
                  </div>
                  {/* Skills */}
                  <div className="hidden md:flex items-center gap-1">
                    {candidate.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} label={skill} variant="default" />
                    ))}
                    {candidate.skills.length > 2 && (
                      <span className="text-[11px] text-text-muted">+{candidate.skills.length - 2}</span>
                    )}
                  </div>
                  {/* Status */}
                  <Badge
                    label={candidate.status}
                    variant={statusColors[candidate.status] as "violet" | "cyan" | "emerald" | "amber" | "rose" | "blue"}
                  />
                  {/* Score */}
                  <div className="text-right">
                    <span
                      className="text-[14px] font-bold"
                      style={{
                        color:
                          candidate.fitScore >= 90
                            ? "#34d399"
                            : candidate.fitScore >= 80
                            ? "#22d3ee"
                            : "#fbbf24",
                      }}
                    >
                      {candidate.fitScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Upcoming Interviews */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-semibold text-text-primary">Upcoming</h2>
                <span className="text-[11px] text-text-muted">{upcomingInterviews.length} scheduled</span>
              </div>
              <div className="space-y-2.5">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary border border-border-subtle hover:border-border-default transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0 bg-accent-violet"
                    >
                      {interview.candidateAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-text-primary truncate">
                        {interview.candidateName}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {interview.time} · {interview.date.split("-").slice(1).join("/")}
                      </p>
                    </div>
                    <Badge
                      label={interview.type}
                      variant={
                        interview.type === "technical"
                          ? "cyan"
                          : interview.type === "behavioral"
                          ? "violet"
                          : interview.type === "cultural"
                          ? "emerald"
                          : "amber"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bias Alert */}
            {biasCandidates.length > 0 && (
              <div className="card p-5 border-accent-amber/15">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-accent-amber/10 flex items-center justify-center">
                    <AlertTriangle size={14} className="text-accent-amber" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-text-primary leading-none">Bias Alert</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">AI-detected potential bias</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {biasCandidates.map((c) => (
                    <div key={c.id} className="flex items-start gap-2 p-2.5 rounded-md bg-accent-amber/[0.04]">
                      <Sparkles size={11} className="text-accent-amber shrink-0 mt-0.5" />
                      <span className="text-[11px] text-text-secondary leading-relaxed">
                        <strong className="text-text-primary">{c.name}</strong> — scoring may be
                        affected by language pattern bias.
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
