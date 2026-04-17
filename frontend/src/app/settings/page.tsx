"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { User, Bell, Shield, Palette, Globe, Key, ChevronRight } from "lucide-react";

const sections = [
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "security", icon: Shield, label: "Security" },
  { id: "appearance", icon: Palette, label: "Appearance" },
  { id: "integrations", icon: Globe, label: "Integrations" },
  { id: "api", icon: Key, label: "API Keys" },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("notifications");

  return (
    <>
      <Header title="Settings" subtitle="Manage your account and preferences" />
      <main style={{ padding: 32, display: "flex", gap: 24 }}>
        {/* Left Nav */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    background: active ? "var(--bg-elevated)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <Icon size={18} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content */}
        <div style={{ flex: 1 }}>

          {/* Notifications */}
          {activeSection === "notifications" && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 16, padding: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 24 }}>Notification Preferences</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { label: "New candidate applications", desc: "Get notified when a new candidate applies", on: true },
                  { label: "Interview reminders", desc: "Receive reminders before scheduled interviews", on: true },
                  { label: "Bias detection alerts", desc: "AI-detected potential bias in screening", on: true },
                  { label: "Weekly summary reports", desc: "Get a weekly recruitment digest", on: false },
                  { label: "System updates", desc: "Updates about platform features and changes", on: false },
                ].map((n) => (
                  <div key={n.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{n.label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{n.desc}</div>
                    </div>
                    <div style={{ width: 44, height: 24, borderRadius: 12, background: n.on ? "var(--accent-violet)" : "var(--bg-elevated)", position: "relative", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: n.on ? 23 : 3, transition: "left 0.2s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other sections - simple placeholders */}
          {!["notifications"].includes(activeSection) && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 16, padding: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                {sections.find((s) => s.id === activeSection)?.label}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
                Configure your {sections.find((s) => s.id === activeSection)?.label.toLowerCase()} settings below.
              </p>
              <div style={{ padding: 40, textAlign: "center", borderRadius: 12, background: "var(--bg-primary)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)", fontSize: 13 }}>
                Settings for this section are coming soon.
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
