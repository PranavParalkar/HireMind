"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Badge from "@/components/ui/Badge";
import {
  MapPin,
  Clock,
  Users,
  Plus,
  MoreHorizontal,
  Briefcase,
  ArrowUpRight,
} from "lucide-react";
import { jobs } from "@/lib/mockData";

const typeVariants: Record<string, "violet" | "cyan" | "emerald" | "amber"> = {
  "full-time": "emerald",
  "part-time": "amber",
  "contract": "cyan",
  "remote": "violet",
};

const statusStyles: Record<string, { dot: string; text: string }> = {
  active: { dot: "bg-accent-emerald", text: "text-accent-emerald" },
  paused: { dot: "bg-accent-amber", text: "text-accent-amber" },
  closed: { dot: "bg-text-muted", text: "text-text-muted" },
};

export default function JobsPage() {
  return (
    <>
      <Header title="Jobs" subtitle={`${jobs.length} job postings`} />
      <main className="p-8 space-y-8">
        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Active Jobs", value: jobs.filter((j) => j.status === "active").length, color: "#34d399" },
            { label: "Total Applicants", value: jobs.reduce((sum, j) => sum + j.applicants, 0), color: "#22d3ee" },
            { label: "Avg. Score", value: Math.round(jobs.reduce((sum, j) => sum + j.avgScore, 0) / jobs.length), color: "#8b5cf6" },
          ].map((stat) => (
            <div key={stat.label} className="card p-5 flex items-center gap-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}12`, color: stat.color }}
              >
                <Briefcase size={16} />
              </div>
              <div>
                <div className="text-[22px] font-bold text-text-primary">{stat.value}</div>
                <div className="text-[11px] text-text-muted">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
          {/* New Job Card */}
          <button className="card p-6 flex flex-col items-center justify-center gap-3 border-dashed border-border-default hover:border-border-hover transition-all min-h-[220px] group">
            <div className="w-12 h-12 rounded-xl bg-accent-violet-dim flex items-center justify-center group-hover:bg-accent-violet/15 transition-colors">
              <Plus size={20} className="text-accent-violet-light" />
            </div>
            <span className="text-[13px] font-medium text-text-muted group-hover:text-text-secondary transition-colors">
              Create New Job
            </span>
          </button>

          {jobs.map((job) => {
            const status = statusStyles[job.status];
            return (
              <div key={job.id} className="card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex items-center gap-1.5 text-[11px] font-medium ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${job.status === "active" ? "pulse-dot" : ""}`} />
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </div>
                    <button className="w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                  <h3 className="text-[14px] font-semibold text-text-primary mb-0.5">{job.title}</h3>
                  <p className="text-[11px] text-text-muted mb-3">{job.department}</p>
                  <div className="flex items-center gap-3 text-[11px] text-text-muted mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {job.location}
                    </span>
                    <Badge label={job.type} variant={typeVariants[job.type]} />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.skills.map((skill) => (
                      <Badge key={skill} label={skill} variant="default" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3.5 border-t border-border-subtle">
                  <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                    <Users size={12} />
                    <span><span className="font-semibold text-text-primary">{job.applicants}</span> applicants</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-text-muted">Avg</span>
                    <span
                      className="font-bold text-[13px]"
                      style={{ color: job.avgScore >= 80 ? "#34d399" : job.avgScore >= 70 ? "#22d3ee" : "#fbbf24" }}
                    >
                      {job.avgScore}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
