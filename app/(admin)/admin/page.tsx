"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { Users, Building, FileText, CreditCard } from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/overview");
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading overview...</div>;

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Organizations", value: stats?.totalOrgs || 0, icon: Building, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Global Posts", value: stats?.totalPosts || 0, icon: FileText, color: "text-green-600", bg: "bg-green-50" },
    { title: "Active Subscriptions", value: stats?.activeSubs || 0, icon: CreditCard, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">Platform Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 bg-white">
              <div className={`p-4 rounded-lg ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">{stat.title}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
