"use client";

import React from "react";
import Header from "@/components/layout/Header";
import {
  Target,
  TrendingUp,
  Shield,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
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

const tooltipStyle = {
  background: "#111116",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#f0f0f3",
  fontSize: "12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

export default function AnalyticsPage() {
  return (
    <>
      <Header title="Analytics" subtitle="AI-powered recruitment intelligence" />
      <main className="p-8 space-y-8">
        {/* Top metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Target size={16} />, label: "Avg. Fit Score", value: "84.3%", color: "#8b5cf6" },
            { icon: <TrendingUp size={16} />, label: "Hire Success Rate", value: "91.2%", color: "#34d399" },
            { icon: <Shield size={16} />, label: "Bias-Free Score", value: "94.8%", color: "#22d3ee" },
            { icon: <Award size={16} />, label: "Diversity Index", value: "78.5", color: "#fbbf24" },
          ].map((item) => (
            <div key={item.label} className="card p-5 flex items-center gap-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${item.color}12`, color: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <div className="text-[22px] font-bold text-text-primary">{item.value}</div>
                <div className="text-[11px] text-text-muted">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Hiring Funnel */}
          <div className="card p-6">
            <h2 className="text-[15px] font-semibold text-text-primary mb-1">Hiring Funnel</h2>
            <p className="text-[11px] text-text-muted mb-5">Conversion at each stage</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} barSize={36}>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fill: "#8a8a98", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#55555f", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diversity Scoring */}
          <div className="card p-6">
            <h2 className="text-[15px] font-semibold text-text-primary mb-1">Diversity Scoring</h2>
            <p className="text-[11px] text-text-muted mb-5">Current hiring diversity metrics</p>
            <div className="flex items-center gap-6">
              <div className="h-[220px] w-[220px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diversityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {diversityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 flex-1">
                {diversityData.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-[12px] mb-1.5">
                      <span className="flex items-center gap-2 text-text-secondary">
                        <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-semibold text-text-primary">{item.value}%</span>
                    </div>
                    <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.value}%`, background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Success Prediction */}
          <div className="card p-6">
            <h2 className="text-[15px] font-semibold text-text-primary mb-1">Success Prediction</h2>
            <p className="text-[11px] text-text-muted mb-5">AI predicted vs actual performance</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" tick={{ fill: "#55555f", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#55555f", fontSize: 11 }} axisLine={false} tickLine={false} domain={[70, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "11px", color: "#8a8a98" }} />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Predicted"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#34d399"
                    strokeWidth={2}
                    dot={{ fill: "#34d399", r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Actual"
                    strokeDasharray="5 3"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Accuracy Benchmarks */}
          <div className="card p-6">
            <h2 className="text-[15px] font-semibold text-text-primary mb-1">AI Accuracy</h2>
            <p className="text-[11px] text-text-muted mb-6">Model performance benchmarks</p>
            <div className="space-y-6">
              {accuracyMetrics.map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-text-secondary">{metric.label}</span>
                    <span className="text-[13px] font-bold text-text-primary">{metric.value}%</span>
                  </div>
                  <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${metric.value}%`, background: metric.color }}
                    />
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
