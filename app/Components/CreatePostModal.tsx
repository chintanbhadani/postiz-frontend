"use client";
import { useEffect, useState } from "react";
import { postsApi, integrationsApi, uploadsApi } from "../../lib/api";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LinkedInPreview } from "./LinkedInPreview";
import { GenericPreview } from "./GenericPreview";
import { InstagramPreview } from "./InstagramPreview";
import { LinkedInSettings } from "./LinkedInSettings";
import { useModal } from "../../context/modal.context";
import { MediaLibraryModal } from "./MediaLibraryModal";

const createPostSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
  integrationIds: Yup.array().min(1, "Please select at least one channel").required("Please select a channel"),
  state: Yup.string().oneOf(["QUEUE", "DRAFT"]).required()
});

export const CreatePostModal = () => {
  const { isCreateModalOpen, closeCreateModal } = useModal();
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [publishAction, setPublishAction] = useState<"NEXT_AVAILABLE" | "PRIORITIZE" | "NOW" | "LATER">("NEXT_AVAILABLE");
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const [activePreviewId, setActivePreviewId] = useState<string>("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const [initialValues, setInitialValues] = useState({
    content: "",
    integrationIds: [] as string[],
    publishDate: "",
    publishTime: "",
    images: [] as string[],
    state: "QUEUE" as "QUEUE" | "DRAFT"
  });

  const [uploading, setUploading] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  useEffect(() => {
    const next = new Date();
    next.setHours(next.getHours() + 1, 0, 0, 0);
    const dateStr = next.toISOString().split("T")[0];
    const timeStr = next.toTimeString().slice(0, 5);

    integrationsApi.list().then((res) => {
      setIntegrations(res.data);
      const defaultIds = res.data.length > 0 ? [res.data[0].id] : [];
      setInitialValues({
        content: "",
        integrationIds: defaultIds,
        publishDate: dateStr,
        publishTime: timeStr,
        images: [],
        state: "QUEUE"
      });
      if (res.data.length > 0) {
        setActivePreviewId(res.data[0].id);
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setError("");
    setSuccess("");
    try {
      let publishDate;
      if (publishAction === "NOW") {
        publishDate = new Date().toISOString();
      } else if (publishAction === "LATER") {
        if (!values.publishDate || !values.publishTime) {
          setError("Date and Time are required for scheduling.");
          setSubmitting(false);
          return;
        }
        publishDate = new Date(`${values.publishDate}T${values.publishTime}`).toISOString();
      } else {
        // NEXT_AVAILABLE or PRIORITIZE - let's set it to either now or next hour as fallback
        const next = new Date();
        next.setHours(next.getHours() + (publishAction === "PRIORITIZE" ? 0 : 1), 0, 0, 0);
        publishDate = next.toISOString();
      }
      
      // Submit post for each selected integration ID
      for (const integrationId of values.integrationIds) {
        await postsApi.create({
          content: values.content,
          integrationId,
          publishDate,
          images: values.images,
          state: values.state,
        });
      }
      
      let successMsg = "Post saved as draft!";
      if (values.state !== "DRAFT") {
        if (publishAction === "NOW") successMsg = "Published successfully!";
        else if (publishAction === "PRIORITIZE") successMsg = "Post prioritized in queue!";
        else if (publishAction === "NEXT_AVAILABLE") successMsg = "Post added to queue!";
        else successMsg = "Post scheduled successfully!";
      }

      setSuccess(successMsg);
      setTimeout(() => {
        closeCreateModal();
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit post");
      setSubmitting(false);
    }
  };

  const PLATFORM_COLORS: Record<string, string> = {
    twitter: "#1da1f2", linkedin: "#0077b5", facebook: "#1877f2",
    instagram: "#e1306c", youtube: "#ff0000", tiktok: "#000000",
    bluesky: "#0085ff", threads: "#101010", reddit: "#ff4500",
  };

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/40 overflow-y-auto">
      <div className="bg-[var(--main-background)] border border-[var(--border)] shadow-2xl rounded-2xl w-full max-w-[92vw] h-[88vh] flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-[var(--border)] gap-4 bg-[var(--main-background)]">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[var(--primary)]">Create Post</h1>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] border border-[var(--border)] rounded-lg bg-[var(--natural)] hover:bg-[var(--tertiary)] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Tags</span>
                <svg className="w-3 h-3 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
            >
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Templates</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
            >
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>AI Assistant</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--secondary-dim)] text-[var(--secondary)] border border-[var(--secondary)]/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Preview</span>
            </button>

            <span className="w-px h-4 bg-[var(--border)] mx-1" />

            <button
              type="button"
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>

            <button
              type="button"
              onClick={closeCreateModal}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {integrations.length === 0 ? (
            <div className="p-8">
              <div className="bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] rounded-2xl p-8 text-center backdrop-blur-[12px]">
                <div className="text-4xl mb-4 opacity-60">🔗</div>
                <p className="text-amber-300 font-medium mb-2">No channels connected</p>
                <p className="text-amber-400/50 text-sm mb-4">Connect at least one social media account first.</p>
                <a href="/channels" className="btn-primary px-4 py-2 text-sm inline-block">
                  Go to Channels
                </a>
              </div>
            </div>
          ) : (
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={createPostSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
                const selectedIntegration = integrations.find((i) => i.id === activePreviewId) || integrations.find((i) => values.integrationIds.includes(i.id)) || integrations[0];
                const isLinkedIn = selectedIntegration?.platform?.toLowerCase() === 'linkedin';
                const isInstagram = selectedIntegration?.platform?.toLowerCase() === 'instagram';

                const formatScheduledLabel = (dateStr: string, timeStr: string) => {
                  if (!dateStr || !timeStr) return "Set Date and Time";
                  try {
                    const d = new Date(`${dateStr}T${timeStr}`);
                    const month = d.toLocaleString('default', { month: 'short' });
                    const day = d.getDate();
                    // Format time to 12 hour AM/PM
                    let [hours, minutes] = timeStr.split(':');
                    let h = parseInt(hours);
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    h = h % 12;
                    h = h ? h : 12; // the hour '0' should be '12'
                    return `${month} ${day}, ${h}:${minutes} ${ampm}`;
                  } catch (e) {
                    return "Set Date and Time";
                  }
                };

                const getActionLabel = (action: string) => {
                  switch (action) {
                    case "NEXT_AVAILABLE": return "Next Available";
                    case "PRIORITIZE": return "Prioritize";
                    case "NOW": return "Now";
                    case "LATER": return formatScheduledLabel(values.publishDate, values.publishTime);
                    default: return "Next Available";
                  }
                };

                const getSubmitButtonLabel = () => {
                  if (values.state === "DRAFT") return "Save as Draft";
                  switch (publishAction) {
                    case "NOW": return "Publish Now";
                    case "LATER": return "Schedule Post";
                    case "PRIORITIZE": return "Prioritize Post";
                    default: return "Customize for each network";
                  }
                };

                return (
                  <Form className="h-full flex flex-col overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
                      
                      {/* Left: Composer (7 columns) */}
                      <div className="lg:col-span-7 p-6 space-y-6 overflow-y-auto h-full border-r border-[var(--border)]">
                        
                        {/* Channel Selector Row */}
                        <div className="flex flex-wrap items-center gap-2">
                          {integrations.map((int) => {
                            const isSelected = values.integrationIds.includes(int.id);
                            const initial = int.name ? int.name[0].toUpperCase() : "?";
                            
                            // Define platform badges
                            let badgeBg = "#6b7280";
                            let badgeText = "P";
                            if (int.platform === "facebook") { badgeBg = "#1877f2"; badgeText = "F"; }
                            else if (int.platform === "linkedin") { badgeBg = "#0077b5"; badgeText = "in"; }
                            else if (int.platform === "instagram") { badgeBg = "#e1306c"; badgeText = "IG"; }
                            else if (int.platform === "twitter") { badgeBg = "#1da1f2"; badgeText = "X"; }
                            else if (int.platform === "youtube") { badgeBg = "#ff0000"; badgeText = "YT"; }

                            return (
                              <button
                                key={int.id}
                                type="button"
                                onClick={() => {
                                  let updatedIds = [...values.integrationIds];
                                  if (isSelected) {
                                    updatedIds = updatedIds.filter((id) => id !== int.id);
                                  } else {
                                    updatedIds.push(int.id);
                                  }
                                  setFieldValue("integrationIds", updatedIds);
                                  setActivePreviewId(int.id);
                                }}
                                className={`relative w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                  isSelected 
                                    ? "ring-2 ring-[var(--secondary)] ring-offset-2 ring-offset-[var(--main-background)] scale-105" 
                                    : "opacity-60 hover:opacity-100"
                                }`}
                                style={{
                                  backgroundColor: PLATFORM_COLORS[int.platform] + "20" || "#ffffff10",
                                  border: isSelected ? "2px solid var(--secondary)" : "1px solid var(--border)",
                                  color: PLATFORM_COLORS[int.platform] || "var(--primary)"
                                }}
                                title={`${int.name} (${int.platform})`}
                              >
                                {int.picture ? (
                                  <img src={int.picture} alt={int.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  <span>{initial}</span>
                                )}
                                {/* Badge */}
                                <div
                                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-[var(--main-background)] flex items-center justify-center text-white"
                                  style={{ backgroundColor: badgeBg }}
                                >
                                  {(() => {
                                    const p = int.platform?.toLowerCase();
                                    if (p === "facebook") {
                                      return (
                                        <svg className="w-2.5 h-2.5 fill-current text-white" viewBox="0 0 24 24">
                                          <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.9.2-1.2 1-1.2h2V2h-3c-3 0-5 1.5-5 4.5V8z" />
                                        </svg>
                                      );
                                    } else if (p === "linkedin") {
                                      return (
                                        <svg className="w-1.5 h-1.5 fill-current text-white" viewBox="0 0 24 24">
                                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                        </svg>
                                      );
                                    } else if (p === "instagram") {
                                      return (
                                        <svg className="w-2.5 h-2.5 stroke-current text-white fill-none" strokeWidth="3" viewBox="0 0 24 24">
                                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                        </svg>
                                      );
                                    } else if (p === "twitter" || p === "x") {
                                      return (
                                        <svg className="w-2 h-2 fill-current text-white" viewBox="0 0 24 24">
                                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                      );
                                    } else if (p === "youtube") {
                                      return (
                                        <svg className="w-2 h-2 fill-current text-white" viewBox="0 0 24 24">
                                          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                        </svg>
                                      );
                                    } else if (p === "tiktok") {
                                      return (
                                        <svg className="w-2 h-2 fill-current text-white" viewBox="0 0 24 24">
                                          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.52-4.06-1.37-.28-.2-.53-.43-.77-.68v6.52c.07 1.8-.4 3.67-1.48 5.14-1.4 1.95-3.8 3.14-6.22 3.14-2.1 0-4.2-.82-5.69-2.29-1.97-1.9-2.77-4.85-2-7.48.58-2.03 2.05-3.87 4.07-4.73.96-.41 2.02-.6 3.07-.58v4.06c-1-.07-2.05.28-2.75 1.02-.75.76-.94 1.95-.57 2.92.35.96 1.34 1.66 2.37 1.6 1.25.03 2.36-.88 2.53-2.12.02-.37.01-.74.01-1.12V.02z"/>
                                        </svg>
                                      );
                                    }
                                    return <span className="text-[7px] font-extrabold">{badgeText}</span>;
                                  })()}
                                </div>
                              </button>
                            );
                          })}
                          
                          {/* Add integration plus button */}
                          <a
                            href="/channels"
                            className="w-9 h-9 rounded-full border border-dashed border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
                            title="Connect new channel"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </a>
                        </div>

                        {/* Editor unified card */}
                        <div className="border border-[var(--border)] rounded-xl bg-[var(--natural)] p-4 flex flex-col gap-4">
                          
                          <textarea
                            name="content"
                            value={values.content}
                            onChange={(e) => {
                              handleChange(e);
                              setCharCount(e.target.value.length);
                            }}
                            onBlur={handleBlur}
                            rows={13}
                            required
                            placeholder="Start writing or get inspired with Templates"
                            className="w-full bg-transparent text-[var(--primary)] placeholder-[var(--text-muted)] focus:outline-none resize-none text-base"
                          />
                          {/* Media row (Thumbnails + Upload dropzone) at bottom left */}
                          <div className="flex flex-wrap items-center gap-3">
                            
                            {/* Render existing thumbnails first */}
                            {values.images.map((img: string, idx: number) => (
                              <div key={idx} className="relative w-30 h-30 rounded-lg overflow-hidden border border-[var(--border)] group flex-shrink-0">
                                {img.match(/\.(mp4|webm|mov)$/i) ? (
                                  <video src={img} className="w-full h-full object-cover" />
                                ) : (
                                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = values.images.filter((_: any, i: number) => i !== idx);
                                    setFieldValue("images", updated);
                                  }}
                                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}

                            {/* Small Square Dropzone box */}
                            <label className="relative block group flex-shrink-0 cursor-pointer">
                              <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                disabled={uploading}
                                onChange={async (e) => {
                                  if (!e.target.files?.length) return;
                                  setUploading(true);
                                  setError("");
                                  try {
                                    const newImages = [...values.images];
                                    for (let i = 0; i < e.target.files.length; i++) {
                                      const res = await uploadsApi.upload(e.target.files[i]);
                                      if (res.data.url) {
                                        newImages.push(res.data.url);
                                      }
                                    }
                                    setFieldValue("images", newImages);
                                  } catch (err) {
                                    setError("Failed to upload media. Ensure Cloudflare R2 is configured.");
                                  } finally {
                                    setUploading(false);
                                    e.target.value = "";
                                  }
                                }}
                                className="hidden"
                              />
                              <div className="w-30 h-30 border border-dashed border-[var(--border)] hover:border-[var(--secondary)] rounded-lg flex flex-col items-center justify-center p-1.5 text-center transition-colors bg-[var(--main-background)]/30 gap-1">
                                <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--secondary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-[8px] leading-tight font-medium text-[var(--text-secondary)]">
                                  Drag & drop or <span className="text-[var(--secondary)] underline text-[8px]">select a file</span>
                                </span>
                              </div>
                            </label>

                            {/* Open Media Library Button */}
                            <button
                              type="button"
                              onClick={() => setIsMediaLibraryOpen(true)}
                              className="w-30 h-30 flex-shrink-0 border border-[var(--border)] hover:border-[var(--secondary)] rounded-lg flex flex-col items-center justify-center p-1.5 text-center transition-colors bg-[var(--main-background)]/30 gap-1 group"
                            >
                              <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--secondary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <span className="text-[8px] leading-tight font-medium text-[var(--text-secondary)] group-hover:text-[var(--secondary)]">
                                Browse Library
                              </span>
                            </button>

                            {uploading && (
                              <div className="w-20 h-20 border border-[var(--border)] rounded-lg flex items-center justify-center bg-[var(--main-background)]/30">
                                <span className="text-[10px] text-[var(--secondary)] animate-pulse text-center">Uploading...</span>
                              </div>
                            )}
                          </div>

                          {/* Editor Toolbar */}
                          <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
                            <div className="flex items-center gap-3">
                              {/* Character count / limits pill */}
                              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--main-background)]/60 border border-[var(--border)] rounded-full text-xs font-semibold text-[var(--text-secondary)]">
                                <span className="w-2 h-2 rounded-full bg-[var(--secondary)]" />
                                <span>{charCount} chars</span>
                                <svg className="w-2.5 h-2.5 ml-0.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>

                              <button type="button" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors p-1" title="Emoji">
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>

                              <button type="button" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors p-1" title="Hashtags">
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                              </button>
                            </div>

                            {touched.content && errors.content && (
                              <span className="text-[#f87171] text-xs font-medium">{errors.content}</span>
                            )}
                          </div>

                        </div>

                        {publishAction === "LATER" && values.publishDate && values.publishTime && (
                          <div className="bg-[var(--secondary-dim)] border border-[var(--border-hover)]/30 rounded-xl px-4 py-3 text-xs text-[var(--secondary)] backdrop-blur-[12px] flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                              Scheduled to publish on <strong>{new Date(`${values.publishDate}T${values.publishTime}`).toLocaleString()}</strong>
                            </span>
                          </div>
                        )}

                        {touched.integrationIds && errors.integrationIds && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-[#f87171] text-xs font-medium">{errors.integrationIds}</div>
                        )}
                        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-[#f87171] text-xs font-medium">{error}</div>}
                        {success && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-400 text-xs font-medium">{success}</div>}

                        {isLinkedIn && <LinkedInSettings />}
                      </div>

                      {/* Right: Live Preview & Calendar Panel (5 columns) */}
                      <div className="lg:col-span-5 p-6 bg-black/10 dark:bg-white/[0.01] flex flex-col h-full overflow-y-auto">
                        <div className="flex items-center gap-2 mb-6">
                          <h3 className="text-base font-bold text-[var(--primary)]">
                            {showScheduler ? "Schedule Post" : "Post Previews"}
                          </h3>
                          {!showScheduler && (
                            <svg className="w-4 h-4 text-[var(--text-muted)] cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-start items-stretch min-h-0">
                          {showScheduler ? (
                            <div className="bg-[var(--natural)] border border-[var(--border)] rounded-2xl p-5 space-y-4 shadow-xl text-[var(--primary)] max-w-sm mx-auto w-full animate-in fade-in zoom-in-95 duration-150">
                              
                              {/* Calendar Month Header */}
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm">
                                  {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const prev = new Date(viewDate);
                                      prev.setMonth(prev.getMonth() - 1);
                                      setViewDate(prev);
                                    }}
                                    className="p-1 hover:bg-[var(--tertiary)] rounded transition-colors text-[var(--text-secondary)]"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = new Date(viewDate);
                                      next.setMonth(next.getMonth() + 1);
                                      setViewDate(next);
                                    }}
                                    className="p-1 hover:bg-[var(--tertiary)] rounded transition-colors text-[var(--text-secondary)]"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              {/* Calendar Day Titles */}
                              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[var(--text-muted)]">
                                <span>S</span>
                                <span>M</span>
                                <span>T</span>
                                <span>W</span>
                                <span>T</span>
                                <span>F</span>
                                <span>S</span>
                              </div>

                              {/* Calendar Grid cells */}
                              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                                {(() => {
                                  const year = viewDate.getFullYear();
                                  const month = viewDate.getMonth();
                                  const daysCount = getDaysInMonth(year, month);
                                  const startDay = getFirstDayOfMonth(year, month);
                                  const cells = [];

                                  // Empty spacing prefix
                                  for (let i = 0; i < startDay; i++) {
                                    cells.push(<div key={`empty-${i}`} className="w-8 h-8" />);
                                  }

                                  // Day render loop
                                  for (let day = 1; day <= daysCount; day++) {
                                    const mString = String(month + 1).padStart(2, '0');
                                    const dString = String(day).padStart(2, '0');
                                    const dateVal = `${year}-${mString}-${dString}`;
                                    
                                    // Parse values.publishDate to format YYYY-MM-DD
                                    const isSelected = values.publishDate === dateVal;

                                    cells.push(
                                      <button
                                        key={`day-${day}`}
                                        type="button"
                                        onClick={() => setFieldValue("publishDate", dateVal)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                                          isSelected
                                            ? "bg-[var(--secondary)] text-white shadow-md shadow-[var(--secondary)]/30 scale-105"
                                            : "hover:bg-[var(--tertiary)] text-[var(--primary)]"
                                        }`}
                                      >
                                        {day}
                                      </button>
                                    );
                                  }

                                  return cells;
                                })()}
                              </div>

                              {/* Styled Time Selector */}
                              <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                                <label className="block text-xs font-bold text-[var(--text-secondary)]">Select Time</label>
                                <div className="flex items-center justify-between border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--main-background)] text-sm font-semibold">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <input
                                      type="time"
                                      name="publishTime"
                                      value={values.publishTime}
                                      onChange={handleChange}
                                      className="bg-transparent text-[var(--primary)] outline-none focus:none [color-scheme:dark] cursor-pointer"
                                    />
                                  </div>
                                  <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--natural)] px-2 py-0.5 rounded border border-[var(--border)]">
                                    {Intl.DateTimeFormat().resolvedOptions().timeZone.split("/")[1] || Intl.DateTimeFormat().resolvedOptions().timeZone}
                                  </span>
                                </div>
                              </div>

                              {/* Done / Back Buttons */}
                              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowScheduler(false);
                                    setPublishAction("NEXT_AVAILABLE");
                                  }}
                                  className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--primary)] flex items-center gap-1 transition-colors"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                  </svg>
                                  <span>More Posting Actions</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setShowScheduler(false)}
                                  className="px-4 py-1.5 bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white font-bold text-xs rounded-lg shadow-md transition-colors"
                                >
                                  ✓ Done
                                </button>
                              </div>

                            </div>
                          ) : (
                            <>
                              {values.integrationIds.length === 0 || (!values.content && values.images.length === 0) ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[var(--text-muted)] space-y-4">
                                  {/* Sparkles + Post Placeholder Card Graphic */}
                                  <div className="relative w-44 h-44 bg-[var(--natural)] rounded-xl border border-[var(--border)] p-4 flex flex-col justify-between shadow-lg opacity-60">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-[var(--border)]" />
                                      <div className="space-y-1.5 flex-1">
                                        <div className="h-2 bg-[var(--border)] rounded-full w-2/3" />
                                        <div className="h-1.5 bg-[var(--border)] rounded-full w-1/2" />
                                      </div>
                                    </div>
                                    <div className="space-y-2 flex-1 mt-4">
                                      <div className="h-2 bg-[var(--border)] rounded-full w-full" />
                                      <div className="h-2 bg-[var(--border)] rounded-full w-5/6" />
                                      <div className="h-2 bg-[var(--border)] rounded-full w-4/6" />
                                    </div>
                                    
                                    {/* Sparkle SVGs */}
                                    <svg className="absolute -top-3 -right-3 w-6 h-6 text-[var(--secondary)] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="absolute -bottom-2 -left-2 w-4 h-4 text-[var(--secondary)] opacity-80" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium text-[var(--text-muted)] pt-3">See your post's preview here</span>
                                </div>
                              ) : (
                                <div className="w-full">
                                  {/* Platform switcher tabs if multi-select active */}
                                  {values.integrationIds.length > 1 && (
                                    <div className="flex gap-2 mb-4 border-b border-[var(--border)] pb-2 overflow-x-auto">
                                      {integrations
                                        .filter((i) => values.integrationIds.includes(i.id))
                                        .map((int) => (
                                          <button
                                            key={int.id}
                                            type="button"
                                            onClick={() => setActivePreviewId(int.id)}
                                            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                                              selectedIntegration?.id === int.id
                                                ? "border-[var(--secondary)] bg-[var(--secondary-dim)] text-[var(--secondary)]"
                                                : "border-[var(--border)] bg-transparent text-[var(--text-secondary)]"
                                            }`}
                                          >
                                            {int.name}
                                          </button>
                                        ))}
                                    </div>
                                  )}
                                  
                                  {isLinkedIn ? (
                                    <LinkedInPreview
                                      content={values.content}
                                      images={values.images}
                                      integration={selectedIntegration}
                                    />
                                  ) : isInstagram ? (
                                    <InstagramPreview
                                      content={values.content}
                                      images={values.images}
                                      integration={selectedIntegration}
                                    />
                                  ) : (
                                    <GenericPreview
                                      content={values.content}
                                      images={values.images}
                                      integration={selectedIntegration}
                                    />
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Bottom Footer Section */}
                    <div className="border-t border-[var(--border)] px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-[var(--main-background)] relative">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-[var(--border)] bg-[var(--natural)] text-[var(--secondary)] focus:ring-[var(--secondary)] cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-[var(--text-secondary)]">Create Another</span>
                      </label>

                      <div className="flex items-center gap-3">
                        {/* Queue dropdown matching Next Available layout */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border)] rounded-xl bg-[var(--natural)] hover:bg-[var(--tertiary)] transition-colors"
                          >
                            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{getActionLabel(publishAction)}</span>
                            <svg className="w-3 h-3 text-[var(--text-muted)] ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Custom Dropdown popover (opens upwards) */}
                          {isActionDropdownOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setIsActionDropdownOpen(false)}
                              />
                              <div className="absolute bottom-full right-0 mb-2 w-72 bg-[var(--main-background)] border border-[var(--border)] rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 text-left animate-in fade-in slide-in-from-bottom-2 duration-150">
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPublishAction("NEXT_AVAILABLE");
                                    setIsActionDropdownOpen(false);
                                  }}
                                  className={`p-2 rounded-lg text-left transition-colors flex flex-col ${
                                    publishAction === "NEXT_AVAILABLE" ? "bg-[var(--secondary-dim)]" : "hover:bg-[var(--tertiary)]"
                                  }`}
                                >
                                  <span className={`text-xs font-bold ${publishAction === "NEXT_AVAILABLE" ? "text-[var(--secondary)]" : "text-[var(--primary)]"}`}>
                                    ✓ Next Available
                                  </span>
                                  <span className="text-[10px] text-[var(--text-muted)] leading-tight mt-0.5">
                                    Use the next available posting slot in your queue.
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPublishAction("PRIORITIZE");
                                    setIsActionDropdownOpen(false);
                                  }}
                                  className={`p-2 rounded-lg text-left transition-colors flex flex-col ${
                                    publishAction === "PRIORITIZE" ? "bg-[var(--secondary-dim)]" : "hover:bg-[var(--tertiary)]"
                                  }`}
                                >
                                  <span className={`text-xs font-bold ${publishAction === "PRIORITIZE" ? "text-[var(--secondary)]" : "text-[var(--primary)]"}`}>
                                    Prioritize
                                  </span>
                                  <span className="text-[10px] text-[var(--text-muted)] leading-tight mt-0.5">
                                    Bump your post to the top of the queue.
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPublishAction("NOW");
                                    setIsActionDropdownOpen(false);
                                  }}
                                  className={`p-2 rounded-lg text-left transition-colors flex flex-col ${
                                    publishAction === "NOW" ? "bg-[var(--secondary-dim)]" : "hover:bg-[var(--tertiary)]"
                                  }`}
                                >
                                  <span className={`text-xs font-bold ${publishAction === "NOW" ? "text-[var(--secondary)]" : "text-[var(--primary)]"}`}>
                                    Now
                                  </span>
                                  <span className="text-[10px] text-[var(--text-muted)] leading-tight mt-0.5">
                                    Publish your post right away.
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPublishAction("LATER");
                                    setShowScheduler(true);
                                    setIsActionDropdownOpen(false);
                                  }}
                                  className={`p-2 rounded-lg text-left transition-colors flex flex-col ${
                                    publishAction === "LATER" ? "bg-[var(--secondary-dim)]" : "hover:bg-[var(--tertiary)]"
                                  }`}
                                >
                                  <span className={`text-xs font-bold ${publishAction === "LATER" ? "text-[var(--secondary)]" : "text-[var(--primary)]"}`}>
                                    Set Date and Time
                                  </span>
                                  <span className="text-[10px] text-[var(--text-muted)] leading-tight mt-0.5">
                                    Choose a specific time to post, or use our recommendation.
                                  </span>
                                </button>

                              </div>
                            </>
                          )}
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          onClick={() => setFieldValue("state", "QUEUE")}
                          disabled={isSubmitting}
                          className="px-5 py-2.5 bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white font-bold text-xs rounded-xl shadow-lg shadow-[var(--shadow-rose)] transition duration-200 disabled:opacity-50 flex items-center gap-2"
                        >
                          <span>
                            {isSubmitting && values.state === "QUEUE"
                              ? "Processing..."
                              : getSubmitButtonLabel()}
                          </span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Media Library Modal Overlay */}
                    <MediaLibraryModal 
                      isOpen={isMediaLibraryOpen}
                      onClose={() => setIsMediaLibraryOpen(false)}
                      onSelect={(urls: string[]) => {
                        setFieldValue("images", [...values.images, ...urls]);
                      }}
                    />

                  </Form>
                );
              }}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}
