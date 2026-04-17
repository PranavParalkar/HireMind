"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Video,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
  HelpCircle,
  LogOut,
} from "lucide-react";

const mainNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/interviews", label: "Interviews", icon: Video },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const otherNav = [
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 ${
        collapsed ? "w-[76px]" : "w-[270px]"
      }`}
      style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      {/* Logo */}
      <div
        style={{ padding: collapsed ? "28px 16px 32px" : "28px 24px 32px", cursor: "pointer" }}
        onClick={onToggle}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: "var(--accent-violet)",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.25)",
            }}
          >
            <Sparkles size={20} color="#fff" />
          </div>
          {!collapsed && (
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                HireMind
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                Talent Intelligence
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div
        style={{
          margin: collapsed ? "0 12px 20px" : "0 20px 20px",
          borderTop: "1px solid var(--border-color)",
        }}
      />

      {/* Main Menu Label */}
      {!collapsed && (
        <div
          style={{
            padding: "0 28px",
            marginBottom: 12,
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
          }}
        >
          Main Menu
        </div>
      )}

      {/* Main Navigation */}
      <nav
        style={{
          padding: collapsed ? "0 10px" : "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: collapsed ? "14px 16px" : "14px 16px",
                borderRadius: 14,
                fontSize: 15,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "var(--bg-elevated)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s ease",
                position: "relative",
              }}
              title={collapsed ? item.label : undefined}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--bg-card)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <Icon
                size={22}
                style={{
                  flexShrink: 0,
                  color: isActive ? "var(--accent-violet-light)" : undefined,
                }}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Upgrade CTA */}
      {!collapsed && (
        <div style={{ padding: "0 16px", marginBottom: 16 }}>
          <div
            style={{
              padding: "20px 18px",
              borderRadius: 16,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              Upgrade to Pro
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                lineHeight: 1.5,
                marginBottom: 14,
              }}
            >
              Get 1 month free and unlock all features
            </div>
            <button
              style={{
                width: "100%",
                padding: "10px 0",
                borderRadius: 10,
                border: "none",
                background: "var(--accent-violet)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Other section */}
      {!collapsed && (
        <div
          style={{
            margin: "0 20px 12px",
            borderTop: "1px solid var(--border-color)",
            paddingTop: 16,
          }}
        >
          <div
            style={{
              padding: "0 8px",
              marginBottom: 8,
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
            }}
          >
            Other
          </div>
        </div>
      )}
      <nav
        style={{
          padding: collapsed ? "0 10px" : "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 8,
        }}
      >
        {otherNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 16px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "var(--bg-elevated)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              title={collapsed ? item.label : undefined}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--bg-card)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div
        style={{
          paddingTop: 16,
          paddingRight: collapsed ? 12 : 16,
          paddingBottom: 16,
          paddingLeft: collapsed ? 12 : 16,
          borderTop: "1px solid var(--border-color)",
          marginLeft: collapsed ? 8 : 16,
          marginRight: collapsed ? 8 : 16,
        }}
      >
        <Link
          href="/profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "var(--accent-violet)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              CB
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#34d399",
                border: "2px solid var(--bg-secondary)",
              }}
            />
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Carter Bergson
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
                Premium
              </div>
            </div>
          )}
          {!collapsed && (
            <ChevronRight size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          )}
        </Link>
      </div>
    </aside>
  );
}
