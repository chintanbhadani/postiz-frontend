"use client";
import { useEffect, useState } from "react";
import { integrationsApi } from "../../../lib/api";
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
    fields: [{ key: "botToken", label: "Bot Token (from @BotFather)", type: "password" }, { key: "chatId", label: "Channel/Chat ID", type: "text" }]
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

  console.log(" Sucess :: ", success);
  console.log(" Error  :: ", error);


  useEffect(() => {
    integrationsApi.list().then((res) => setIntegrations(res.data)).catch(() => { });
  }, []);

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
          internalId = values.chatId;
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
        <h1 className="text-2xl font-bold text-white">Social Channels</h1>
        <p className="text-gray-500 mt-1">Connect your social media accounts to start scheduling</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-medium">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 font-medium">
          {success}
        </div>
      )}

      {integrations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Connected ({integrations.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {integrations.map((int) => {
              const p = PLATFORMS.find((pl) => pl.id === int.platform);
              return (
                <div key={int.id} className="bg-[rgba(15,23,42,0.35)] border border-[rgba(52,211,153,0.15)] rounded-2xl p-4 flex items-center gap-3 backdrop-blur-[12px]">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: p?.color || "#6b7280" }}>
                    {int.platform?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{int.name}</p>
                    <p className="text-[#34d399] text-xs">Connected &middot; {int.platform}</p>
                  </div>
                  <button onClick={() => disconnect(int.id)} className="text-gray-600 hover:text-[#f87171] transition text-sm p-1 cursor-pointer">✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">All Platforms</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {PLATFORMS.map((platform) => {
          const connected = isConnected(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => { if (!connected) { setSelected(platform); setError(""); } }}
              className={`p-4 rounded-2xl border text-left transition-all group relative ${connected
                ? "border-[rgba(52,211,153,0.15)] bg-[rgba(52,211,153,0.03)] cursor-default"
                : "border-white/[0.05] bg-[rgba(15,23,42,0.35)] backdrop-blur-[12px] hover:border-[rgba(99,102,241,0.2)] hover:bg-[rgba(99,102,241,0.03)] cursor-pointer"
                }`}
            >
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: platform.color }}>
                {platform.name[0]}
              </div>
              <p className="text-white text-sm font-medium">{platform.name}</p>
              <p className="text-xs mt-0.5">
                {connected
                  ? <span className="text-[#34d399]">Connected</span>
                  : <span className="text-gray-500">{platform.authType === "oauth" ? "OAuth" : "API Key"}</span>}
              </p>
            </button>
          );
        })}
      </div>


      {/* Custom Instagram Choice Modal */}
      {selected && selected.authType === "custom" && selected.id === "instagram" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--natural)] border border-[var(--border)] rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--primary)] transition">✕</button>
            <h2 className="text-xl font-bold text-[var(--primary)] mb-2 text-center">How would you like to connect your Instagram Account?</h2>
            <p className="text-[var(--text-secondary)] text-sm text-center mb-8">Features depend on the type of Instagram account you have and the connection you choose.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Professional */}
              <div className="border border-[var(--border)] rounded-xl p-6 hover:border-[var(--secondary-dim)] transition bg-[var(--main-background)] flex flex-col">
                <h3 className="font-bold text-[var(--primary)] text-lg mb-1">Professional <span className="text-sm font-normal text-[var(--text-muted)]">(Business & Creator)</span></h3>
                <span className="inline-block bg-[#10b981]/10 text-[#10b981] text-xs font-bold px-2 py-1 rounded-md mb-4 self-start">Automatic & Notification-based</span>

                <ul className="space-y-3 text-sm text-[var(--text-secondary)] flex-1">
                  <li className="flex items-start gap-2"><span className="text-[#10b981]">✓</span> <strong>Automatic posting</strong> - You schedule and we post</li>
                  <li className="flex items-start gap-2"><span className="text-[#10b981]">✓</span> <strong>Notifications</strong> - We notify you, then you finish in app</li>
                  <li className="flex items-start gap-2"><span className="text-[#10b981]">✓</span> <strong>Community</strong> - Easily reply to comments</li>
                  <li className="flex items-start gap-2"><span className="text-[#10b981]">✓</span> <strong>Sent Post Metrics</strong> - View past post performance</li>
                </ul>

                <button
                  onClick={async () => {
                    try {
                      const res = await integrationsApi.getAuthUrl("instagram");
                      window.location.href = res.data.url;
                    } catch (e) { setError("Failed to start OAuth"); }
                  }}
                  className="w-full mt-6 py-3 bg-[#a7f3d0] hover:bg-[#6ee7b7] text-[#065f46] font-bold rounded-xl transition"
                >
                  Connect to Instagram
                </button>
                <p className="text-xs text-[var(--text-muted)] mt-4">ⓘ Instagram will prompt you to easily convert to a professional account if needed.</p>
              </div>

              {/* Personal */}
              <div className="border border-[var(--border)] rounded-xl p-6 hover:border-[var(--secondary-dim)] transition bg-[var(--main-background)] flex flex-col">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[rgba(15,23,42,0.85)] border border-white/[0.05] rounded-2xl p-6 w-full max-w-md shadow-2xl backdrop-blur-[16px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: selected.color }}>
                {selected.name[0]}
              </div>
              <div>
                <h3 className="text-white font-semibold">Connect {selected.name}</h3>
                <p className="text-gray-500 text-sm">{selected.authType === "oauth" ? "Redirects to " + selected.name : "Enter your credentials"}</p>
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.key}
                        value={values[field.key] || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className="w-full bg-[rgba(15,23,42,0.35)] border border-white/[0.05] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[rgba(99,102,241,0.3)] transition backdrop-blur-[12px]"
                      />
                    </div>
                  ))}

                  {selected.authType === "oauth" && (
                    <div className="bg-[rgba(99,102,241,0.05)] border border-[rgba(99,102,241,0.15)] rounded-xl px-4 py-3 text-sm text-[#818cf8]">
                      You&apos;ll be redirected to {selected.name} to authorize access.
                    </div>
                  )}

                  {error && <div className="bg-[rgba(248,113,113,0.05)] border border-[rgba(248,113,113,0.15)] rounded-xl px-4 py-3 text-[#f87171] text-sm">{error}</div>}
                  {success && <div className="bg-[rgba(52,211,153,0.05)] border border-[rgba(52,211,153,0.15)] rounded-xl px-4 py-3 text-[#34d399] text-sm">{success}</div>}

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="flex-1 px-4 py-3 bg-[rgba(15,23,42,0.35)] hover:bg-[rgba(15,23,42,0.55)] text-gray-300 rounded-xl border border-white/[0.05] transition text-sm cursor-pointer backdrop-blur-[12px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 text-white font-medium rounded-xl transition text-sm disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.25)]"
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
