"use client";
import { useEffect, useState } from "react";
import { integrationsApi, billingApi, authApi } from "../../../lib/api";
import { Formik, Form } from "formik";

const PLATFORMS = [
  { id: "twitter", name: "Twitter / X", color: "#1da1f2", authType: "oauth", fields: [] },
  { id: "linkedin", name: "LinkedIn", color: "#0077b5", authType: "oauth", fields: [] },
  { id: "facebook", name: "Facebook", color: "#1877f2", authType: "oauth", fields: [] },
  { id: "instagram", name: "Instagram", color: "#e1306c", authType: "custom", fields: [] },
  { id: "youtube", name: "YouTube", color: "#ff0000", authType: "oauth", fields: [] },
  { id: "tiktok", name: "TikTok", color: "#000000", authType: "oauth", fields: [] },
  { id: "pinterest", name: "Pinterest", color: "#e60023", authType: "oauth", fields: [] },
  { id: "reddit", name: "Reddit", color: "#ff4500", authType: "oauth", fields: [] },
  {
    id: "bluesky", name: "BlueSky", color: "#0085ff", authType: "credentials",
    fields: [{ key: "handle", label: "Handle (e.g. user.bsky.social)", type: "text" }, { key: "appPassword", label: "App Password", type: "password" }]
  },
  { id: "threads", name: "Threads", color: "#101010", authType: "oauth", fields: [] },
  {
    id: "telegram", name: "Telegram", color: "#0088cc", authType: "token",
    fields: [{ key: "botToken", label: "Bot Token (from @BotFather)", type: "password" }]
  },
  {
    id: "discord", name: "Discord", color: "#5865f2", authType: "token",
    fields: [{ key: "botToken", label: "Bot Token", type: "password" }, { key: "channelId", label: "Channel ID", type: "text" }]
  },
  {
    id: "slack", name: "Slack", color: "#4a154b", authType: "token",
    fields: [{ key: "token", label: "Bot OAuth Token", type: "password" }, { key: "channelId", label: "Channel ID", type: "text" }]
  },
  {
    id: "mastodon", name: "Mastodon", color: "#6364ff", authType: "token",
    fields: [{ key: "instance", label: "Instance (e.g. mastodon.social)", type: "text" }, { key: "token", label: "Access Token", type: "password" }]
  },
  {
    id: "medium", name: "Medium", color: "#000000", authType: "token",
    fields: [{ key: "token", label: "Integration Token", type: "password" }]
  },
  {
    id: "devto", name: "Dev.to", color: "#0a0a0a", authType: "token",
    fields: [{ key: "apiKey", label: "API Key", type: "password" }]
  },
  {
    id: "hashnode", name: "Hashnode", color: "#2962ff", authType: "token",
    fields: [{ key: "token", label: "Personal Access Token", type: "password" }, { key: "publicationId", label: "Publication ID", type: "text" }]
  },
  {
    id: "wordpress", name: "WordPress", color: "#21759b", authType: "credentials",
    fields: [{ key: "siteUrl", label: "Site URL (e.g. https://mysite.com)", type: "text" }, { key: "username", label: "Username", type: "text" }, { key: "appPassword", label: "Application Password", type: "password" }]
  },
];

