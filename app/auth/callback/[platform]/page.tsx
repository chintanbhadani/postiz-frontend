"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { integrationsApi } from "../../../../lib/api";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import Cookies from "js-cookie";

// ─── Inline SVG icons (lucide-react v1.x compat) ────────────────────────────

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

interface SocialPage {
  pageId?: string; // used for instagram pages internally
  id: string;
  name: string;
  picture?: { data?: { url?: string } };
}

type Status = "loading" | "select_page" | "success" | "error";

// ─── Component ───────────────────────────────────────────────────────────────

export default function AuthCallbackUIPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const platform = (Array.isArray(params.platform) ? params.platform[0] : params.platform) || "";
  const step = searchParams.get("step") || "";            // "success" | "select_page"
  const oauthError = searchParams.get("error") || "";     // error forwarded from route handler
  const code = searchParams.get("code") || "";            // OAuth code from provider
  const state = searchParams.get("state") || "";          // OAuth state from provider

  console.log("[OAuth Callback] Page loaded", { platform, step, code: code ? code.slice(0, 20) + "..." : "(none)", state: state ? state.slice(0, 20) + "..." : "(none)", oauthError: oauthError || "(none)" });

  const [status, setStatus] = useState<Status>(oauthError ? "error" : step === "success" ? "success" : step === "select_page" ? "loading" : "loading");
  const [errorMessage, setErrorMessage] = useState(oauthError);

  console.log("[OAuth Callback] Status:", status);

  // Sync status whenever the URL params change (e.g. after router.replace to ?step=success)
  // useState initial value only runs once, so we need this effect to react to URL changes
  useEffect(() => {
    if (oauthError) {
      setStatus("error");
      setErrorMessage(oauthError);
    } else if (step === "success") {
      setStatus("success");
    } else if (step === "select_page") {
      setStatus("loading");
    }
  }, [step, oauthError]);

  // Guard against React Strict Mode double-firing the effect
  const hasForwarded = useRef(false);

  // If provider redirected here with a ?code=, forward it to the API route handler
  useEffect(() => {
    console.log("[OAuth Callback] useEffect triggered", { code: !!code, step, oauthError: !!oauthError });
    if (!code || step || oauthError) {
      console.log("[OAuth Callback] Skipping redirect because:", { noCode: !code, hasStep: !!step, hasError: !!oauthError });
      return;
    }
    if (hasForwarded.current) {
      console.log("[OAuth Callback] Already forwarded, skipping duplicate call.");
      return;
    }
    hasForwarded.current = true;
    // Build the API route URL with the same query params
    const apiUrl = `/api/auth/callback/${platform}?code=${encodeURIComponent(code)}${state ? `&state=${encodeURIComponent(state)}` : ""}`;
    console.log("[OAuth Callback] Forwarding to API route:", apiUrl);
    router.replace(apiUrl);
  }, [code, step, oauthError, platform, state, router]);
  const [pages, setPages] = useState<SocialPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [pageSelectError, setPageSelectError] = useState("");
  const [countdown, setCountdown] = useState(3);

  const platformName = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "";

  // Load pages when step=select_page
  useEffect(() => {
    if (step !== "select_page") return;
    const token = Cookies.get("oauth_access_token") || Cookies.get("ig_access_token");
    if (!token) {
      setStatus("error");
      setErrorMessage(`${platformName} session expired. Please reconnect from the Channels page.`);
      return;
    }

    if (platform === "facebook") {
      integrationsApi.facebookGetPages(token)
        .then((res) => {
          setPages(res.data || []);
          setStatus("select_page");
        })
        .catch((err: any) => {
          setStatus("error");
          setErrorMessage(err?.response?.data?.message || "Failed to fetch Facebook Pages.");
        });
    } else if (platform === "linkedin") {
      integrationsApi.linkedinGetPages(token)
        .then((res) => {
          setPages(res.data || []);
          setStatus("select_page");
        })
        .catch((err: any) => {
          setStatus("error");
          setErrorMessage(err?.response?.data?.message || "Failed to fetch LinkedIn Pages.");
        });
    } else {
      integrationsApi.instagramGetPages(token)
        .then((res) => {
          setPages(res.data || []);
          setStatus("select_page");
        })
        .catch((err: any) => {
          setStatus("error");
          setErrorMessage(err?.response?.data?.message || "Failed to fetch Instagram Business pages.");
        });
    }
  }, [step, platform, platformName]);

  // Auto-redirect on success
  useEffect(() => {
    if (status !== "success") return;
    if (countdown <= 0) { router.push("/channels"); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, router]);

  const handleSelectPage = async (page: SocialPage) => {
    const token = Cookies.get("oauth_access_token") || Cookies.get("ig_access_token") || "";
    setSelectedPageId(page.id); // for UI state we can just use page.id
    setIsFinishing(true);
    setPageSelectError("");
    try {
      if (platform === "facebook") {
        await integrationsApi.facebookSelectPage({ accessToken: token, pageId: page.id });
      } else if (platform === "linkedin") {
        await integrationsApi.linkedinSelectPage({ accessToken: token, pageId: page.id });
      } else {
        await integrationsApi.instagramSelectPage({ accessToken: token, pageId: page.pageId as string, igAccountId: page.id });
      }
      Cookies.remove("oauth_access_token");
      Cookies.remove("ig_access_token");
      setStatus("success");
    } catch (err: any) {
      setIsFinishing(false);
      setSelectedPageId("");
      setPageSelectError(err?.response?.data?.message || `Failed to connect the selected ${platformName} account.`);
    }
  };

  const isFacebook = platform === "facebook";
  const isLinkedIn = platform === "linkedin";

  return (
    <div className="flex min-h-screen w-full bg-[#030712] relative items-center justify-center p-4 overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none z-0" />
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Card */}
      <div className="w-full max-w-xl bg-[rgba(15,23,42,0.55)] backdrop-blur-[24px] border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 animate-fade-in flex flex-col items-center text-center">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 bg-[#6366f1] rounded-lg transform -rotate-6 opacity-60 blur-[2px]" />
            <div className="absolute inset-0 bg-[#6366f1] rounded-lg transform rotate-2 opacity-80" />
            <div className="absolute inset-0 bg-[#6366f1] rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
              <span className="text-white text-sm font-black">P</span>
            </div>
          </div>
          <span className="text-white font-black text-xl tracking-tight">Postilio</span>
        </div>

        {/* ── Loading ── */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-8 w-full">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#6366f1]/10 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#6366f1] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#6366f1] font-bold text-lg">P</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {step === "select_page" ? "Loading Pages" : `Connecting ${platformName}`}
            </h2>
            <p className="text-gray-400 max-w-sm text-sm">
              {step === "select_page"
                ? "Fetching your pages & accounts…"
                : `Finalising your ${platformName || "social"} connection…`}
            </p>
          </div>
        )}

        {/* ── Success ── */}
        {status === "success" && (
          <div className="flex flex-col items-center justify-center py-6 w-full">
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center bg-green-500/10 rounded-full border border-green-500/20">
              <CheckCircleIcon className="w-10 h-10 text-green-500 animate-bounce" />
              <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-ping opacity-40" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Connection Successful!</h2>
            <p className="text-gray-400 mb-8 max-w-sm text-sm">
              Your account has been linked. You can now publish and schedule posts directly to it.
            </p>
            <div className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 mb-6 text-sm text-gray-400 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Redirecting to dashboard in <span className="font-bold text-white text-base mx-1">{countdown}</span> seconds…
            </div>
            <Link href="/channels" className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e6] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.35)] flex items-center gap-2">
              Go to Channels Now <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* ── Error ── */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-6 w-full">
            <div className="w-20 h-20 mb-6 flex items-center justify-center bg-red-500/10 rounded-full border border-red-500/20">
              <AlertCircleIcon className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Connection Failed</h2>
            <p className="text-gray-400 mb-6 max-w-md text-sm">We encountered an issue while trying to authenticate your account.</p>
            {errorMessage && (
              <div className="w-full bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-8 text-left text-sm text-red-400 font-mono break-all whitespace-pre-wrap">
                {errorMessage}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Link href="/channels" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/[0.08] transition text-center">
                Back to Channels
              </Link>
            </div>
          </div>
        )}

        {/* ── Page Selection ── */}
        {status === "select_page" && (
          <div className="w-full">
            {pages.length === 0 ? (
              <div className="w-full flex flex-col items-center">
                <div className={`w-16 h-16 mb-4 flex items-center justify-center ${isFacebook ? 'bg-blue-500/10 border-blue-500/20' : isLinkedIn ? 'bg-sky-500/10 border-sky-500/20' : 'bg-yellow-500/10 border-yellow-500/20'} rounded-full border`}>
                  {isFacebook ? <FacebookIcon className="w-8 h-8 text-blue-500" /> : isLinkedIn ? <LinkedInIcon className="w-8 h-8 text-sky-500" /> : <InstagramIcon className="w-8 h-8 text-yellow-500" />}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No {platformName} Accounts Found</h2>
                <p className="text-gray-400 text-sm mb-6 max-w-sm">
                  We authenticated with {platformName} but couldn&apos;t find any {isFacebook ? 'Facebook Pages' : isLinkedIn ? 'LinkedIn Pages/Profiles' : 'Instagram Business accounts'} linked to your account.
                </p>
                <Link href="/channels" className="px-6 py-3 w-full bg-[#6366f1] hover:bg-[#5558e6] text-white font-bold rounded-xl transition shadow-[0_0_15px_rgba(99,102,241,0.35)] text-center">
                  Back to Channels
                </Link>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <h2 className="text-2xl font-bold text-white mb-2">Connect {platformName} {isFacebook ? 'Page' : isLinkedIn ? 'Profile/Page' : 'Business'}</h2>
                <p className="text-gray-400 text-sm mb-6 max-w-sm">
                  Select the {platformName} account you want to connect to Postilio.
                </p>
                {pageSelectError && (
                  <div className="w-full bg-red-500/5 border border-red-500/20 rounded-xl p-3 mb-4 text-left text-xs text-[#f87171]">
                    {pageSelectError}
                  </div>
                )}
                <div className="w-full space-y-3 mb-8 max-h-[300px] overflow-y-auto pr-1">
                  {pages.map((page) => {
                    const isSelected = selectedPageId === page.id;
                    const imageUrl = page.picture?.data?.url || (page.picture as any); // LinkedIn picture might be a flat string in details
                    return (
                      <div key={page.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isSelected ? "border-[#6366f1] bg-[#6366f1]/5 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]"}`}>
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-white/5 flex-shrink-0 flex items-center justify-center">
                          {imageUrl
                            ? <img src={imageUrl} alt={page.name} className="w-full h-full object-cover" />  /* eslint-disable-line @next/next/no-img-element */
                            : (isFacebook ? <FacebookIcon className="w-6 h-6 text-white/55" /> : isLinkedIn ? <LinkedInIcon className="w-6 h-6 text-white/55" /> : <InstagramIcon className="w-6 h-6 text-white/55" />)}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{page.name}</p>
                          <p className="text-gray-500 text-xs truncate">ID: {page.id}</p>
                        </div>
                        <button
                          disabled={isFinishing}
                          onClick={() => handleSelectPage(page)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${isSelected ? "bg-[#6366f1] text-white" : "bg-white/10 hover:bg-white/15 text-white"} disabled:opacity-50`}
                        >
                          {isSelected && isFinishing ? <Loader2 size={14} className="animate-spin" /> : isSelected ? "Linking…" : "Connect"}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <Link href="/channels" className="px-6 py-3 w-full bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/[0.08] transition text-center">
                  Cancel
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
