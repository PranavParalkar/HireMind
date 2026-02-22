"use client";

import React from "react";
import Header from "@/components/layout/Header";
import { Target, TrendingUp, Shield, Award } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { analyticsData, diversityData, funnelData } from "@/lib/mockData";

const accuracyMetrics = [
  { label: "Resume Parsing", value: 96.4, color: "#8b5cf6" },
  { label: "Skill Extraction", value: 93.8, color: "#22d3ee" },
  { label: "Job Fit Prediction", value: 89.2, color: "#34d399" },
  { label: "Success Prediction", value: 87.5, color: "#fbbf24" },
  { label: "Bias Detection", value: 91.7, color: "#fb7185" },
];

const predictionData = [
  { month: "Sep", predicted: 82, actual: 78 },
  { month: "Oct", predicted: 85, actual: 83 },
  { month: "Nov", predicted: 79, actual: 81 },
  { month: "Dec", predicted: 88, actual: 85 },
  { month: "Jan", predicted: 91, actual: 89 },
  { month: "Feb", predicted: 87, actual: 86 },
];

const tt = { background: "#111116", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#f0f0f3", fontSize: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" };

export default function AnalyticsPage() {
  return (
    <>
      <Header title="Analytics" subtitle="AI-powered recruitment intelligence" />
      <main style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Top Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { icon: <Target size={20} />, label: "Avg. Fit Score", value: "84.3%", color: "#8b5cf6" },
            { icon: <TrendingUp size={20} />, label: "Hire Success Rate", value: "91.2%", color: "#34d399" },
            { icon: <Shield size={20} />, label: "Bias-Free Score", value: "94.8%", color: "#22d3ee" },
            { icon: <Award size={20} />, label: "Diversity Index", value: "78.5", color: "#fbbf24" },
          ].map((m) => (
            <div key={m.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: `${m.color}15`, color: m.color, flexShrink: 0 }}>
                {m.icon}
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Hiring Funnel */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Hiring Funnel</h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Conversion at each stage</p>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} barSize={40}>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fill: "#8a8a98", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#55555f", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tt} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {funnelData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diversity */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Diversity Scoring</h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Current hiring diversity metrics</p>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ width: 200, height: 200, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={diversityData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                      {diversityData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tt} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
                {diversityData.map((d) => (
                  <div key={d.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)" }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />{d.name}
                      </span>
                      <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{d.value}%</span>
                    </div>
                    <div style={{ height: 4, background: "var(--bg-elevated)", borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 100, width: `${d.value}%`, background: d.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Success Prediction */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Success Prediction</h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>AI predicted vs actual performance</p>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" tick={{ fill: "#55555f", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#55555f", fontSize: 11 }} axisLine={false} tickLine={false} domain={[70, 100]} />
                  <Tooltip contentStyle={tt} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#8a8a98" }} />
                  <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 4 }} name="Predicted" />
                  <Line type="monotone" dataKey="actual" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399", r: 4 }} strokeDasharray="5 3" name="Actual" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Accuracy */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>AI Accuracy</h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 24 }}>Model performance benchmarks</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {accuracyMetrics.map((m) => (
                <div key={m.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{m.label}</span>
                    <span style={{ fontWeight: 800, color: "var(--text-primary)" }}>{m.value}%</span>
                  </div>
                  <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 100, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 100, width: `${m.value}%`, background: m.color, transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
