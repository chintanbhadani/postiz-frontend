"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../../context/auth.context";
import { useEffect, useState } from "react";
import { integrationsApi } from "../../../lib/api";
import { useModal } from "../../../context/modal.context";
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
  const { openCreateModal } = useModal();
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
      {/* Spacer for the fixed AppBar so content doesn't go under it */}
      <div style={{ minHeight: "70px" }} />

      {/* ── Create Post Button ── */}
      <div style={{ padding: "0 12px 12px" }}>
        <button
          onClick={openCreateModal}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
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
        </button>
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
                color: isActive ? "var(--secondary)" : "var(--text-secondary)",
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
              <Icon size={16} style={{ color: isActive ? "var(--secondary)" : "var(--text-muted)", flexShrink: 0 }} />
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

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {integrations.length > 0 ? (
            integrations.map((int) => (
              <div
                key={int.id}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0px 12px", borderRadius: 8,
                  cursor: "default", transition: "background 0.12s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--tertiary)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  {/* Channel Avatar + Badge container */}
                  <div style={{
                    position: "relative",
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: 12,
                    flexShrink: 0,
                    backgroundColor: (PLATFORM_COLORS[int.platform] || "#6b7280") + "20",
                    border: "1.5px solid var(--border)",
                    color: PLATFORM_COLORS[int.platform] || "var(--primary)"
                  }}>
                    {int.picture ? (
                      <img src={int.picture} alt={int.name} style={{ width: "100%", height: "100%", borderRadius: 8, objectFit: "cover" }} />
                    ) : (
                      <span>{int.name ? int.name[0].toUpperCase() : "?"}</span>
                    )}
                    
                    {/* Tiny social media platform badge */}
                    {(() => {
                      let badgeBg = "#6b7280";
                      let badgeText = "P";
                      const p = int.platform?.toLowerCase();
                      if (p === "facebook") { badgeBg = "#1877f2"; badgeText = "F"; }
                      else if (p === "linkedin") { badgeBg = "#0077b5"; badgeText = "in"; }
                      else if (p === "instagram") { badgeBg = "#e1306c"; badgeText = "IG"; }
                      else if (p === "twitter" || p === "x") { badgeBg = "#1da1f2"; badgeText = "X"; }
                      else if (p === "youtube") { badgeBg = "#ff0000"; badgeText = "YT"; }
                      else if (p === "tiktok") { badgeBg = "#010101"; badgeText = "TT"; }

                      return (
                        <div style={{
                          position: "absolute",
                          bottom: 0,
                          right: -4,
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          border: "1.5px solid var(--natural)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          backgroundColor: badgeBg,
                          zIndex: 10
                        }}>
                          {(() => {
                            if (p === "facebook") {
                              return (
                                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                                  <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.9.2-1.2 1-1.2h2V2h-3c-3 0-5 1.5-5 4.5V8z" />
                                </svg>
                              );
                            } else if (p === "linkedin") {
                              return (
                                <svg className="w-2.5 h-2.5 fill-current text-white" viewBox="0 0 24 24">
                                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                </svg>
                              );
                            } else if (p === "instagram") {
                              return (
                                <svg className="w-3.5 h-3.5 stroke-current text-white fill-none" strokeWidth="3" viewBox="0 0 24 24">
                                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                              );
                            } else if (p === "twitter" || p === "x") {
                              return (
                                <svg className="w-3 h-3 fill-current text-white" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                              );
                            } else if (p === "youtube") {
                              return (
                                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                              );
                            } else if (p === "tiktok") {
                              return (
                                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.52-4.06-1.37-.28-.2-.53-.43-.77-.68v6.52c.07 1.8-.4 3.67-1.48 5.14-1.4 1.95-3.8 3.14-6.22 3.14-2.1 0-4.2-.82-5.69-2.29-1.97-1.9-2.77-4.85-2-7.48.58-2.03 2.05-3.87 4.07-4.73.96-.41 2.02-.6 3.07-.58v4.06c-1-.07-2.05.28-2.75 1.02-.75.76-.94 1.95-.57 2.92.35.96 1.34 1.66 2.37 1.6 1.25.03 2.36-.88 2.53-2.12.02-.37.01-.74.01-1.12V.02z"/>
                                </svg>
                              );
                            }
                            return <span style={{ fontSize: 7, fontWeight: 900 }}>{badgeText}</span>;
                          })()}
                        </div>
                      );
                    })()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-inter)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                  padding: "0px 12px", borderRadius: 8, opacity: 0.45,
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
            padding: "0px 12px", borderRadius: 9,
            height: "36px",
            fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 700,
            color: "var(--secondary)", textDecoration: "none",
            border: "1px dashed var(--secondary)",
            background: "var(--tertiary)",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--secondary-dim)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--secondary)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "var(--tertiary)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--secondary)";
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
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
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
