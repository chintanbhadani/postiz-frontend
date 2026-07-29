"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../../context/auth.context";
import { Users, Building, CreditCard, Receipt, FileText, ArrowLeft, Shield, LayoutDashboard } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (pathname.startsWith("/admin/login")) {
        if (user?.globalRole === "ADMIN") {
          router.push("/admin/users");
        }
      } else {
        if (user?.globalRole !== "ADMIN") {
          router.push("/admin/login");
        }
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) return null;

  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  if (user?.globalRole !== "ADMIN") return null;

  const tabs = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Organizations", href: "/admin/organizations", icon: Building },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { name: "Payments", href: "/admin/payments", icon: Receipt },
    { name: "Global Posts", href: "/admin/posts", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Side Sidebar */}
      <div className="w-[280px] bg-white border-r border-[var(--border)] flex flex-col shrink-0">
        <div className="h-[70px] flex items-center px-6 border-b border-[var(--border)]">
          <Shield className="text-[var(--primary)] mr-3" size={24} />
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
            Management
          </div>
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? "bg-purple-50 text-[var(--primary)]" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-[var(--primary)]" : "text-gray-400"} />
                {tab.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[var(--border)]">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-400" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50/50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
