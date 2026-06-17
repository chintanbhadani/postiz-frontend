"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../../context/auth.context";
import { useEffect, useState } from "react";
import { integrationsApi } from "../../../lib/api";
import {
  PenSquare,
  Calendar,
  Users,
  Plus,
  LogOut,
  Link2,
  BarChart3,
  Settings,
  Zap,
} from "lucide-react";

const FacebookIcon = ({ size = 15 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 15 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 15 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const PLATFORM_COLORS: Record<string, string> = {
  facebook: "#1877f2", twitter: "#1da1f2", x: "#1da1f2", linkedin: "#0077b5",
  instagram: "#e1306c", youtube: "#ff0000", tiktok: "#010101", bluesky: "#0085ff",
};

export default function Menu() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [integrations, setIntegrations] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      integrationsApi.list().then((res) => setIntegrations(res.data)).catch(() => { });
    }
  }, [user]);

  const getPlatformIcon = (platform: string = "") => {
    const p = platform.toLowerCase();
    const color = PLATFORM_COLORS[p] || "var(--secondary)";
    const icons: Record<string, React.ReactElement> = {
      facebook: <FacebookIcon />,
      twitter: <TwitterIcon />,
      x: <TwitterIcon />,
      linkedin: <LinkedinIcon />,
    };
    return (
      <span style={{ color }}>
        {icons[p] || <Link2 size={15} />}
      </span>
    );
  };

  const navItems = [
    { href: "/create", label: "Create", icon: PenSquare },
    { href: "/", label: "Publish", icon: Calendar },
    { href: "#", label: "Analytics", icon: BarChart3 },
    { href: "#", label: "Community", icon: Users },
  ];

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--natural)" }}>

      {/* ── Brand ── */}
      <div style={{ padding: "20px 20px 16px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: "var(--secondary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px var(--shadow-rose)", flexShrink: 0,
          }}>
            <span style={{ color: "var(--btn-primary-text)", fontSize: 16, fontWeight: 900, fontFamily: "var(--font-syne)" }}>P</span>
          </div>
          <div>
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 400, fontSize: 17, color: "var(--primary)", display: "block", lineHeight: 1.2 }}>
              Postilio
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)" }}>
              Social Suite
            </span>
          </div>
        </Link>
      </div>

      {/* ── Create Post Button ── */}
      <div style={{ padding: "0 12px 12px" }}>
        <Link
          href="/create"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            padding: "9px 16px", borderRadius: 10,
            background: "var(--secondary)", color: "var(--btn-primary-text)",
            fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 2px 10px var(--shadow-rose)",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--secondary-light)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px var(--shadow-md)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--secondary)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px var(--shadow-rose)";
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Create Post</span>
        </Link>
      </div>

      {/* ── Nav Items ── */}
      <nav style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href === "/" && pathname === "");
          return (
            <Link
              key={label}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 10,
                fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600,
                textDecoration: "none", position: "relative",
                background: isActive ? "var(--secondary-dim)" : "transparent",
                color: isActive ? "var(--secondary)" : "rgba(13,9,11,0.55)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "var(--tertiary)";
                  (e.currentTarget as HTMLElement).style.color = "var(--primary)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                }
              }}
            >
              {/* Active left indicator */}
              {isActive && (
                <span style={{
                  position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                  width: 3, height: "55%", background: "var(--secondary)",
                  borderRadius: "0 3px 3px 0",
                }} />
              )}
              <Icon size={16} style={{ color: isActive ? "var(--secondary)" : "rgba(13,9,11,0.35)", flexShrink: 0 }} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div style={{ margin: "12px 16px", height: 1, background: "var(--border)" }} />

      {/* ── Connected Channels ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto", padding: "0 8px" }}>
        <div style={{
          padding: "0 12px 8px",
          fontSize: 10, fontWeight: 800,
          fontFamily: "var(--font-inter)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}>
          Connected channels
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {integrations.length > 0 ? (
            integrations.map((int) => (
              <div
                key={int.id}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "7px 12px", borderRadius: 8,
                  cursor: "default", transition: "background 0.12s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--tertiary)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                  {getPlatformIcon(int.platform || int.type)}
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", fontFamily: "var(--font-inter)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {int.name}
                  </span>
                </div>
                {/* Online dot */}
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#66A442", boxShadow: "0 0 0 2px rgba(102,164,66,0.15)", flexShrink: 0 }} />
              </div>
            ))
          ) : (
            // Placeholder disconnected channels
            [
              { Icon: FacebookIcon, label: "Facebook" },
              { Icon: TwitterIcon, label: "Twitter / X" },
              { Icon: LinkedinIcon, label: "LinkedIn" },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "7px 12px", borderRadius: 8, opacity: 0.45,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9, color: "var(--text-muted)" }}>
                  <Icon />
                  <span style={{ fontSize: 12, fontWeight: 500, fontFamily: "var(--font-inter)" }}>{label}</span>
                </div>
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontStyle: "italic", fontFamily: "var(--font-inter)" }}>
                  Connect
                </span>
              </div>
            ))
          )}
        </div>

        {/* Add channel */}
        <Link
          href="/channels"
          style={{
            display: "flex", alignItems: "center", gap: 7,
            margin: "8px 4px 0",
            padding: "7px 12px", borderRadius: 9,
            fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 700,
            color: "var(--secondary)", textDecoration: "none",
            border: "1px dashed var(--shadow-rose)",
            background: "var(--tertiary)",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--secondary-dim)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--tertiary)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--shadow-rose)";
          }}
        >
          <Plus size={13} strokeWidth={2.5} />
          <span>Add channel</span>
        </Link>
      </div>

      {/* ── Upgrade Card ── */}
      <div style={{ margin: "12px 12px 0", padding: "14px", borderRadius: 12, background: "var(--main-background)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--secondary-dim)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Zap size={13} style={{ color: "var(--secondary)" }} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: "var(--primary)", fontFamily: "var(--font-inter)", margin: 0 }}>Go Pro</p>
            <p style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-inter)", margin: 0 }}>Unlimited posts & AI tools</p>
          </div>
        </div>
        <button
          style={{
            width: "100%", padding: "8px 12px", borderRadius: 9,
            background: "var(--secondary)", color: "var(--btn-primary-text)", border: "none",
            fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 2px 8px var(--shadow-rose)",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--secondary-light)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--secondary)"}
        >
          Upgrade Now →
        </button>
      </div>

      {/* ── Footer / User ── */}
      <div style={{ padding: "12px 12px 16px", borderTop: "1px solid var(--border)", marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "var(--secondary)",
            color: "var(--btn-primary-text)", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 900, fontFamily: "var(--font-inter)", flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-inter)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name || "User"}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-inter)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 80 }}>
                {user?.organizationName || "My Org"}
              </span>
              <span style={{
                padding: "1px 6px", borderRadius: 4,
                background: "var(--border)", color: "var(--text-secondary)",
                fontSize: 9, fontWeight: 800, fontFamily: "var(--font-inter)",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                Free
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push("/settings")}
            style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--primary)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
          >
            <Settings size={14} />
          </button>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            padding: "7px 12px", borderRadius: 9,
            fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 600,
            color: "var(--text-secondary)", background: "transparent",
            border: "1px solid var(--border)", cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = "#C71F1F";
            (e.currentTarget as HTMLElement).style.background = "rgba(199,31,31,0.05)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(199,31,31,0.2)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = "rgba(13,9,11,0.45)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          }}
        >
          <LogOut size={13} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
