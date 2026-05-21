"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/auth.context";
import { useEffect, useState } from "react";
import { integrationsApi } from "../../lib/api";
import { 
  PenSquare, 
  Calendar, 
  Users, 
  Plus, 
  LogOut, 
  Link2,
  Settings
} from "lucide-react";

const FacebookIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [integrations, setIntegrations] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      integrationsApi.list()
        .then((res) => {
          setIntegrations(res.data);
        })
        .catch(() => {});
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2e7d32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

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

  return (
    <div className="min-h-screen bg-[#F9F9FB] flex text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
        
        {/* Brand Header */}
        <div className="p-6 pb-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-7 h-7 flex-shrink-0">
              <div className="absolute inset-0 bg-[#A3E695] rounded-lg transform -rotate-6"></div>
              <div className="absolute inset-0 bg-[#8CD57E] rounded-lg transform rotate-3 opacity-90"></div>
              <div className="absolute inset-0 bg-[#2e7d32] rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-black">P</span>
              </div>
            </div>
            <span className="text-gray-900 font-black text-xl tracking-tight">Postiz</span>
          </Link>
        </div>

        {/* "+ New" pill button */}
        <div className="px-4 py-2">
          <Link 
            href="/create" 
            className="w-full py-2.5 bg-[#A3E695] hover:bg-[#8CD57E] text-black font-bold rounded-full text-sm flex items-center justify-center gap-2 border border-black/5 transition-all shadow-sm active:scale-98"
          >
            <Plus size={16} strokeWidth={3} />
            <span>New</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Check active state. Home page is "/" which represents Publish.
            const isActive = pathname === item.href || (item.href === "/" && pathname === "");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} className={isActive ? "text-gray-900" : "text-gray-400"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Connect Channels Section */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto border-t border-gray-100 px-3 py-4">
          <div className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Connect channels
          </div>
          
          <div className="space-y-1">
            {integrations.length > 0 ? (
              integrations.map((int) => (
                <div 
                  key={int.id} 
                  className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getPlatformIcon(int.platform)}
                    <span className="truncate font-semibold text-gray-800">{int.name}</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-400 rounded-lg opacity-60">
                  <div className="flex items-center gap-3">
                    <FacebookIcon size={16} />
                    <span>Facebook</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium italic">Disconnected</span>
                </div>
                <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-400 rounded-lg opacity-60">
                  <div className="flex items-center gap-3">
                    <TwitterIcon size={16} />
                    <span>Twitter / X</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium italic">Disconnected</span>
                </div>
                <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-400 rounded-lg opacity-60">
                  <div className="flex items-center gap-3">
                    <LinkedinIcon size={16} />
                    <span>LinkedIn</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium italic">Disconnected</span>
                </div>
              </>
            )}
          </div>

          <Link 
            href="/channels"
            className="flex items-center gap-2 px-4 py-2.5 mt-2 text-xs text-[#2e7d32] hover:text-[#1e4e17] font-bold hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>More channels</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#2e7d32] flex items-center justify-center font-bold text-sm border border-[#C8E6C9] flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-xs font-bold truncate">{user?.name || "User"}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-gray-500 font-medium truncate max-w-[80px]">{user?.organizationName || "My Org"}</span>
                <span className="px-1 py-0.2 bg-gray-200 text-gray-700 text-[8px] font-extrabold rounded-sm uppercase tracking-wider">Free Plan</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full py-1.5 px-3 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-200/60 bg-white"
          >
            <LogOut size={12} />
            <span>Sign out</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-[#F9F9FB] min-h-screen">
        {children}
      </main>

    </div>
  );
}