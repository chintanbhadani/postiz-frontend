"use client";
import { useEffect, useState } from "react";
import { integrationsApi } from "../../../lib/api";
import { Formik, Form } from "formik";

const PLATFORMS = [
  { id: "twitter", name: "Twitter / X", color: "#1da1f2", authType: "oauth", fields: [] },
  { id: "linkedin", name: "LinkedIn", color: "#0077b5", authType: "oauth", fields: [] },
  { id: "facebook", name: "Facebook", color: "#1877f2", authType: "oauth", fields: [] },
  { id: "instagram", name: "Instagram", color: "#e1306c", authType: "oauth", fields: [] },
  { id: "youtube", name: "YouTube", color: "#ff0000", authType: "oauth", fields: [] },
  { id: "tiktok", name: "TikTok", color: "#000000", authType: "oauth", fields: [] },
  { id: "pinterest", name: "Pinterest", color: "#e60023", authType: "oauth", fields: [] },
  { id: "reddit", name: "Reddit", color: "#ff4500", authType: "oauth", fields: [] },
  { id: "bluesky", name: "BlueSky", color: "#0085ff", authType: "credentials",
    fields: [{ key: "handle", label: "Handle (e.g. user.bsky.social)", type: "text" }, { key: "appPassword", label: "App Password", type: "password" }] },
  { id: "threads", name: "Threads", color: "#101010", authType: "oauth", fields: [] },
  { id: "telegram", name: "Telegram", color: "#0088cc", authType: "token",
    fields: [{ key: "botToken", label: "Bot Token (from @BotFather)", type: "password" }, { key: "chatId", label: "Channel/Chat ID", type: "text" }] },
  { id: "discord", name: "Discord", color: "#5865f2", authType: "token",
    fields: [{ key: "botToken", label: "Bot Token", type: "password" }, { key: "channelId", label: "Channel ID", type: "text" }] },
  { id: "slack", name: "Slack", color: "#4a154b", authType: "token",
    fields: [{ key: "token", label: "Bot OAuth Token", type: "password" }, { key: "channelId", label: "Channel ID", type: "text" }] },
  { id: "mastodon", name: "Mastodon", color: "#6364ff", authType: "token",
    fields: [{ key: "instance", label: "Instance (e.g. mastodon.social)", type: "text" }, { key: "token", label: "Access Token", type: "password" }] },
  { id: "medium", name: "Medium", color: "#000000", authType: "token",
    fields: [{ key: "token", label: "Integration Token", type: "password" }] },
  { id: "devto", name: "Dev.to", color: "#0a0a0a", authType: "token",
    fields: [{ key: "apiKey", label: "API Key", type: "password" }] },
  { id: "hashnode", name: "Hashnode", color: "#2962ff", authType: "token",
    fields: [{ key: "token", label: "Personal Access Token", type: "password" }, { key: "publicationId", label: "Publication ID", type: "text" }] },
  { id: "wordpress", name: "WordPress", color: "#21759b", authType: "credentials",
    fields: [{ key: "siteUrl", label: "Site URL (e.g. https://mysite.com)", type: "text" }, { key: "username", label: "Username", type: "text" }, { key: "appPassword", label: "Application Password", type: "password" }] },
];

export default function ChannelsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    integrationsApi.list().then((res) => setIntegrations(res.data)).catch(() => {});
  }, []);

  const isConnected = (platformId: string) => integrations.some((i) => i.platform === platformId);

  const handleConnect = async (values: any, { setSubmitting }: any) => {
    setError("");
    setSuccess("");
    try {
      if (selected.authType === "oauth") {
        const res = await integrationsApi.getAuthUrl(selected.id);
        window.location.href = res.data.url;
      } else {
        let token = "", name = "", internalId = "";

        if (selected.id === "bluesky") {
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
    } catch (e) {}
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Social Channels</h1>
        <p className="text-gray-400 mt-1">Connect your social media accounts to start scheduling</p>
      </div>

      {integrations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Connected ({integrations.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {integrations.map((int) => {
              const p = PLATFORMS.find((pl) => pl.id === int.platform);
              return (
                <div key={int.id} className="bg-gray-900 border border-green-800/40 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: p?.color || "#6b7280" }}>
                    {int.platform?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{int.name}</p>
                    <p className="text-green-400 text-xs">✓ Connected · {int.platform}</p>
                  </div>
                  <button onClick={() => disconnect(int.id)} className="text-gray-600 hover:text-red-400 transition text-sm p-1 cursor-pointer">✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">All Platforms</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {PLATFORMS.map((platform) => {
          const connected = isConnected(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => { if (!connected) { setSelected(platform); setError(""); } }}
              className={`p-4 rounded-2xl border text-left transition group relative ${
                connected
                  ? "border-green-800/40 bg-green-950/10 cursor-default"
                  : "border-gray-700 bg-gray-900 hover:border-violet-500/50 hover:bg-gray-800 cursor-pointer"
              }`}
            >
              <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: platform.color }}>
                {platform.name[0]}
              </div>
              <p className="text-white text-sm font-medium">{platform.name}</p>
              <p className="text-xs mt-0.5">
                {connected
                  ? <span className="text-green-400">✓ Connected</span>
                  : <span className="text-gray-500">{platform.authType === "oauth" ? "OAuth" : "API Key"}</span>}
              </p>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: selected.color }}>
                {selected.name[0]}
              </div>
              <div>
                <h3 className="text-white font-semibold">Connect {selected.name}</h3>
                <p className="text-gray-400 text-sm">{selected.authType === "oauth" ? "Redirects to " + selected.name : "Enter your credentials"}</p>
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
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                      />
                    </div>
                  ))}

                  {selected.authType === "oauth" && (
                    <div className="bg-violet-950/30 border border-violet-800/40 rounded-xl px-4 py-3 text-sm text-violet-300">
                      You'll be redirected to {selected.name} to authorize access.
                    </div>
                  )}

                  {error && <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
                  {success && <div className="bg-green-950 border border-green-800 rounded-xl px-4 py-3 text-green-400 text-sm">{success}</div>}

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl border border-gray-700 transition text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 text-white font-medium rounded-xl transition text-sm disabled:opacity-50 cursor-pointer"
                      style={{ backgroundColor: selected.color }}
                    >
                      {isSubmitting ? "Connecting..." : selected.authType === "oauth" ? "Authorize →" : "Connect"}
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