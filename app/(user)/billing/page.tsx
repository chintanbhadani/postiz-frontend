"use client";
import { useEffect, useState } from "react";
import { billingApi, integrationsApi, authApi } from "../../../lib/api";

export default function BillingPage() {
  const [integrationsCount, setIntegrationsCount] = useState(0);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null); // 'essentials', 'team', or null
  const [currentSubscription, setCurrentSubscription] = useState<any>(null); // full subscription object
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedChannels, setSelectedChannels] = useState(1);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  // UPI Cancel & Re-subscribe flow states
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [pendingPlanType, setPendingPlanType] = useState("");
  const [upiProcessing, setUpiProcessing] = useState(false);

  console.log(" currentPlan :: ", currentPlan);
  

  useEffect(() => {
    async function init() {
      try {
        const integrationsRes = await integrationsApi.list();
        setIntegrationsCount(integrationsRes.data.length);
        setSelectedChannels(Math.max(1, integrationsRes.data.length));

        const meRes = await authApi.me();
        console.log(" cmeRes :: ", meRes);
        
        const org = meRes.data.organizations?.[0]?.organization;
        if (org) {
          setSubStatus(org.subscriptionStatus);
          const sub = org.subscriptions;
          if (sub) {
            setCurrentSubscription(sub);
            if (sub.plan && sub.plan !== 'unknown') {
              setCurrentPlan(sub.plan);
            }
          }
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planType: string) => {
    if (selectedChannels < integrationsCount) {
      setError(`You have ${integrationsCount} channels connected. Please disconnect ${integrationsCount - selectedChannels} channel(s) before downgrading.`);
      return;
    }
    
    try {
      const res = await billingApi.createRazorpaySubscription(planType, selectedChannels, billingCycle);
      const { subscription_id } = res.data;

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setError("Failed to load Razorpay. Please check your connection.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: "Postilio",
        description: `Subscription for ${planType} plan`,
        subscription_id: subscription_id,
        handler: async function (response: any) {
          try {
            await billingApi.verifyRazorpayPayment(
              response.razorpay_subscription_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              planType,     // plan name (essentials/team)
              billingCycle, // monthly/yearly
              selectedChannels // number of channels
            );
            window.location.reload();
          } catch (verifyErr) {
            setError("Payment verification failed.");
          }
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      setError("Failed to start checkout. Please try again.");
    }
  };

  const handleUpdateSubscription = async (planType: string) => {
    if (selectedChannels < integrationsCount) {
      setError(`You have ${integrationsCount} channels connected. Please disconnect ${integrationsCount - selectedChannels} channel(s) before downgrading.`);
      return;
    }
    
    try {
      setLoading(true);
      const res = await billingApi.updateRazorpaySubscription(planType, selectedChannels, billingCycle);
      if (res.data.success) {
        window.location.reload();
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      if (errorMsg === 'UPI_NOT_SUPPORTED' || (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes("payment mode is upi"))) {
        setPendingPlanType(planType);
        setShowUpiModal(true);
      } else {
        setError(`Update failed: ${errorMsg}`);
      }
      setLoading(false);
    }
  };

  const handleCancelAndResubscribe = async () => {
    try {
      setUpiProcessing(true);
      // 1. Cancel and Refund
      const res = await billingApi.cancelAndRefundRazorpaySubscription();
      setShowUpiModal(false);
      
      if (res.data.refundedAmountINR > 0) {
        alert(`Successfully cancelled! ₹${res.data.refundedAmountINR} has been refunded to your bank account and will reflect in 5-7 business days.`);
      } else {
        alert("Previous subscription cancelled successfully.");
      }
      
      // 2. Trigger new checkout flow
      handleSubscribe(pendingPlanType);
    } catch (err: any) {
      setError(`Failed to cancel UPI subscription: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpiProcessing(false);
    }
  };

  const handlePlanClick = (planType: string) => {
    // If attempting to subscribe to a paid plan with fewer selected channels than connected
    if (selectedChannels < integrationsCount) {
      setError(`You have ${integrationsCount} channels connected. Please disconnect ${integrationsCount - selectedChannels} channel(s) before downgrading.`);
      return;
    }
    
    // If somehow trying to downgrade to free while having more than 1 channel
    if (planType === 'free' && integrationsCount > 1) {
      setError(`You have ${integrationsCount} channels connected. Please disconnect channels until you only have 1 left before downgrading to the Free plan.`);
      return;
    }

    if (isFreePlan) {
      handleSubscribe(planType);
    } else {
      handleUpdateSubscription(planType);
    }
  };

  const handleManageBilling = async () => {
    setError("You are currently on a Razorpay subscription. You can change your plan or channel count directly on this page.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-[var(--secondary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isFreePlan = subStatus !== "active";
  const isEssentialsPlan = !isFreePlan && currentPlan === 'essentials';
  const isTeamPlan = !isFreePlan && currentPlan === 'team';
  
  // Pricing configuration
  const essentialsPriceUnit = billingCycle === "yearly" ? 499 : 599;
  const teamPriceUnit = billingCycle === "yearly" ? 1099 : 1199;

  const totalEssentialsPrice = selectedChannels * essentialsPriceUnit;
  const totalTeamPrice = selectedChannels * teamPriceUnit;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 text-sm">
      {/* UPI Cancel & Resubscribe Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--natural)] border border-[var(--border)] rounded-xl p-6 shadow-2xl max-w-md w-full">
            <h3 className="text-lg font-bold text-[var(--primary)] mb-2">UPI Plan Update Required</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Your current payment method (UPI) does not support automatic upgrades or downgrades. 
            </p>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              To update your plan, we will <strong className="text-[var(--primary)]">cancel your current subscription</strong> and refund any unused amount to your bank account. You will then be prompted to purchase the new plan.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowUpiModal(false)}
                disabled={upiProcessing}
                className="px-4 py-2 rounded-lg font-bold text-xs bg-gray-500/10 text-[var(--text-secondary)] hover:text-[var(--primary)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCancelAndResubscribe}
                disabled={upiProcessing}
                className="px-4 py-2 rounded-lg font-bold text-xs bg-[#10b981] text-white hover:bg-[#0f9f6e] flex items-center gap-2 disabled:opacity-50"
              >
                {upiProcessing ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                ) : (
                  "Confirm & Proceed"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Current Subscription Banner — shown only when on a paid plan */}
      {currentSubscription && !isFreePlan && (
        <div className="mb-4 bg-gradient-to-r from-[var(--secondary)]/10 to-emerald-500/5 border border-[var(--secondary)]/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div>
            <h3 className="text-[var(--primary)] font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Subscription
            </h3>
            <p className="text-[var(--text-secondary)] text-xs mt-1">
              You are currently subscribed to the <span className="font-bold text-[var(--secondary)] capitalize">{currentSubscription.plan}</span> plan.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs bg-[var(--natural)] px-4 py-2 rounded-lg border border-[var(--border)] shadow-xs">
            <div className="flex flex-col">
              <span className="text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-wider">Channels</span>
              <span className="font-black text-[var(--primary)]">{currentSubscription.quantity} Selected</span>
            </div>
            <div className="w-px h-8 bg-[var(--border)] hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-wider">Renews On</span>
              <span className="font-bold text-[var(--primary)]">
                {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modern Compact Header with Selectors */}
      <div className="bg-[var(--natural)] border border-[var(--border)] rounded-xl p-4 mb-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-[var(--primary)]">Flexible Pricing for Everyone</h2>
          <p className="text-[var(--text-muted)] text-xs mt-0.5">
            {isFreePlan ? (
              <>You're on the <span className="font-semibold text-[var(--secondary)]">Free plan</span> with up to 1 channel. Customize your setup below.</>
            ) : (
              <>Adjust your channel count or switch plans below.</>
            )}
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
          isEssentialsPlan ? "border-[var(--secondary)] ring-1 ring-[var(--secondary)]/15" : "border-[var(--border)]"
        }`}>
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[var(--primary)] text-sm">Essentials</h3>
              {isEssentialsPlan && <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>}
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
            onClick={() => handlePlanClick("essentials")}
            className={`w-full mt-6 py-2 font-bold rounded-lg text-xs transition cursor-pointer ${
              isEssentialsPlan && currentSubscription?.quantity === selectedChannels
                ? "bg-gray-500/10 text-gray-400 cursor-default"
                : isFreePlan
                  ? "bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white"
                  : "bg-gray-500/10 hover:bg-gray-500/20 text-[var(--primary)] border border-gray-500/20"
            }`}
            disabled={isEssentialsPlan && currentSubscription?.quantity === selectedChannels}
          >
            {isEssentialsPlan && currentSubscription?.quantity === selectedChannels 
              ? "Current Plan" 
              : isEssentialsPlan 
                ? "Update Setup" 
                : isFreePlan ? "Upgrade to Essentials" : "Downgrade to Essentials"}
          </button>
        </div>

        {/* TEAM PLAN */}
        <div className={`bg-[var(--natural)] border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
          isTeamPlan ? "border-[var(--secondary)] ring-1 ring-[var(--secondary)]/15" : "border-[var(--border)]"
        }`}>
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[var(--primary)] text-sm">Team</h3>
              {isTeamPlan && <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>}
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
            onClick={() => handlePlanClick("team")}
            disabled={isTeamPlan && currentSubscription?.quantity === selectedChannels}
            className={`w-full mt-6 py-2 font-bold rounded-lg text-xs transition ${
              isTeamPlan && currentSubscription?.quantity === selectedChannels
                ? "bg-gray-500/10 text-gray-400 cursor-default"
                : "bg-[var(--natural)] hover:bg-[var(--tertiary)] border border-[var(--border)] text-[var(--primary)] cursor-pointer"
            }`}
          >
            {isTeamPlan && currentSubscription?.quantity === selectedChannels 
              ? "Current Plan" 
              : isTeamPlan 
                ? "Update Setup" 
                : isFreePlan ? "Upgrade to Team" : "Upgrade to Team"}
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
                    <td className="py-2.5 px-4">{new Date(inv.date).toLocaleString()}</td>
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
