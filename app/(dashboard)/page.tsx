"use client";
import { useEffect, useState } from "react";
import { postsApi, integrationsApi } from "../../lib/api";
import { useAuth } from "../../context/auth.context";
import Link from "next/link";
import { Grid2x2 as Grid, List as ListIcon, Calendar as CalendarIcon, Plus, Globe, Tag, MoveVertical as MoreVertical, Check, X, Trash2, TriangleAlert as AlertTriangle, Film, BookOpen, ArrowRight, Settings, Clock } from "lucide-react";

const PLATFORM_COLORS: Record<string, string> = {
  twitter: "#1da1f2",
  x: "#1da1f2",
  linkedin: "#0077b5",
  facebook: "#1877f2",
  instagram: "#e1306c",
  youtube: "#ff0000",
  tiktok: "#000000",
  bluesky: "#0085ff",
  threads: "#101010",
  reddit: "#ff4500",
  discord: "#5865f2",
  slack: "#4a154b",
  telegram: "#0088cc",
  mastodon: "#6364ff",
  medium: "#000000",
  devto: "#0a0a0a",
  hashnode: "#2962ff",
  wordpress: "#21759b",
  pinterest: "#e60023",
};

const STATE_STYLES: Record<string, string> = {
  QUEUE: "bg-[rgba(99,102,241,0.1)] text-[#818cf8] border border-[rgba(99,102,241,0.2)]",
  POSTED: "bg-[rgba(52,211,153,0.1)] text-[#34d399] border border-[rgba(52,211,153,0.2)]",
  ERROR: "bg-[rgba(248,113,113,0.1)] text-[#f87171] border border-[rgba(248,113,113,0.2)]",
  DRAFT: "bg-[rgba(255,255,255,0.03)] text-gray-400 border border-white/[0.05]",
};

function groupByDate(posts: any[]) {
  const groups: Record<string, any[]> = {};
  posts.forEach((p) => {
    const date = new Date(p.publishDate).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(p);
  });
  return groups;
}

