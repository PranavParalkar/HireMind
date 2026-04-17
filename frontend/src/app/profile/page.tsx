"use client";

import React from "react";
import Header from "@/components/layout/Header";
import { Camera, MapPin, Briefcase, Building2, Mail } from "lucide-react";

export default function ProfilePage() {
  return (
    <>
      <Header title="Profile" subtitle="Manage your personal information" />
      <main style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24, maxWidth: 800 }}>

        {/* Avatar Section */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 16,
            padding: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "var(--accent-violet)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                CB
              </div>
              <button
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--bg-elevated)",
                  border: "2px solid var(--bg-card)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                }}
              >
                <Camera size={12} />
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Carter Bergson
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Briefcase size={12} /> Hiring Manager</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Building2 size={12} /> TechCorp Inc.</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> San Francisco, CA</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
                <span style={{ fontSize: 11, color: "#34d399", fontWeight: 600 }}>Premium</span>
              </div>
            </div>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Change Avatar
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 16,
            padding: 28,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
            Personal Information
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Full Name", value: "Carter Bergson" },
              { label: "Email", value: "carter@hiremind.com" },
              { label: "Role", value: "Hiring Manager" },
              { label: "Department", value: "Engineering" },
              { label: "Company", value: "TechCorp Inc." },
              { label: "Location", value: "San Francisco, CA" },
            ].map((f) => (
              <div key={f.label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                  {f.label}
                </label>
                <input
                  type="text"
                  defaultValue={f.value}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: 13,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--accent-violet)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border-color)"; }}
                />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
              Bio
            </label>
            <textarea
              defaultValue="Experienced hiring manager focused on building diverse, high-performing engineering teams."
              rows={3}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: 13,
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--accent-violet)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border-color)"; }}
            />
          </div>
          <button
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              background: "var(--accent-violet)",
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#7c4fe0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent-violet)"; }}
          >
            Save Changes
          </button>
        </div>

        {/* Contact & Social */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 16,
            padding: 28,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
            Contact & Social
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Phone", value: "+1 (415) 555-0172" },
              { label: "LinkedIn", value: "linkedin.com/in/carterbergson" },
              { label: "Slack", value: "@carter.bergson" },
              { label: "Timezone", value: "Pacific Time (UTC-8)" },
            ].map((f) => (
              <div key={f.label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                  {f.label}
                </label>
                <input
                  type="text"
                  defaultValue={f.value}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: 13,
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--accent-violet)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border-color)"; }}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
