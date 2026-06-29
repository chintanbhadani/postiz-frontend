"use client";
import { useEffect, useState } from "react";
import { postsApi, integrationsApi, uploadsApi } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LinkedInPreview } from "../../Components/LinkedInPreview";
import { LinkedInSettings } from "../../Components/LinkedInSettings";

const createPostSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
  integrationId: Yup.string().required("Please select a channel"),
  publishDate: Yup.string().required("Date is required"),
  publishTime: Yup.string().required("Time is required"),
  state: Yup.string().oneOf(["QUEUE", "DRAFT"]).required()
});

export default function CreatePostPage() {
  const router = useRouter();
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [initialValues, setInitialValues] = useState({
    content: "",
    integrationId: "",
    publishDate: "",
    publishTime: "",
    images: [] as string[],
    state: "QUEUE" as "QUEUE" | "DRAFT"
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const next = new Date();
    next.setHours(next.getHours() + 1, 0, 0, 0);
    const dateStr = next.toISOString().split("T")[0];
    const timeStr = next.toTimeString().slice(0, 5);

    integrationsApi.list().then((res) => {
      setIntegrations(res.data);
      setInitialValues({
        content: "",
        integrationId: res.data.length > 0 ? res.data[0].id : "",
        publishDate: dateStr,
        publishTime: timeStr,
        images: [],
        state: "QUEUE"
      });
    }).catch(() => {});
  }, []);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setError("");
    setSuccess("");
    try {
      const publishDate = new Date(`${values.publishDate}T${values.publishTime}`).toISOString();
      await postsApi.create({
        content: values.content,
        integrationId: values.integrationId,
        publishDate,
        images: values.images,
        state: values.state,
      });
      setSuccess(values.state === "DRAFT" ? "Saved as draft!" : "Post scheduled successfully!");
      setTimeout(() => router.push("/"), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to schedule post");
      setSubmitting(false);
    }
  };

  const PLATFORM_COLORS: Record<string, string> = {
    twitter: "#1da1f2", linkedin: "#0077b5", facebook: "#1877f2",
    instagram: "#e1306c", youtube: "#ff0000", tiktok: "#000000",
    bluesky: "#0085ff", threads: "#101010", reddit: "#ff4500",
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary)]">Create Post</h1>
        <p className="text-[var(--text-muted)] mt-1">Compose and schedule your social media post</p>
      </div>

      {integrations.length === 0 ? (
        <div className="bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] rounded-2xl p-8 text-center backdrop-blur-[12px]">
          <div className="text-4xl mb-4 opacity-60">🔗</div>
          <p className="text-amber-300 font-medium mb-2">No channels connected</p>
          <p className="text-amber-400/50 text-sm mb-4">Connect at least one social media account first.</p>
          <a href="/channels" className="btn-primary px-4 py-2 text-sm">
            Go to Channels
          </a>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={createPostSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
            const selectedIntegration = integrations.find((i) => i.id === values.integrationId);
            const isLinkedIn = selectedIntegration?.platform?.toLowerCase() === 'linkedin';
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Form className="space-y-6">
                {/* Channel Selector */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Post to</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {integrations.map((int) => (
                      <button
                        key={int.id}
                        type="button"
                        onClick={() => setFieldValue("integrationId", int.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          values.integrationId === int.id
                            ? "border-[var(--secondary)] bg-[var(--secondary-dim)] shadow-[var(--shadow-rose)]"
                            : "border-[var(--border)] bg-[var(--natural)] backdrop-blur-[12px] hover:border-[var(--border-hover)]"
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--primary)] text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: PLATFORM_COLORS[int.platform] || "#6b7280" }}
                        >
                          {int.platform?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[var(--primary)] text-sm font-medium truncate">{int.name}</p>
                          <p className="text-[var(--text-muted)] text-xs capitalize">{int.platform}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {touched.integrationId && errors.integrationId && (
                    <span className="text-[#f87171] text-xs mt-1 block">{errors.integrationId}</span>
                  )}
                </div>

                {/* Content Textarea */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">Content</label>
                    <span className={`text-xs ${charCount > 280 ? "text-[#f87171]" : "text-[var(--text-muted)]"}`}>
                      {charCount} chars
                    </span>
                  </div>
                  <textarea
                    name="content"
                    value={values.content}
                    onChange={(e) => {
                      handleChange(e);
                      setCharCount(e.target.value.length);
                    }}
                    onBlur={handleBlur}
                    rows={6}
                    required
                    placeholder="What do you want to share?"
                    className={`w-full bg-[var(--natural)] border rounded-xl px-4 py-3 text-[var(--primary)] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-[var(--border-hover)] transition resize-none backdrop-blur-[12px] ${
                      touched.content && errors.content ? "border-[rgba(248,113,113,0.3)]" : "border-[var(--border)]"
                    }`}
                  />
                  {touched.content && errors.content && (
                    <span className="text-[#f87171] text-xs mt-1 block">{errors.content}</span>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Media (Images/Video)</label>
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
                    className="w-full bg-[var(--natural)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--primary)] backdrop-blur-[12px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--secondary-dim)] file:text-[var(--secondary)] hover:file:bg-[var(--secondary)] hover:file:text-white transition cursor-pointer"
                  />
                  {uploading && <span className="text-sm text-[var(--secondary)] mt-2 block animate-pulse">Uploading media...</span>}
                  
                  {values.images.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {values.images.map((img: string, idx: number) => (
                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[var(--border)] group">
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
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date/Time Pickers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Date</label>
                    <input
                      type="date"
                      name="publishDate"
                      value={values.publishDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className={`w-full bg-[var(--natural)] border rounded-xl px-4 py-3 text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-[var(--border-hover)] transition backdrop-blur-[12px] [color-scheme:dark] ${
                        touched.publishDate && errors.publishDate ? "border-[rgba(248,113,113,0.3)]" : "border-[var(--border)]"
                      }`}
                    />
                    {touched.publishDate && errors.publishDate && (
                      <span className="text-[#f87171] text-xs mt-1 block">{errors.publishDate}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Time</label>
                    <input
                      type="time"
                      name="publishTime"
                      value={values.publishTime}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full bg-[var(--natural)] border rounded-xl px-4 py-3 text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-[var(--border-hover)] transition backdrop-blur-[12px] [color-scheme:dark] ${
                        touched.publishTime && errors.publishTime ? "border-[rgba(248,113,113,0.3)]" : "border-[var(--border)]"
                      }`}
                    />
                    {touched.publishTime && errors.publishTime && (
                      <span className="text-[#f87171] text-xs mt-1 block">{errors.publishTime}</span>
                    )}
                  </div>
                </div>

                {/* Publish Preview */}
                {values.publishDate && values.publishTime && (
                  <div className="bg-[var(--secondary-dim)] border border-[var(--border-hover)] rounded-xl px-4 py-3 text-sm text-[var(--secondary)] backdrop-blur-[12px]">
                    Will publish: {new Date(`${values.publishDate}T${values.publishTime}`).toLocaleString()}
                    {selectedIntegration && ` on ${selectedIntegration.name} (${selectedIntegration.platform})`}
                  </div>
                )}

                {error && <div className="bg-[rgba(248,113,113,0.05)] border border-[rgba(248,113,113,0.15)] rounded-xl px-4 py-3 text-[#f87171] text-sm">{error}</div>}
                {success && <div className="bg-[rgba(52,211,153,0.05)] border border-[rgba(52,211,153,0.15)] rounded-xl px-4 py-3 text-[#34d399] text-sm">{success}</div>}

                {/* LinkedIn Settings */}
                {isLinkedIn && <LinkedInSettings />}

                {/* Submit Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    onClick={() => setFieldValue("state", "DRAFT")}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-[var(--natural)] hover:bg-[var(--tertiary)] text-[var(--text-secondary)] font-medium rounded-xl border border-[var(--border)] transition disabled:opacity-50 cursor-pointer backdrop-blur-[12px]"
                  >
                    {isSubmitting && values.state === "DRAFT" ? "Saving..." : "Save as Draft"}
                  </button>
                  <button
                    type="submit"
                    onClick={() => setFieldValue("state", "QUEUE")}
                    disabled={isSubmitting}
                    className="flex-1 btn-primary px-4 py-3"
                  >
                    {isSubmitting && values.state === "QUEUE" ? "Scheduling..." : "Schedule Post"}
                  </button>
                </div>
              </Form>

                {/* Live Preview Side Panel */}
                <div className="hidden lg:block">
                  <div className="sticky top-8">
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-4">Live Preview</h3>
                    {isLinkedIn ? (
                      <LinkedInPreview
                        content={values.content}
                        images={values.images}
                        integration={selectedIntegration}
                      />
                    ) : (
                      <div className="bg-[var(--natural)] border border-[var(--border)] rounded-xl p-8 text-center text-[var(--text-muted)] backdrop-blur-[12px]">
                        Preview is currently available only for LinkedIn.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        </Formik>
      )}
    </div>
  );
}