function getSmartDateHeading(dateStr: string) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  };

  const todayStr = today.toLocaleDateString("en-US", options);
  const tomorrowStr = tomorrow.toLocaleDateString("en-US", options);

  if (dateStr === todayStr) {
    return "Today, " + today.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (dateStr === tomorrowStr) {
    return "Tomorrow, " + tomorrow.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const parsedDate = new Date(dateStr);
  if (parsedDate.getFullYear() === today.getFullYear()) {
    return parsedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }
  return dateStr;
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"queue" | "drafts" | "approvals" | "sent">("queue");
  const [showToast, setShowToast] = useState(true);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Kolkata";
  const cleanTimeZone = timeZone.split("/").pop()?.replace("_", " ") || "Kolkata";

  useEffect(() => {
    Promise.all([
      postsApi.list(),
      integrationsApi.list(),
    ])
      .then(([postsRes, intsRes]) => {
        setPosts(postsRes.data);
        setIntegrations(intsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await postsApi.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {}
  };

  const getFilteredPosts = () => {
    switch (activeTab) {
      case "queue":
        return posts.filter((p) => p.state === "QUEUE");
      case "drafts":
        return posts.filter((p) => p.state === "DRAFT");
      case "approvals":
        return posts.filter((p) => p.state === "ERROR");
      case "sent":
        return posts.filter((p) => p.state === "POSTED");
      default:
        return posts;
    }
  };

  const filteredPosts = getFilteredPosts();
  const groups = groupByDate(filteredPosts);

  const queueCount = posts.filter(p => p.state === "QUEUE").length;
  const draftsCount = posts.filter(p => p.state === "DRAFT").length;
  const approvalsCount = posts.filter(p => p.state === "ERROR").length;
  const sentCount = posts.filter(p => p.state === "POSTED").length;

  const tabs = [
    { id: "queue", label: "Queue", count: queueCount },
    { id: "drafts", label: "Drafts", count: draftsCount },
    { id: "approvals", label: "Approvals", count: approvalsCount },
    { id: "sent", label: "Sent", count: sentCount },
  ] as const;

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Toast Saved Alert */}
      {showToast && (
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 bg-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.15)] text-gray-200 px-4 py-2 rounded-full backdrop-blur-[12px] text-xs font-semibold">
            <Check size={14} className="text-[#6366f1]" />
            <span>Great! Your preferences have been saved</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Header Profile & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

        {/* User Account Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[rgba(99,102,241,0.15)] text-[#6366f1] flex items-center justify-center font-black text-lg border border-[rgba(99,102,241,0.2)] uppercase shadow-[0_0_12px_rgba(99,102,241,0.15)]">
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-1">
              <span>{user?.name?.toLowerCase().replace(/\s+/g, '') || "user"}</span>
              <Settings size={13} className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors ml-1" />
            </h2>
            <button className="text-[10px] text-gray-500 hover:text-[#818cf8] font-bold transition-colors">
              + Set a posting goal
            </button>
          </div>
        </div>

        {/* View Selectors & Add New */}
        <div className="flex items-center gap-3 self-end sm:self-auto">

          {/* Layout Mode buttons - Glass capsule */}
          <div className="flex items-center border border-white/[0.05] rounded-xl bg-[rgba(15,23,42,0.35)] backdrop-blur-[12px] p-0.5">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:text-white rounded-lg transition-colors">
              <Grid size={13} />
              <span>Grid</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-[rgba(99,102,241,0.1)] text-white rounded-lg border border-[rgba(99,102,241,0.2)] transition-colors">
              <ListIcon size={13} />
              <span>List</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:text-white rounded-lg transition-colors">
              <CalendarIcon size={13} />
              <span>Calendar</span>
            </button>
          </div>

          {/* New Post Button */}
          <Link
            href="/create"
            className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e6] text-white font-bold text-[11px] rounded-xl transition-all border border-[rgba(99,102,241,0.3)] flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.35)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span>New Post</span>
          </Link>

        </div>
      </div>

      {/* Warning if no channels connected */}
      {integrations.length === 0 && (
        <div className="bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.15)] rounded-xl p-4 mb-6 flex items-center gap-3 backdrop-blur-[12px]">
          <AlertTriangle className="text-amber-400 flex-shrink-0" size={20} />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-amber-300">No channels connected</h4>
            <p className="text-xs text-amber-400/70 mt-0.5">
              Please <Link href="/channels" className="underline font-bold hover:text-amber-300">connect a social account</Link> to start scheduling and publishing posts.
            </p>
          </div>
        </div>
      )}

      {/* Sub-navigation Tabs & Filters Row */}
      <div className="border-b border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

        {/* Tabs */}
        <div className="flex gap-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === tab.id
                ? "text-white border-b-2 border-[#6366f1] font-bold"
                : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="capitalize">{tab.label}</span>
              <span className="ml-1.5 px-1.5 py-0.2 bg-[rgba(255,255,255,0.03)] text-gray-400 text-[10px] font-bold rounded-full border border-white/[0.05]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters and Timezone */}
        <div className="flex items-center gap-2 self-end md:self-auto pb-2 md:pb-0">
          <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors bg-[rgba(15,23,42,0.35)] border border-white/[0.05] rounded-xl backdrop-blur-[8px]">
            <Tag size={12} className="text-gray-500" />
            <span>Tags</span>
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors bg-[rgba(15,23,42,0.35)] border border-white/[0.05] rounded-xl backdrop-blur-[8px]">
            <Globe size={12} className="text-gray-500" />
            <span className="truncate max-w-[80px]">{cleanTimeZone}</span>
          </button>
          <button className="p-1.5 text-gray-500 hover:text-white transition-colors bg-[rgba(15,23,42,0.35)] border border-white/[0.05] rounded-xl backdrop-blur-[8px]">
            <MoreVertical size={13} />
          </button>
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Timeline Area */}
        <div className="flex-1 w-full">
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-[rgba(15,23,42,0.35)] border border-white/[0.05] rounded-2xl backdrop-blur-[12px]">
              <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : Object.keys(groups).length === 0 ? (

            activeTab === "queue" ? (
              <div className="space-y-6">

                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Tomorrow, {new Date(Date.now() + 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </h3>

                <div className="flex items-start">

                  <div className="w-16 text-right pr-4 text-xs font-bold text-gray-500 pt-3">
                    8:02 PM
                  </div>

                  <div className="relative flex flex-col items-center w-8 pt-3.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#6366f1] border-2 border-[#030712] z-10 shadow-[0_0_6px_rgba(99,102,241,0.4)]" />
                    <div className="absolute top-6 bottom-0 w-0.5 bg-white/[0.03]" />
                  </div>

                  <div className="flex-1 pb-4">
                    <Link
                      href="/create"
                      className="group/slot flex items-center justify-between bg-[rgba(15,23,42,0.35)] border border-dashed border-white/[0.08] hover:border-[#6366f1] rounded-xl p-5 transition-all cursor-pointer backdrop-blur-[12px]"
                    >
                      <div className="text-xs text-gray-400 font-medium group-hover/slot:text-[#818cf8] transition-colors leading-relaxed">
                        <span className="font-bold text-white">+ Great time to post!</span> Create a{" "}
                        <span className="underline decoration-1 underline-offset-2 decoration-[#6366f1]/50">new post</span> or{" "}
                        <span className="underline decoration-1 underline-offset-2 decoration-[#6366f1]/50">start with a template</span>.
                      </div>
                      <ArrowRight size={14} className="text-gray-600 group-hover/slot:text-[#6366f1] group-hover/slot:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    <button className="text-[10px] text-gray-500 hover:text-[#818cf8] transition-colors font-bold mt-3 ml-1">
                      + More Recommended Times
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-20 bg-[rgba(15,23,42,0.35)] border border-white/[0.05] rounded-2xl backdrop-blur-[12px]">
                <div className="text-4xl mb-3 opacity-40">📭</div>
                <h4 className="text-sm font-bold text-white capitalize">No {activeTab} posts</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  {activeTab === "drafts" && "Jot down your thoughts and schedule them later."}
                  {activeTab === "approvals" && "All clear! There are no failed posts or items requiring approval."}
                  {activeTab === "sent" && "Once you publish post updates, they will appear in this tab."}
                </p>
                {activeTab !== "sent" && (
                  <Link href="/create" className="mt-4 inline-block px-4 py-2 bg-[#6366f1] hover:bg-[#5558e6] text-white text-xs font-semibold rounded-xl transition-colors shadow-[0_0_15px_rgba(99,102,241,0.35)]">
                    Create new post
                  </Link>
                )}
              </div>
            )
          ) : (

            <div className="space-y-8">
              {Object.entries(groups).map(([date, datePosts], grpIdx) => (
                <div key={date}>

                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                    {getSmartDateHeading(date)}
                  </h3>

                  <div className="space-y-0">
                    {datePosts.map((post, idx) => {
                      const platform = post.integration?.platform || "x";
                      const publishTime = new Date(post.publishDate).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div key={post.id} className="flex items-start">

                          <div className="w-16 text-right pr-4 text-xs font-bold text-gray-500 pt-4 flex-shrink-0">
                            {publishTime}
                          </div>

                          <div className="relative flex flex-col items-center w-8 pt-4.5 flex-shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#6366f1] border-2 border-[#030712] z-10 shadow-[0_0_6px_rgba(99,102,241,0.4)]" />
                            {!(grpIdx === Object.keys(groups).length - 1 && idx === datePosts.length - 1) && (
                              <div className="absolute top-7 bottom-0 w-0.5 bg-white/[0.03]" />
                            )}
                          </div>

                          {/* Post Card - Glass */}
                          <div className="flex-1 pb-6 min-w-0">
                            <div className="bg-[rgba(15,23,42,0.35)] border border-white/[0.05] rounded-xl p-4 hover:border-[rgba(99,102,241,0.15)] transition duration-150 backdrop-blur-[12px] relative group flex flex-col gap-2">

                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-black uppercase flex-shrink-0"
                                    style={{ backgroundColor: PLATFORM_COLORS[platform] || "#6b7280" }}
                                  >
                                    {platform[0]}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-xs font-bold text-gray-200 truncate block">
                                      {post.integration?.name || "Connected Profile"}
                                    </span>
                                  </div>
                                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase border tracking-wider ${STATE_STYLES[post.state] || STATE_STYLES.DRAFT}`}>
                                    {post.state}
                                  </span>
                                </div>

                                <button
                                  onClick={() => deletePost(post.id)}
                                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition p-1 hover:bg-[rgba(248,113,113,0.05)] rounded-lg flex-shrink-0 focus:opacity-100"
                                  title="Delete post"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              <p className="text-xs text-gray-300 font-medium leading-relaxed break-words whitespace-pre-wrap">
                                {post.content}
                              </p>

                              {post.error && (
                                <p className="text-[10px] font-semibold text-[#f87171] bg-[rgba(248,113,113,0.05)] px-2 py-1 rounded border border-[rgba(248,113,113,0.15)] mt-1">
                                  Error: {post.error}
                                </p>
                              )}

                              {post.releaseUrl && (
                                <a
                                  href={post.releaseUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-bold text-[#818cf8] hover:text-[#6366f1] inline-flex items-center gap-0.5 mt-1 self-start"
                                >
                                  <span>View post</span>
                                  <ArrowRight size={10} />
                                </a>
                              )}

                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>

          )}
        </div>

        {/* Side Panel - Glass recommendation cards */}
        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">

          {/* Suggestion Card 1 */}
          <div className="bg-[rgba(15,23,42,0.35)] border border-white/[0.05] rounded-xl p-4.5 backdrop-blur-[12px] relative overflow-hidden group hover:border-[rgba(99,102,241,0.1)] transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(245,158,11,0.1)] text-amber-400 flex items-center justify-center flex-shrink-0">
                <Film size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Behind the Scenes</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  Show how something you care about gets made or done. Transparency builds trust!
                </p>
                <Link
                  href="/create"
                  className="text-[10px] text-[#818cf8] hover:text-[#6366f1] font-bold mt-2.5 inline-flex items-center gap-0.5"
                >
                  <span>Create post</span>
                  <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>

          {/* Suggestion Card 2 */}
          <div className="bg-[rgba(15,23,42,0.35)] border border-white/[0.05] rounded-xl p-4.5 backdrop-blur-[12px] relative overflow-hidden group hover:border-[rgba(99,102,241,0.1)] transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(99,102,241,0.1)] text-[#818cf8] flex items-center justify-center flex-shrink-0">
                <BookOpen size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Struggle to create?</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] flex-shrink-0 shadow-[0_0_6px_rgba(99,102,241,0.4)]" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  Try writing short, rough thoughts and saving them as drafts. You can polish them later!
                </p>
                <Link
                  href="/create"
                  className="text-[10px] text-[#818cf8] hover:text-[#6366f1] font-bold mt-2.5 inline-flex items-center gap-0.5"
                >
                  <span>Write a draft</span>
                  <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
