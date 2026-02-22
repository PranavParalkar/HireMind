"use client";

import React, { useState } from "react";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, Github, Chrome } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login — redirect to dashboard
    router.push("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -300,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Left Panel — Branding */}
      <div
        style={{
          flex: "0 0 480px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-color)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 64 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--accent-violet)",
                boxShadow: "0 0 24px rgba(139, 92, 246, 0.3)",
              }}
            >
              <Sparkles size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                HireMind
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                Talent Intelligence
              </div>
            </div>
          </div>

          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            AI-Powered
            <br />
            <span style={{ color: "var(--accent-violet-light)" }}>Recruitment</span>
            <br />
            Intelligence
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 360,
            }}
          >
            Screen smarter, hire faster. Leverage AI to find the perfect candidates, detect bias, and predict hiring success.
          </p>
        </div>

        {/* Stats */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: 32, marginBottom: 40 }}>
            {[
              { value: "94%", label: "Accuracy" },
              { value: "3.2x", label: "Faster Hiring" },
              { value: "10K+", label: "Candidates" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div
            style={{
              padding: "20px 22px",
              borderRadius: 16,
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 14 }}>
              &ldquo;HireMind reduced our time-to-hire by 60% while improving candidate quality. The AI bias detection alone was a game-changer.&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--accent-emerald)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                SK
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>Sarah Kim</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>VP of Engineering, TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          position: "relative",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: 8,
            }}
          >
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 36 }}>
            {isSignUp
              ? "Start hiring smarter with AI-powered recruitment."
              : "Sign in to continue to your dashboard."}
          </p>

          {/* Social buttons */}
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            <button
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "12px 0",
                borderRadius: 12,
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "var(--bg-card-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.background = "var(--bg-card)"; }}
            >
              <Chrome size={18} />
              Google
            </button>
            <button
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "12px 0",
                borderRadius: 12,
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "var(--bg-card-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.background = "var(--bg-card)"; }}
            >
              <Github size={18} />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Name (signup only) */}
            {isSignUp && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                  Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={16}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      paddingLeft: 42,
                      paddingRight: 16,
                      paddingTop: 13,
                      paddingBottom: 13,
                      borderRadius: 12,
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      fontSize: 14,
                      color: "var(--text-primary)",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent-violet)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border-color)"; }}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: 42,
                    paddingRight: 16,
                    paddingTop: 13,
                    paddingBottom: 13,
                    borderRadius: 12,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    fontSize: 14,
                    color: "var(--text-primary)",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--accent-violet)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border-color)"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 11,
                      color: "var(--accent-violet-light)",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: 42,
                    paddingRight: 48,
                    paddingTop: 13,
                    paddingBottom: 13,
                    borderRadius: 12,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    fontSize: 14,
                    color: "var(--text-primary)",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--accent-violet)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border-color)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "14px 0",
                borderRadius: 12,
                border: "none",
                background: "var(--accent-violet)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                marginTop: 4,
                boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#7c4fe0";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(139, 92, 246, 0.35)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--accent-violet)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(139, 92, 246, 0.2)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Toggle */}
          <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", marginTop: 28 }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-violet-light)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>

          {/* Terms */}
          <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
            By continuing, you agree to HireMind&apos;s{" "}
            <span style={{ color: "var(--text-secondary)", cursor: "pointer" }}>Terms of Service</span>{" "}and{" "}
            <span style={{ color: "var(--text-secondary)", cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
