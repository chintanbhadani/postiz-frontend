"use client";
import { useEffect, useState } from "react";
import { postsApi, integrationsApi } from "../../../lib/api";
import { useAuth } from "../../../context/auth.context";
import Link from "next/link";
import { Grid2x2 as Grid, List as ListIcon, Calendar as CalendarIcon, Plus, Globe, Tag, MoveVertical as MoreVertical, Check, X, Trash2, TriangleAlert as AlertTriangle, Film, BookOpen, ArrowRight, Settings, Clock, ChevronLeft, ChevronRight, ThumbsUp, MessageCircle, Activity, Eye, Share2, Bookmark, BarChart3, Pin, MessageSquare, MoreHorizontal, ExternalLink } from "lucide-react";

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
  QUEUE: "bg-[var(--secondary-dim)] text-[var(--secondary)] border border-[var(--secondary-dim)]",
  POSTED: "bg-[rgba(52,211,153,0.1)] text-[#34d399] border border-[rgba(52,211,153,0.2)]",
  ERROR: "bg-[rgba(248,113,113,0.1)] text-[#f87171] border border-[rgba(248,113,113,0.2)]",
  DRAFT: "bg-[var(--tertiary)] text-[var(--text-secondary)] border border-[var(--border)]",
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
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showToast, setShowToast] = useState(true);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Padding from previous month
    const startingDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currDate = new Date(year, month, i);
      days.push({ date: currDate, isCurrentMonth: true });
    }
    
    // Padding for next month to complete 6 rows (42 cells) or 5 rows (35 cells)
    const remainingCells = (days.length > 35) ? 42 - days.length : 35 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const handlePrevMonth = () => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  const handleToday = () => setCurrentMonthDate(new Date());

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
        return [];
      case "sent":
        return posts.filter((p) => p.state === "POSTED" || p.state === "ERROR");
      default:
        return posts;
    }
  };

  const filteredPosts = getFilteredPosts();
  const groups = groupByDate(filteredPosts);

  const queueCount = posts.filter(p => p.state === "QUEUE").length;
  const draftsCount = posts.filter(p => p.state === "DRAFT").length;
  const approvalsCount = 0; // Approvals is currently an upsell tab
  const sentCount = posts.filter(p => p.state === "POSTED" || p.state === "ERROR").length;

  const tabs = [
    { id: "queue", label: "Queue", count: queueCount },
    { id: "drafts", label: "Drafts", count: draftsCount },
    { id: "approvals", label: "Approvals", count: approvalsCount },
    { id: "sent", label: "Sent", count: sentCount },
  ] as const;

  console.log(" main page ...");
  

  return (
    <div className="px-8 pb-8 pt-2 max-w-6xl mx-auto">

      {/* Toast Saved Alert */}
      {/* {showToast && (
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 bg-[var(--secondary-dim)] border border-[var(--border-hover)] text-[var(--primary)] px-4 py-2 rounded-full backdrop-blur-[12px] text-xs font-semibold">
            <Check size={14} className="text-[var(--secondary)]" />
            <span>Great! Your preferences have been saved</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )} */}

      {/* Header Profile & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

        {/* Dashboard Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--natural)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shadow-sm">
            <Grid size={16} />
          </div>
          <h1 className="text-xl font-bold text-[var(--primary)]">All Channels</h1>
          <button className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors ml-1">
            <MoreVertical size={16} />
          </button>
        </div>

        {/* View Selectors & Add New */}
        <div className="flex items-center gap-3 self-end sm:self-auto">

          {/* Layout Mode buttons - Glass capsule */}
          <div className="flex items-center bg-[var(--natural)] border border-[var(--border)] rounded-full shadow-sm p-1">
            <button 
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${viewMode === "list" ? "bg-[var(--secondary-dim)] text-[var(--secondary)]" : "text-[var(--text-muted)] hover:text-[var(--primary)]"}`}
            >
              <ListIcon size={14} />
              <span>List</span>
            </button>
            <button 
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${viewMode === "calendar" ? "bg-[var(--secondary-dim)] text-[var(--secondary)]" : "text-[var(--text-muted)] hover:text-[var(--primary)]"}`}
            >
              <CalendarIcon size={14} />
              <span>Calendar</span>
            </button>
          </div>

          {/* New Post Button */}
          <Link
            href="/create"
            className="bg-[var(--secondary)] hover:bg-[var(--secondary-light)] text-[var(--btn-primary-text)] font-bold px-5 py-2 rounded-full text-xs flex items-center gap-1.5 transition-colors shadow-[0_2px_10px_var(--shadow-rose)] hover:shadow-[0_4px_16px_var(--shadow-md)]"
          >
            <Plus size={14} strokeWidth={3} />
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
      <div className="border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-3">

        {/* Tabs */}
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 -mb-3 text-[15px] font-bold transition-all border-b-2 ${activeTab === tab.id
                ? "text-[var(--primary)] border-[var(--primary)]"
                : "text-[var(--primary)] border-transparent hover:text-[var(--secondary)]"
              }`}
            >
              <span className="capitalize">{tab.label}</span>
              <span className="px-1.5 py-0.5 bg-[var(--natural)] text-[var(--text-secondary)] text-[10px] font-bold rounded border border-[var(--border)]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters and Timezone */}
        <div className="flex items-center gap-1 self-end md:self-auto text-[var(--primary)] text-[15px] font-bold">
          
          {/* Channels Dropdown */}
          <div className="relative flex items-center group">
            <Grid size={15} className="absolute left-2.5 text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors" />
            <select className="pl-8 pr-8 py-1.5 bg-transparent appearance-none hover:text-[var(--secondary)] transition-colors cursor-pointer outline-none font-bold text-[14px] border border-transparent hover:border-[var(--border)] hover:bg-[var(--natural)] rounded-lg focus:border-[var(--border-hover)]">
              <option value="all" className="bg-[var(--main-background)] text-[var(--primary)]">All Channels</option>
              {integrations.map(int => (
                <option key={int.id} value={int.id} className="bg-[var(--main-background)] text-[var(--primary)]">
                  {int.name}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 text-[9px] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">▼</span>
          </div>

          {/* Tags Dropdown */}
          <div className="relative flex items-center group">
            <Tag size={15} className="absolute left-2.5 text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors" />
            <select className="pl-8 pr-8 py-1.5 bg-transparent appearance-none hover:text-[var(--secondary)] transition-colors cursor-pointer outline-none font-bold text-[14px] border border-transparent hover:border-[var(--border)] hover:bg-[var(--natural)] rounded-lg focus:border-[var(--border-hover)]">
              <option value="all" className="bg-[var(--main-background)] text-[var(--primary)]">All Tags</option>
            </select>
            <span className="absolute right-2.5 text-[10px] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">▼</span>
          </div>

          {/* Timezone Dropdown */}
          <div className="relative flex items-center group">
            <Globe size={15} className="absolute left-2.5 text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors" />
            <select className="pl-8 pr-8 py-1.5 max-w-[120px] truncate bg-transparent appearance-none hover:text-[var(--secondary)] transition-colors cursor-pointer outline-none font-bold text-[14px] border border-transparent hover:border-[var(--border)] hover:bg-[var(--natural)] rounded-lg focus:border-[var(--border-hover)]">
              <option value={timeZone} className="bg-[var(--main-background)] text-[var(--primary)]">{cleanTimeZone}</option>
              <option value="America/New_York" className="bg-[var(--main-background)] text-[var(--primary)]">New York</option>
              <option value="Europe/London" className="bg-[var(--main-background)] text-[var(--primary)]">London</option>
              <option value="Asia/Tokyo" className="bg-[var(--main-background)] text-[var(--primary)]">Tokyo</option>
              <option value="Australia/Sydney" className="bg-[var(--main-background)] text-[var(--primary)]">Sydney</option>
            </select>
            <span className="absolute right-2.5 text-[9px] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">▼</span>
          </div>

        </div>

      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          {loading ? (
            <div className="flex items-center justify-center py-20 card border border-[var(--border)] rounded-2xl backdrop-blur-[12px]">
              <div className="w-8 h-8 border-2 border-[var(--secondary)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : viewMode === "calendar" ? (
            <div className="card border border-[var(--border)] rounded-2xl bg-[var(--natural)] overflow-hidden shadow-sm">
              
              {/* Calendar Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--main-background)]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-[var(--secondary-dim)] rounded-lg text-[var(--text-muted)] hover:text-[var(--secondary)] transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-[var(--secondary-dim)] rounded-lg text-[var(--text-muted)] hover:text-[var(--secondary)] transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--primary)]">
                    {currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <button onClick={handleToday} className="px-3 py-1.5 text-xs font-bold bg-[var(--natural)] border border-[var(--border)] hover:bg-[var(--tertiary)] hover:text-[var(--primary)] rounded-lg transition-colors text-[var(--text-secondary)] shadow-xs">
                    Today
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors card border border-[var(--border)] rounded-xl bg-[var(--natural)] shadow-xs">
                    <span>Month</span>
                    <span className="text-[10px]">▼</span>
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--main-background)]">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <div key={day} className="py-3 text-center text-xs font-bold text-[var(--text-muted)]">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 bg-[var(--border)] gap-px border-l border-[var(--border)]">
                {getDaysInMonth(currentMonthDate).map((dayObj, i) => {
                  const dateStr = dayObj.date.toLocaleDateString("en-CA"); // local YYYY-MM-DD
                  
                  // Filter posts for this specific date string in local time
                  const dayPosts = filteredPosts.filter(p => new Date(p.publishDate).toLocaleDateString("en-CA") === dateStr);

                  return (
                    <div key={i} className={`min-h-[140px] p-2 bg-[var(--natural)] hover:bg-[var(--tertiary)] transition-colors group ${!dayObj.isCurrentMonth ? 'opacity-60 bg-[var(--main-background)]' : ''}`}>
                      <div className={`text-xs font-bold mb-2 w-7 h-7 flex items-center justify-center rounded-full ${
                        dateStr === new Date().toLocaleDateString("en-CA") 
                          ? 'bg-[var(--secondary)] text-white shadow-[var(--shadow-rose)]' 
                          : 'text-[var(--text-secondary)] group-hover:text-[var(--primary)]'
                      }`}>
                        {dayObj.date.getDate()}
                      </div>
                      
                      <div className="space-y-1.5">
                        {dayPosts.map(post => {
                          const platform = post.integration?.platform || "x";
                          return (
                            <div key={post.id} className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[10px] cursor-pointer hover:shadow-md transition-all truncate ${STATE_STYLES[post.state] || STATE_STYLES.DRAFT}`}>
                              <div
                                className="w-4 h-4 rounded flex items-center justify-center text-white text-[8px] font-black uppercase flex-shrink-0"
                                style={{ backgroundColor: PLATFORM_COLORS[platform] || "#6b7280" }}
                              >
                                {platform[0]}
                              </div>
                              <span className="font-bold flex-shrink-0 truncate">
                                {new Date(post.publishDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <span className="truncate opacity-80 text-[9px] font-medium hidden 2xl:inline-block">
                                {post.content}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeTab === "approvals" ? (
            <div className="card border border-[var(--border)] rounded-2xl p-10 bg-[var(--natural)] shadow-sm flex flex-col md:flex-row gap-10">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Collaboration made easy</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                  Say goodbye to the hassle of managing multiple social media channels with multiple team mates. With our collaboration features, you can:
                </p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    "Choose who can post on each of your social media channels",
                    "Review posts for quality and brand before hitting publish",
                    "Collaborate on ideas",
                    "Stay on top of performance with automated reports"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--secondary-dim)] flex items-center justify-center text-[var(--secondary)] flex-shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm text-[var(--text-secondary)] font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/billing" className="bg-[var(--secondary)] text-[var(--btn-primary-text)] hover:bg-[var(--secondary-light)] font-bold px-6 py-2.5 rounded-lg text-sm inline-block transition-colors shadow-sm">
                  Start a Free Trial
                </Link>
              </div>
              
              <div className="flex-1 hidden md:flex items-center justify-center relative min-h-[300px]">
                {/* Decorative Mockup UI elements to mimic screenshot */}
                <div className="absolute top-10 right-4 bg-[var(--main-background)] border border-[var(--border)] rounded-full px-4 py-2 shadow-md flex items-center gap-2 z-20">
                  <div className="w-6 h-6 rounded-full bg-[var(--secondary-dim)] flex items-center justify-center text-[10px]">👩🏽</div>
                  <span className="text-[10px] text-[var(--text-secondary)] font-medium">This image looks so good! 😍</span>
                </div>
                
                <div className="bg-[var(--main-background)] border border-[var(--border)] rounded-xl w-64 h-40 shadow-sm relative z-10 p-4">
                  <div className="w-12 h-2 bg-[var(--border)] rounded mb-3"></div>
                  <div className="w-24 h-2 bg-[var(--border)] rounded mb-2"></div>
                  <div className="w-20 h-2 bg-[var(--border)] rounded mb-4"></div>
                  <div className="w-16 h-6 bg-[var(--border)] rounded-full"></div>
                  <div className="absolute right-4 top-4 w-16 h-16 bg-[var(--secondary-dim)] rounded-lg"></div>
                </div>
                
                <div className="absolute -bottom-4 right-10 z-20">
                  <div className="bg-[var(--secondary)] text-[var(--btn-primary-text)] font-bold px-8 py-3 rounded-full shadow-[0_4px_16px_var(--shadow-rose)] cursor-pointer hover:scale-105 transition-transform">
                    Approve
                  </div>
                </div>

                <div className="absolute bottom-12 left-0 bg-[var(--main-background)] border border-[var(--border)] rounded-full px-4 py-2 shadow-md flex items-center gap-2 z-20">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">👨🏻</div>
                  <span className="text-[10px] text-[var(--text-secondary)] font-medium">Good to go! 🚀</span>
                </div>
              </div>
            </div>
          ) : Object.keys(groups).length === 0 ? (

            activeTab === "queue" ? (
              <div className="space-y-6">

                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">
                  Tomorrow, {new Date(Date.now() + 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </h3>

                <div className="flex items-start">

                  <div className="w-16 text-right pr-4 text-xs font-bold text-[var(--text-muted)] pt-3">
                    8:02 PM
                  </div>

                  <div className="relative flex flex-col items-center w-8 pt-3.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--secondary)] border-2 border-[var(--main-background)] z-10 shadow-[var(--shadow-rose)]" />
                    <div className="absolute top-6 bottom-0 w-0.5 bg-[var(--border)]" />
                  </div>

                  <div className="flex-1 pb-4">
                    <Link
                      href="/create"
                      className="group/slot flex items-center justify-between card border border-dashed border-[var(--border)] hover:border-[var(--secondary)] rounded-xl p-5 transition-all cursor-pointer backdrop-blur-[12px]"
                    >
                      <div className="text-xs text-[var(--text-secondary)] font-medium group-hover/slot:text-[var(--secondary)] transition-colors leading-relaxed">
                        <span className="font-bold text-[var(--primary)]">+ Great time to post!</span> Create a{" "}
                        <span className="underline decoration-1 underline-offset-2 decoration-[var(--secondary)]">new post</span> or{" "}
                        <span className="underline decoration-1 underline-offset-2 decoration-[var(--secondary)]">start with a template</span>.
                      </div>
                      <ArrowRight size={14} className="text-[var(--text-muted)] group-hover/slot:text-[var(--secondary)] group-hover/slot:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>

                    <button className="text-[10px] text-[var(--text-muted)] hover:text-[var(--secondary)] transition-colors font-bold mt-3 ml-1">
                      + More Recommended Times
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-20 card border border-[var(--border)] rounded-2xl backdrop-blur-[12px]">
                <div className="text-4xl mb-3 opacity-40">📭</div>
                <h4 className="text-sm font-bold text-[var(--primary)] capitalize">No {activeTab} posts</h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs mx-auto">
                  {activeTab === "drafts" && "Jot down your thoughts and schedule them later."}
                  {activeTab === "sent" && "Once you publish post updates, they will appear in this tab."}
                </p>
                {activeTab !== "sent" && (
                  <Link href="/create" className="btn-primary mt-4 inline-block px-4 py-2 text-xs">
                    Create new post
                  </Link>
                )}
              </div>
            )
          ) : (
            <div className="space-y-8 max-w-4xl">
              {Object.entries(groups).map(([date, datePosts], grpIdx) => (
                <div key={date}>

                  <h3 className={`text-sm uppercase tracking-widest mb-4 font-bold ${activeTab === "sent" ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`}>
                    {activeTab === "sent" ? new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase() : getSmartDateHeading(date)}
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

                          <div className="w-20 text-right pr-4 pt-4 flex-shrink-0">
                            <div className="text-xs font-bold text-[var(--text-muted)]">{publishTime}</div>
                            {(post.state === "POSTED" || activeTab === "sent") && (
                              <div className="flex items-center justify-end gap-1 text-[10px] text-[var(--text-muted)] font-medium mt-1">
                                <Pin size={10} className="rotate-45" />
                                <span>Custom</span>
                              </div>
                            )}
                          </div>

                          {activeTab !== "sent" && (
                            <div className="relative flex flex-col items-center w-8 pt-4.5 flex-shrink-0">
                              <div className="w-2.5 h-2.5 rounded-full bg-[var(--secondary)] border-2 border-[var(--main-background)] z-10 shadow-[var(--shadow-rose)]" />
                              {!(grpIdx === Object.keys(groups).length - 1 && idx === datePosts.length - 1) && (
                                <div className="absolute top-7 bottom-0 w-0.5 bg-[var(--border)]" />
                              )}
                            </div>
                          )}

                          {/* Post Card */}
                          <div className={`flex-1 min-w-0 ${activeTab !== "sent" ? "pb-6" : "pb-4"}`}>
                            {(post.state === "POSTED" || activeTab === "sent") ? (
                              <div className="card border border-[var(--border)] rounded-xl bg-[var(--main-background)] overflow-hidden shadow-sm relative group flex flex-col">
                                
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-black uppercase flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: PLATFORM_COLORS[platform] || "#6b7280" }}>
                                      {/* Mock Avatar */}
                                      {platform[0]}
                                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center text-[6px]" style={{ backgroundColor: PLATFORM_COLORS[platform] || "#6b7280" }}>
                                        {platform[0]}
                                      </div>
                                    </div>
                                    <span className="text-sm font-bold text-[var(--primary)]">{post.integration?.name || "Connected Profile"}</span>
                                  </div>
                                  <button className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors p-1 border border-[var(--border)] rounded-md hover:bg-[var(--natural)] shadow-xs">
                                    <MessageSquare size={14} />
                                  </button>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex gap-4 min-h-[100px] flex-col">
                                  <div className="flex-1">
                                    <p className="text-[15px] text-[var(--primary)] font-medium leading-relaxed whitespace-pre-wrap">
                                      {post.content}
                                    </p>
                                  </div>
                                  
                                  {/* Error block for failed posts in Sent tab */}
                                  {post.error && (
                                    <div className="bg-[rgba(248,113,113,0.05)] border border-[rgba(248,113,113,0.15)] rounded-lg p-3">
                                      <div className="flex items-center gap-2 text-[#f87171] mb-1">
                                        <AlertTriangle size={14} />
                                        <span className="text-xs font-bold">Failed to publish</span>
                                      </div>
                                      <p className="text-[11px] text-[#f87171] opacity-90">{post.error}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Metrics */}
                                <div className="grid grid-cols-6 border-t border-[var(--border)] bg-[var(--natural)] p-4 gap-4 relative">
                                  {[
                                    { icon: ThumbsUp, label: "Reactions", val: "0" },
                                    { icon: MessageCircle, label: "Comments", val: "0" },
                                    { icon: Activity, label: "Eng. Rate", val: "0%" },
                                    { icon: Eye, label: "Views", val: "0" },
                                    { icon: Share2, label: "Shares", val: "0" },
                                    { icon: Bookmark, label: "Saves", val: "0" },
                                  ].map((m, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                      <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                                        <m.icon size={12} />
                                        <span className="text-[10px] font-bold truncate hidden sm:block">{m.label}</span>
                                      </div>
                                      <span className="text-xs font-bold text-[var(--primary)]">{m.val}</span>
                                    </div>
                                  ))}
                                  <div className="absolute right-4 top-4">
                                    <button className="p-1.5 border border-[var(--border)] rounded-md text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--main-background)] bg-[var(--natural)] shadow-xs transition-colors">
                                      <BarChart3 size={14} />
                                    </button>
                                  </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between p-3 border-t border-[var(--border)] bg-[var(--natural)]">
                                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-medium">
                                    Published via <span className="capitalize">{platform}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <a
                                      href={post.releaseUrl || "#"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] rounded-md text-[11px] font-bold text-[var(--primary)] hover:bg-[var(--main-background)] transition-colors shadow-xs"
                                    >
                                      <ExternalLink size={12} />
                                      Go to post
                                    </a>
                                    <button className="p-1.5 border border-[var(--border)] rounded-md text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--main-background)] bg-[var(--natural)] transition-colors shadow-xs">
                                      <MoreHorizontal size={14} />
                                    </button>
                                  </div>
                                </div>

                              </div>
                            ) : (
                              <div className="card border border-[var(--border)] rounded-xl p-4 hover:border-[var(--border-hover)] transition duration-150 backdrop-blur-[12px] relative group flex flex-col gap-2">

                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div
                                      className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--primary)] text-[10px] font-black uppercase flex-shrink-0"
                                      style={{ backgroundColor: PLATFORM_COLORS[platform] || "#6b7280" }}
                                    >
                                      {platform[0]}
                                    </div>
                                    <div className="min-w-0">
                                      <span className="text-xs font-bold text-[var(--primary)] truncate block">
                                        {post.integration?.name || "Connected Profile"}
                                      </span>
                                    </div>
                                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase border tracking-wider ${STATE_STYLES[post.state] || STATE_STYLES.DRAFT}`}>
                                      {post.state}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => deletePost(post.id)}
                                    className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-400 transition p-1 hover:bg-[rgba(248,113,113,0.05)] rounded-lg flex-shrink-0 focus:opacity-100"
                                    title="Delete post"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>

                                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed break-words whitespace-pre-wrap">
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
                                    className="text-[10px] font-bold text-[var(--secondary)] hover:text-[var(--secondary)] inline-flex items-center gap-0.5 mt-1 self-start"
                                  >
                                    <span>View post</span>
                                    <ArrowRight size={10} />
                                  </a>
                                )}

                              </div>
                            )}
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

      </div>

    </div>
  );
}
