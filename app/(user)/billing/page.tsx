"use client";
import { useEffect, useState } from "react";
import { billingApi, integrationsApi, authApi } from "../../../lib/api";

export default function BillingPage() {
  const [integrationsCount, setIntegrationsCount] = useState(0);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedChannels, setSelectedChannels] = useState(1);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  useEffect(() => {
    async function init() {
      try {
        const integrationsRes = await integrationsApi.list();
        setIntegrationsCount(integrationsRes.data.length);
        setSelectedChannels(Math.max(1, integrationsRes.data.length));

        const meRes = await authApi.me();
        const org = meRes.data.organizations?.[0]?.organization;
        if (org) {
          setSubStatus(org.subscriptionStatus);
        }

        const invoicesRes = await billingApi.invoices();
        setInvoices(invoicesRes.data);
      } catch (err) {
        console.error("Failed to load billing details", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSubscribe = async (planType: string) => {
    try {
      const res = await billingApi.checkout(
        window.location.origin + "/billing?success=true",
        window.location.origin + "/billing?cancel=true"
      );
      window.location.href = res.data.url;
    } catch (err) {
      setError("Failed to start checkout. Please try again.");
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await billingApi.portal(window.location.origin + "/billing");
      window.location.href = res.data.url;
    } catch (err) {
      setError("Failed to open billing portal. Make sure you have an active subscription.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-[var(--secondary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isFreePlan = subStatus !== "active";
  
  // Pricing configuration
  const essentialsPriceUnit = billingCycle === "yearly" ? 499 : 599;
  const teamPriceUnit = billingCycle === "yearly" ? 1099 : 1199;

  const totalEssentialsPrice = selectedChannels * essentialsPriceUnit;
  const totalTeamPrice = selectedChannels * teamPriceUnit;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 text-sm">
      {/* Mini Title bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--primary)] tracking-tight">Billing & Plans</h1>
          <p className="text-[var(--text-muted)] text-xs"> workspace limits, plans, and invoices.</p>
        </div>
        {/* {!isFreePlan && (
          <button
            onClick={handleManageBilling}
            className="px-4 py-1.5 bg-[var(--tertiary)] hover:bg-[var(--border)] text-[var(--primary)] font-bold rounded-lg border border-[var(--border)] transition text-xs cursor-pointer"
          >
            Stripe Portal ↗
          </button>
        )} */}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[#f87171] font-medium text-xs">
          {error}
        </div>
      )}

      {/* Modern Compact Header with Selectors */}
      <div className="bg-[var(--natural)] border border-[var(--border)] rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-[var(--primary)]">Flexible Pricing for Everyone</h2>
          <p className="text-[var(--text-muted)] text-xs mt-0.5">
            You're on the <span className="font-semibold text-[var(--secondary)]">Free plan</span> with up to 1 channel. Customize your setup below.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Compact channel up/down selector */}
          <div className="flex items-center bg-[var(--tertiary)] border border-[var(--border)] rounded-lg p-1">
            <button
              onClick={() => setSelectedChannels(prev => Math.max(1, prev - 1))}
              className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--natural)] rounded-md font-bold text-sm transition cursor-pointer"
            >
              −
            </button>
            <span className="px-3 text-xs font-bold text-[var(--primary)] min-w-[75px] text-center select-none">
              {selectedChannels} {selectedChannels === 1 ? "channel" : "channels"}
            </span>
            <button
              onClick={() => setSelectedChannels(prev => prev + 1)}
              className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--natural)] rounded-md font-bold text-sm transition cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Compact Monthly/Yearly toggle */}
          <div className="flex items-center bg-[var(--tertiary)] border border-[var(--border)] rounded-lg p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[var(--natural)] text-[var(--primary)] border border-[var(--border)] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
              }`}
            >
              Pay Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-[#10b981] text-white border border-[#0f9f6e] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--primary)]"
              }`}
            >
              Pay Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Plan Columns - Free, Essentials, Team side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* FREE PLAN */}
        <div className={`bg-[var(--natural)] border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
          isFreePlan ? "border-[var(--secondary)] ring-1 ring-[var(--secondary)]/15" : "border-[var(--border)]"
        }`}>
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[var(--primary)] text-sm">Free</h3>
              {isFreePlan && <span className="bg-[var(--secondary-dim)] text-[var(--secondary)] text-[10px] font-bold px-2 py-0.5 rounded-full">Current</span>}
            </div>
            
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-[var(--primary)]">₹0</span>
                <span className="text-[var(--text-muted)] text-xs ml-1">/ forever</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Connect up to 1 channel</span>
            </div>

            <div className="border-t border-[var(--border)] my-3" />

            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> 10 scheduled posts / channel
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> 1 scheduled thread
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> 100 post drafts / ideas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Basic analytics
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full mt-6 py-2 bg-gray-500/10 text-gray-400 font-semibold rounded-lg text-xs cursor-default transition"
          >
            {isFreePlan ? "Active Plan" : "Downgrade"}
          </button>
        </div>

        {/* ESSENTIALS PLAN */}
        <div className={`bg-[var(--natural)] border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
          !isFreePlan && integrationsCount <= 5 ? "border-[var(--secondary)] ring-1 ring-[var(--secondary)]/15" : "border-[var(--border)]"
        }`}>
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[var(--primary)] text-sm">Essentials</h3>
              {!isFreePlan && <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>}
            </div>

            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-[var(--primary)]">₹{totalEssentialsPrice}</span>
                <span className="text-[var(--text-muted)] text-xs ml-1">/ month</span>
              </div>
              <span className="text-[10px] text-emerald-500 font-medium block mt-0.5">
                ₹{essentialsPriceUnit}/channel {billingCycle === "yearly" && `(Billed yearly, save 17%)`}
              </span>
            </div>

            <div className="border-t border-[var(--border)] my-3" />

            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> **Unlimited** scheduled posts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> **Unlimited** ideas, tags & replies
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> 1 user workspace account
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Advanced analytics & dashboard
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSubscribe("essentials")}
            className="w-full mt-6 py-2 bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white font-bold rounded-lg text-xs transition cursor-pointer"
          >
            Upgrade to Essentials
          </button>
        </div>

        {/* TEAM PLAN */}
        <div className="bg-[var(--natural)] border border-[var(--border)] rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[var(--primary)] text-sm">Team</h3>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-[var(--primary)]">₹{totalTeamPrice}</span>
                <span className="text-[var(--text-muted)] text-xs ml-1">/ month</span>
              </div>
              <span className="text-[10px] text-emerald-500 font-medium block mt-0.5">
                ₹{teamPriceUnit}/channel {billingCycle === "yearly" && `(Billed yearly, save 8%)`}
              </span>
            </div>

            <div className="border-t border-[var(--border)] my-3" />

            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li className="flex items-center gap-2 font-medium">
                <span className="text-emerald-400 font-bold">✓</span> Everything in Essentials, plus:
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> **Unlimited** workspace users
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Team access levels & workflows
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Content approvals
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSubscribe("team")}
            className="w-full mt-6 py-2 bg-[var(--natural)] hover:bg-[var(--tertiary)] border border-[var(--border)] text-[var(--primary)] font-bold rounded-lg text-xs transition cursor-pointer"
          >
            Upgrade to Team
          </button>
        </div>

      </div>

      {/* Invoice Section - Compact and clean */}
      <div className="bg-[var(--natural)] border border-[var(--border)] rounded-xl p-4 shadow-xs">
        <h3 className="font-bold text-[var(--primary)] text-xs mb-3">Billing History</h3>

        {invoices.length === 0 ? (
          <div className="text-center py-4 text-[var(--text-muted)] text-xs">
            No invoices found. Past transactions will show up here after your first payment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] font-medium">
                  <th className="pb-2 pr-4 font-semibold">Invoice ID</th>
                  <th className="pb-2 px-4 font-semibold">Date</th>
                  <th className="pb-2 px-4 font-semibold">Amount Paid</th>
                  <th className="pb-2 px-4 font-semibold">Status</th>
                  <th className="pb-2 pl-4 text-right font-semibold">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--text-secondary)]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[var(--tertiary)]/50 transition">
                    <td className="py-2.5 pr-4 font-mono text-[10px]">{inv.number || inv.id.substring(0, 10)}</td>
                    <td className="py-2.5 px-4">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="py-2.5 px-4 font-semibold text-[var(--primary)]">
                      {inv.currency.toUpperCase() === "INR" ? "₹" : "$"}
                      {inv.amount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        inv.status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-2.5 pl-4 text-right">
                      {inv.pdfUrl ? (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--secondary)] hover:underline font-bold text-[11px]"
                        >
                          Download PDF
                        </a>
                      ) : (
                        <span className="text-[var(--text-muted)] text-[10px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
