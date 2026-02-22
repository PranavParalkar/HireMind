"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Badge from "@/components/ui/Badge";
import {
  Star,
  Sparkles,
  CalendarCheck,
  Video,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { interviews } from "@/lib/mockData";

const typeColors: Record<string, "violet" | "cyan" | "emerald" | "amber"> = {
  technical: "cyan",
  behavioral: "violet",
  cultural: "emerald",
  final: "amber",
};

const ratingData = [
  { name: "Technical", score: 4.2 },
  { name: "Communication", score: 4.5 },
  { name: "Problem Solving", score: 3.9 },
  { name: "Cultural Fit", score: 4.6 },
  { name: "Leadership", score: 3.7 },
];

export default function InterviewsPage() {
  const scheduled = interviews.filter((i) => i.status === "scheduled");
  const completed = interviews.filter((i) => i.status === "completed");

  return (
    <>
      <Header title="Interviews" subtitle={`${interviews.length} total interviews`} />
      <main className="p-8 space-y-8">
        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-accent-blue/10 flex items-center justify-center">
              <CalendarCheck size={16} className="text-accent-blue" />
            </div>
            <div>
              <div className="text-[22px] font-bold text-text-primary">{scheduled.length}</div>
              <div className="text-[11px] text-text-muted">Upcoming</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-accent-emerald/10 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-accent-emerald" />
            </div>
            <div>
              <div className="text-[22px] font-bold text-text-primary">{completed.length}</div>
              <div className="text-[11px] text-text-muted">Completed</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-accent-amber/10 flex items-center justify-center">
              <Star size={16} className="text-accent-amber" />
            </div>
            <div>
              <div className="text-[22px] font-bold text-text-primary">
                {completed.length > 0
                  ? (completed.reduce((sum, i) => sum + (i.rating || 0), 0) / completed.length).toFixed(1)
                  : "—"}
              </div>
              <div className="text-[11px] text-text-muted">Avg. Rating</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interview Schedule */}
          <div className="lg:col-span-2 space-y-4">
            {/* Upcoming */}
            <div className="card p-6">
              <h2 className="text-[15px] font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Video size={16} className="text-accent-violet-light" />
                Upcoming Interviews
              </h2>
              <div className="space-y-2.5">
                {scheduled.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center gap-4 p-3.5 rounded-lg bg-bg-primary border border-border-subtle hover:border-border-default transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0 bg-accent-violet">
                      {interview.candidateAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-medium text-text-primary">{interview.candidateName}</h3>
                      <p className="text-[11px] text-text-muted">{interview.role}</p>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-[12px] text-text-primary font-medium">{interview.date.split("-").slice(1).join("/")}</p>
                      <p className="text-[10px] text-text-muted">{interview.time}</p>
                    </div>
                    <Badge label={interview.type} variant={typeColors[interview.type]} />
                  </div>
                ))}
              </div>
            </div>

            {/* Completed with AI Insights */}
            <div className="card p-6">
              <h2 className="text-[15px] font-semibold text-text-primary mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-accent-cyan" />
                AI Interview Insights
              </h2>
              <div className="space-y-3">
                {completed.map((interview) => (
                  <div key={interview.id} className="p-4 rounded-lg bg-bg-primary border border-border-subtle">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0 bg-accent-emerald">
                        {interview.candidateAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-medium text-text-primary">{interview.candidateName}</h3>
                        <p className="text-[10px] text-text-muted">{interview.role} · {interview.date.split("-").slice(1).join("/")}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < Math.floor(interview.rating || 0)
                                ? "text-accent-amber fill-accent-amber"
                                : "text-text-muted/30"
                            }
                          />
                        ))}
                        <span className="text-[12px] font-bold text-text-primary ml-1.5">{interview.rating}</span>
                      </div>
                    </div>
                    {interview.aiInsight && (
                      <div className="flex gap-2 p-3 rounded-md bg-accent-violet-dim border border-accent-violet/8">
                        <Sparkles size={13} className="text-accent-violet-light shrink-0 mt-0.5" />
                        <p className="text-[11px] text-text-secondary leading-relaxed">{interview.aiInsight}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Feedback Analytics */}
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="text-[15px] font-semibold text-text-primary mb-1">Feedback Analytics</h2>
              <p className="text-[11px] text-text-muted mb-5">Average scores by category</p>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingData} layout="vertical" barSize={10}>
                    <CartesianGrid stroke="rgba(255,255,255,0.03)" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 5]}
                      tick={{ fill: "#55555f", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#8a8a98", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#111116",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        color: "#f0f0f3",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-[13px] font-semibold text-text-primary mb-4">Interview Types</h2>
              <div className="space-y-3">
                {(["technical", "behavioral", "cultural", "final"] as const).map((type) => {
                  const count = interviews.filter((i) => i.type === type).length;
                  const percentage = (count / interviews.length) * 100;
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-text-secondary capitalize">{type}</span>
                        <span className="font-medium text-text-primary">{count}</span>
                      </div>
                      <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            background:
                              type === "technical" ? "#22d3ee"
                              : type === "behavioral" ? "#8b5cf6"
                              : type === "cultural" ? "#34d399"
                              : "#fbbf24",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
