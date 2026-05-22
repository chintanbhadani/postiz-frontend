"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../../context/auth.context";
import { useEffect, useState } from "react";
import { integrationsApi } from "../../../lib/api";
import { SquarePen as PenSquare, Calendar, Users, Plus, LogOut, Link2 } from "lucide-react";

const FacebookIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Menu() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [integrations, setIntegrations] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      integrationsApi.list()
        .then((res) => setIntegrations(res.data))
        .catch(() => {});
    }
  }, [user]);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <FacebookIcon size={16} className="text-[#1877f2]" />;
      case "twitter":
      case "x":
        return <TwitterIcon size={16} className="text-[#1da1f2]" />;
      case "linkedin":
        return <LinkedinIcon size={16} className="text-[#0077b5]" />;
      default:
        return <Link2 size={16} className="text-gray-400" />;
    }
  };

  const navItems = [
    { href: "/create", label: "Create", icon: PenSquare },
    { href: "/", label: "Publish", icon: Calendar },
    { href: "#", label: "Community", icon: Users },
  ];

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full bg-[rgba(15,23,42,0.55)] backdrop-blur-[16px] border-r border-white/[0.05] text-gray-100">
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 bg-[#6366f1] rounded-lg transform -rotate-6 opacity-60 blur-[2px]"></div>
            <div className="absolute inset-0 bg-[#6366f1] rounded-lg transform rotate-2 opacity-80"></div>
            <div className="absolute inset-0 bg-[#6366f1] rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
              <span className="text-white text-sm font-black">P</span>
            </div>
          </div>
          <span className="text-white font-black text-xl tracking-tight">Postiz</span>
        </Link>
      </div>

      {/* Create Post Button */}
      <div className="px-4 py-2">
        <Link
          href="/create"
          className="w-full py-2.5 bg-[#6366f1] hover:bg-[#5558e6] text-white font-bold rounded-full text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.35)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={3} />
          <span>New</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[rgba(99,102,241,0.1)] text-white border border-[rgba(99,102,241,0.2)]"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#6366f1] rounded-r-full" />
              )}
              <Icon size={18} className={isActive ? "text-[#6366f1]" : "text-gray-500"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Connect Channels Section */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto border-t border-white/[0.05] px-3 py-4">
        <div className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
          Connect channels
        </div>

        <div className="space-y-1">
          {integrations.length > 0 ? (
            integrations.map((int) => (
              <div
                key={int.id}
                className="flex items-center justify-between px-4 py-2 text-sm text-gray-300 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getPlatformIcon(int.platform)}
                  <span className="truncate font-semibold text-gray-200">{int.name}</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 rounded-xl opacity-50">
                <div className="flex items-center gap-3">
                  <FacebookIcon size={16} />
                  <span>Facebook</span>
                </div>
                <span className="text-[10px] text-gray-600 font-medium italic">Offline</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 rounded-xl opacity-50">
                <div className="flex items-center gap-3">
                  <TwitterIcon size={16} />
                  <span>Twitter / X</span>
                </div>
                <span className="text-[10px] text-gray-600 font-medium italic">Offline</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 rounded-xl opacity-50">
                <div className="flex items-center gap-3">
                  <LinkedinIcon size={16} />
                  <span>LinkedIn</span>
                </div>
                <span className="text-[10px] text-gray-600 font-medium italic">Offline</span>
              </div>
            </>
          )}
        </div>

        <Link
          href="/channels"
          className="flex items-center gap-2 px-4 py-2.5 mt-2 text-xs text-[#6366f1] hover:text-[#818cf8] font-bold hover:bg-[rgba(99,102,241,0.05)] rounded-xl transition-colors"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>More channels</span>
        </Link>
      </div>

      {/* Footer User Card */}
      <div className="p-4 border-t border-white/[0.05] bg-[rgba(15,23,42,0.3)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[rgba(99,102,241,0.15)] text-[#6366f1] flex items-center justify-center font-bold text-sm border border-[rgba(99,102,241,0.2)] flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">{user?.name || "User"}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-gray-500 font-medium truncate max-w-[80px]">{user?.organizationName || "My Org"}</span>
              <span className="px-1 py-0.2 bg-[rgba(99,102,241,0.1)] text-[#818cf8] text-[8px] font-extrabold rounded-sm uppercase tracking-wider border border-[rgba(99,102,241,0.15)]">Free</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full py-1.5 px-3 text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-[rgba(239,68,68,0.05)] rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/[0.05] bg-white/[0.02]"
        >
          <LogOut size={12} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