export default function ChannelsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [subStatus, setSubStatus] = useState<string | null>(null);

  console.log(" Sucess :: ", success);
  console.log(" Error  :: ", error);

  useEffect(() => {
    integrationsApi.list().then((res) => setIntegrations(res.data)).catch(() => { });
    authApi.me().then((res) => {
      const org = res.data.organizations?.[0]?.organization;
      if (org) {
        setSubStatus(org.subscriptionStatus);
      }
    }).catch(() => {});
  }, []);

  const handleSubscribe = async () => {
    try {
      const res = await billingApi.checkout(
        window.location.origin + "/channels?success=true",
        window.location.origin + "/channels?cancel=true"
      );
      window.location.href = res.data.url;
    } catch (err) {
      setError("Failed to redirect to Stripe Checkout");
    }
  };

  const isConnected = (platformId: string) => integrations.some((i) => i.platform === platformId);

  const handleConnect = async (values: any, { setSubmitting }: any) => {
    setError("");
    setSuccess("");
    try {
      if (selected.authType === "oauth") {
        const res = await integrationsApi.getAuthUrl(selected.id);

        console.log(" getAuthUrl res :: ", res);

        window.location.href = res.data.url;
      } else {
        let token = "", name = "", internalId = "";

        if (selected.id === "instagram_personal") {
          token = values.handle;
          name = values.handle;
          internalId = values.handle;
        } else if (selected.id === "bluesky") {
          token = values.handle + ":" + values.appPassword;
          name = values.handle;
          internalId = values.handle;
        } else if (selected.id === "telegram") {
          token = values.botToken;
          name = "Telegram Bot";
          internalId = values.chatId || "";
        } else if (selected.id === "discord") {
          token = values.botToken;
          name = "Discord Channel";
          internalId = values.channelId;
        } else if (selected.id === "slack") {
          token = values.token;
          name = "Slack Channel";
          internalId = values.channelId;
        } else if (selected.id === "mastodon") {
          token = values.token;
          name = "@me@" + values.instance;
          internalId = values.instance;
        } else if (selected.id === "wordpress") {
          token = values.siteUrl + ":" + values.username + ":" + values.appPassword;
          name = values.siteUrl;
          internalId = values.username;
        } else {
          token = values.token || values.apiKey || "";
          name = selected.name;
          internalId = selected.id;
        }

        await integrationsApi.connect({ platform: selected.id, name, token, internalId });
        setSuccess(selected.name + " connected!");
        const res = await integrationsApi.list();
        setIntegrations(res.data);
        setTimeout(() => {
          setSelected(null);
          setSuccess("");
        }, 1500);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Connection failed");
      setSubmitting(false);
    }
  };

  const disconnect = async (id: string) => {
    if (!confirm("Disconnect this channel?")) return;
    try {
      await integrationsApi.disconnect(id);
      setIntegrations((prev) => prev.filter((i) => i.id !== id));
    } catch (e) { }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary)]">Social Channels</h1>
        <p className="text-[var(--text-muted)] mt-1">Connect your social media accounts to start scheduling</p>
      </div>

      {subStatus !== "active" ? (
        <div className="mb-8 p-6 bg-[var(--secondary-dim)] border border-[var(--secondary)]/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--primary)]">Subscription Required</h3>
            <p className="text-[var(--text-secondary)] text-sm mt-1 font-semibold">
              To connect and schedule posts to channels, you need to set up your subscription ($4.99/month per connected channel).
            </p>
          </div>
          <button
            onClick={handleSubscribe}
            className="px-6 py-3 bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white font-bold rounded-xl transition text-sm cursor-pointer whitespace-nowrap shadow-lg shadow-[var(--secondary)]/20"
          >
            Activate Subscription
          </button>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-medium text-sm flex justify-between items-center">
          <span>✓ Your subscription is Active ($4.99/month per connected channel).</span>
          <button
            onClick={handleSubscribe}
            className="text-xs text-[var(--secondary)] underline font-bold cursor-pointer hover:text-[var(--secondary)]/80"
          >
            Manage Billing
          </button>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[#f87171] font-medium text-sm">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-medium text-sm">
          {success}
        </div>
      )}

      {integrations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">Connected ({integrations.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {integrations.map((int) => {
              const p = PLATFORMS.find((pl) => pl.id === int.platform);
              return (
                <div key={int.id} className="bg-[var(--natural)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: p?.color || "#6b7280" }}>
                    {int.platform?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--primary)] text-sm font-medium truncate">{int.name}</p>
                    <p className="text-[var(--secondary)] text-xs">Connected &middot; {int.platform}</p>
                  </div>
                  <button onClick={() => disconnect(int.id)} className="text-[var(--text-muted)] hover:text-[#f87171] transition text-sm p-1 cursor-pointer">✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">All Platforms</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {PLATFORMS.map((platform) => {
          const connected = isConnected(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => {
                if (!connected) {
                  if (subStatus !== "active") {
                    setError("Please activate your subscription before connecting channels.");
                    return;
                  }
                  setSelected(platform);
                  setError("");
                }
              }}
              className={`p-4 rounded-2xl border text-left transition-all group relative ${connected
                ? "border-[var(--secondary)]/30 bg-[var(--secondary-dim)] cursor-default"
                : "border-[var(--border)] bg-[var(--natural)] hover:border-[var(--secondary)] hover:bg-[var(--secondary-dim)] cursor-pointer"
                }`}
            >
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: platform.color }}>
                {platform.name[0]}
              </div>
              <p className="text-[var(--primary)] text-sm font-medium">{platform.name}</p>
              <p className="text-xs mt-0.5">
                {connected
                  ? <span className="text-[var(--secondary)] font-semibold">Connected</span>
                  : <span className="text-[var(--text-muted)]">{platform.authType === "oauth" ? "OAuth" : "API Key"}</span>}
              </p>
            </button>
          );
        })}
      </div>


      {/* Custom Instagram Choice Modal */}
      {selected && selected.authType === "custom" && selected.id === "instagram" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--natural)] border border-[var(--border)] rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--primary)] transition">✕</button>
            <h2 className="text-xl font-bold text-[var(--primary)] mb-2 text-center">How would you like to connect your Instagram Account?</h2>
            <p className="text-[var(--text-secondary)] text-sm text-center mb-8">Features depend on the type of Instagram account you have and the connection you choose.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Professional */}
              <div className="border border-[var(--border)] rounded-xl p-6 hover:border-[var(--secondary)] transition bg-[var(--main-background)] flex flex-col">
                <h3 className="font-bold text-[var(--primary)] text-lg mb-1">Professional <span className="text-sm font-normal text-[var(--text-muted)]">(Business & Creator)</span></h3>
                <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-md mb-4 self-start">Automatic & Notification-based</span>

                <ul className="space-y-3 text-sm text-[var(--text-secondary)] flex-1">
                  <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> <strong>Automatic posting</strong> - You schedule and we post</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> <strong>Notifications</strong> - We notify you, then you finish in app</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> <strong>Community</strong> - Easily reply to comments</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> <strong>Sent Post Metrics</strong> - View past post performance</li>
                </ul>

                <button
                  onClick={async () => {
                    try {
                      const res = await integrationsApi.getAuthUrl("instagram");
                      window.location.href = res.data.url;
                    } catch (e) { setError("Failed to start OAuth"); }
                  }}
                  className="w-full mt-6 py-3 bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white font-bold rounded-xl transition"
                >
                  Connect to Instagram
                </button>
                <p className="text-xs text-[var(--text-muted)] mt-4">ⓘ Instagram will prompt you to easily convert to a professional account if needed.</p>
              </div>

              {/* Personal */}
              <div className="border border-[var(--border)] rounded-xl p-6 hover:border-[var(--secondary)] transition bg-[var(--main-background)] flex flex-col">
                <h3 className="font-bold text-[var(--primary)] text-lg mb-1">Personal</h3>
                <span className="inline-block bg-[var(--border)] text-[var(--text-secondary)] text-xs font-bold px-2 py-1 rounded-md mb-4 self-start">Notification-Based Posting Only</span>

                <ul className="space-y-3 text-sm text-[var(--text-secondary)] flex-1">
                  <li className="flex items-start gap-2"><span className="text-[var(--text-muted)]">✓</span> <strong>Notifications</strong> - We notify you, then you finish in app</li>
                </ul>

                <button
                  onClick={() => setSelected({
                    id: "instagram_personal",
                    name: "Instagram (Personal)",
                    color: "#e1306c",
                    authType: "credentials",
                    fields: [{ key: "handle", label: "Instagram Handle (e.g. @johndoe)", type: "text" }]
                  })}
                  className="w-full mt-6 py-3 bg-[var(--natural)] hover:bg-[var(--tertiary)] text-[var(--primary)] font-semibold rounded-xl border border-[var(--border)] transition shadow-sm"
                >
                  Setup a Personal Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal - Glass */}
      {selected && selected.authType !== "custom" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--main-background)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--primary)] transition">✕</button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: selected.color }}>
                {selected.name[0]}
              </div>
              <div>
                <h3 className="text-[var(--primary)] font-semibold">Connect {selected.name}</h3>
                <p className="text-[var(--text-muted)] text-sm">{selected.authType === "oauth" ? "Redirects to " + selected.name : "Enter your credentials"}</p>
              </div>
            </div>

            <Formik
              initialValues={selected.fields.reduce((acc: any, field: any) => {
                acc[field.key] = "";
                return acc;
              }, {})}
              onSubmit={handleConnect}
            >
              {({ values, handleChange, handleBlur, isSubmitting }) => (
                <Form className="space-y-4">
                  {selected.fields.map((field: any) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.key}
                        value={values[field.key] || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required={!field.label.includes("(Optional)")}
                        className="w-full bg-[var(--natural)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--primary)] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-[var(--secondary)] transition"
                      />
                    </div>
                  ))}

                  {selected.authType === "oauth" && (
                    <div className="bg-[var(--secondary-dim)] border border-[var(--secondary)]/30 rounded-xl px-4 py-3 text-sm text-[var(--secondary)]">
                      You&apos;ll be redirected to {selected.name} to authorize access.
                    </div>
                  )}

                  {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-[#f87171] text-sm">{error}</div>}
                  {success && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-400 text-sm">{success}</div>}

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="flex-1 px-4 py-3 bg-[var(--natural)] hover:bg-[var(--tertiary)] text-[var(--text-secondary)] rounded-xl border border-[var(--border)] transition text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 text-white font-medium rounded-xl transition text-sm disabled:opacity-50 cursor-pointer shadow-lg shadow-[var(--secondary)]/20"
                      style={{ backgroundColor: selected.color }}
                    >
                      {isSubmitting ? "Connecting..." : selected.authType === "oauth" ? "Authorize" : "Connect"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
