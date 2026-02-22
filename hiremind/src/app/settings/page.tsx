"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Badge from "@/components/ui/Badge";
import {
  Link2,
  Bell,
  Users,
  Shield,
  Key,
  Mail,
  Smartphone,
  Globe,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Plus,
  MoreHorizontal,
  Zap,
} from "lucide-react";

interface Integration {
  name: string;
  description: string;
  connected: boolean;
  icon: string;
}

const integrations: Integration[] = [
  { name: "Greenhouse", description: "ATS Integration", connected: true, icon: "🌿" },
  { name: "Lever", description: "ATS Integration", connected: false, icon: "⚡" },
  { name: "Slack", description: "Notifications", connected: true, icon: "💬" },
  { name: "Google Calendar", description: "Interview Scheduling", connected: true, icon: "📅" },
  { name: "LinkedIn", description: "Candidate Sourcing", connected: false, icon: "💼" },
  { name: "Zoom", description: "Video Interviews", connected: true, icon: "📹" },
];

const team = [
  { name: "Alex Rivera", email: "alex@hiremind.ai", role: "Admin", avatar: "AR" },
  { name: "Lisa Wang", email: "lisa@hiremind.ai", role: "Recruiter", avatar: "LW" },
  { name: "Mike Thompson", email: "mike@hiremind.ai", role: "Hiring Manager", avatar: "MT" },
  { name: "Sarah Kim", email: "sarah@hiremind.ai", role: "Recruiter", avatar: "SK" },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    slack: true,
    newCandidate: true,
    interviewReminder: true,
    biasAlert: true,
    weeklyDigest: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Header title="Settings" subtitle="Manage your platform configuration" />
      <main className="p-8 space-y-6 max-w-5xl">
        {/* Integrations */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Link2 size={16} className="text-accent-violet-light" />
              <h2 className="text-[15px] font-semibold text-text-primary">Integrations</h2>
            </div>
            <button className="btn-primary flex items-center gap-1.5 text-[12px]">
              <Plus size={13} /> Add
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="flex items-center gap-3 p-3.5 rounded-lg bg-bg-primary border border-border-subtle hover:border-border-default transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center text-lg">
                  {integration.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[12px] font-medium text-text-primary">{integration.name}</h3>
                  <p className="text-[10px] text-text-muted">{integration.description}</p>
                </div>
                {integration.connected ? (
                  <Badge label="Connected" variant="emerald" />
                ) : (
                  <button className="text-[11px] text-accent-violet-light hover:text-accent-violet transition-colors font-medium">
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-accent-cyan" />
              <h2 className="text-[15px] font-semibold text-text-primary">Team</h2>
            </div>
            <button className="btn-primary flex items-center gap-1.5 text-[12px]">
              <Plus size={13} /> Invite
            </button>
          </div>
          <div className="space-y-2">
            {team.map((member) => (
              <div
                key={member.email}
                className="flex items-center gap-3 p-3.5 rounded-lg bg-bg-primary border border-border-subtle"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0 bg-accent-violet">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[12px] font-medium text-text-primary">{member.name}</h3>
                  <p className="text-[10px] text-text-muted">{member.email}</p>
                </div>
                <Badge
                  label={member.role}
                  variant={
                    member.role === "Admin" ? "violet"
                    : member.role === "Recruiter" ? "cyan"
                    : "emerald"
                  }
                />
                <button className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-accent-amber" />
            <h2 className="text-[15px] font-semibold text-text-primary">Notifications</h2>
          </div>
          <div className="space-y-0.5">
            {([
              { key: "email" as const, label: "Email", desc: "Receive updates via email", icon: <Mail size={14} /> },
              { key: "push" as const, label: "Push", desc: "Browser push notifications", icon: <Smartphone size={14} /> },
              { key: "slack" as const, label: "Slack", desc: "Get alerts in Slack", icon: <Globe size={14} /> },
              { key: "newCandidate" as const, label: "New Candidates", desc: "When a new candidate applies", icon: <Users size={14} /> },
              { key: "interviewReminder" as const, label: "Reminders", desc: "30 min before interviews", icon: <Bell size={14} /> },
              { key: "biasAlert" as const, label: "Bias Alerts", desc: "AI-detected bias notifications", icon: <Shield size={14} /> },
              { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "Summary of weekly activity", icon: <Mail size={14} /> },
            ]).map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-card-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-bg-elevated flex items-center justify-center text-text-muted">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[12px] font-medium text-text-primary">{item.label}</h3>
                    <p className="text-[10px] text-text-muted">{item.desc}</p>
                  </div>
                </div>
                <button onClick={() => toggleNotification(item.key)} className="transition-colors">
                  {notifications[item.key] ? (
                    <ToggleRight size={24} className="text-accent-violet" />
                  ) : (
                    <ToggleLeft size={24} className="text-text-muted/40" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Key size={16} className="text-accent-emerald" />
            <h2 className="text-[15px] font-semibold text-text-primary">API & Security</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-bg-primary border border-border-subtle">
              <div>
                <h3 className="text-[12px] font-medium text-text-primary">API Key</h3>
                <p className="text-[10px] text-text-muted font-mono mt-0.5">hm_sk_••••••••••••••••Xk7f</p>
              </div>
              <button className="text-[11px] text-accent-violet-light hover:text-accent-violet transition-colors font-medium">
                Regenerate
              </button>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-bg-primary border border-border-subtle">
              <div>
                <h3 className="text-[12px] font-medium text-text-primary">Webhook URL</h3>
                <p className="text-[10px] text-text-muted font-mono mt-0.5">https://api.hiremind.ai/webhooks/v1</p>
              </div>
              <Badge label="Active" variant="emerald" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
