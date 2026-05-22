"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { integrationsApi, postsApi } from "@/lib/api";

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
    state: "QUEUE" as "QUEUE" | "DRAFT"
  });

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
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create Post</h1>
        <p className="text-gray-500 mt-1">Compose and schedule your social media post</p>
      </div>

      {integrations.length === 0 ? (
        <div className="bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] rounded-2xl p-8 text-center backdrop-blur-[12px]">
          <div className="text-4xl mb-4 opacity-60">🔗</div>
          <p className="text-amber-300 font-medium mb-2">No channels connected</p>
          <p className="text-amber-400/50 text-sm mb-4">Connect at least one social media account first.</p>
          <a href="/channels" className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-xl text-sm transition shadow-[0_0_15px_rgba(99,102,241,0.35)]">
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
            return (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Post to</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {integrations.map((int) => (
                      <button
                        key={int.id}
                        type="button"
                        onClick={() => setFieldValue("integrationId", int.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          values.integrationId === int.id
                            ? "border-[#6366f1] bg-[rgba(99,102,241,0.1)] shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                            : "border-white/[0.05] bg-[rgba(15,23,42,0.35)] backdrop-blur-[12px] hover:border-white/[0.1]"
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: PLATFORM_COLORS[int.platform] || "#6b7280" }}
                        >
                          {int.platform?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">{int.name}</p>
                          <p className="text-gray-500 text-xs capitalize">{int.platform}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {touched.integrationId && errors.integrationId && (
                    <span className="text-[#f87171] text-xs mt-1 block">{errors.integrationId}</span>
                  )}
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Content</label>
                    <span className={`text-xs ${charCount > 280 ? "text-[#f87171]" : "text-gray-500"}`}>
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
                    className={`w-full bg-[rgba(15,23,42,0.35)] border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[rgba(99,102,241,0.3)] transition resize-none backdrop-blur-[12px] ${
                      touched.content && errors.content ? "border-[rgba(248,113,113,0.3)]" : "border-white/[0.05]"
                    }`}
                  />
                  {touched.content && errors.content && (
                    <span className="text-[#f87171] text-xs mt-1 block">{errors.content}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      name="publishDate"
                      value={values.publishDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className={`w-full bg-[rgba(15,23,42,0.35)] border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[rgba(99,102,241,0.3)] transition backdrop-blur-[12px] [color-scheme:dark] ${
                        touched.publishDate && errors.publishDate ? "border-[rgba(248,113,113,0.3)]" : "border-white/[0.05]"
                      }`}
                    />
                    {touched.publishDate && errors.publishDate && (
                      <span className="text-[#f87171] text-xs mt-1 block">{errors.publishDate}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                    <input
                      type="time"
                      name="publishTime"
                      value={values.publishTime}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full bg-[rgba(15,23,42,0.35)] border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[rgba(99,102,241,0.3)] transition backdrop-blur-[12px] [color-scheme:dark] ${
                        touched.publishTime && errors.publishTime ? "border-[rgba(248,113,113,0.3)]" : "border-white/[0.05]"
                      }`}
                    />
                    {touched.publishTime && errors.publishTime && (
                      <span className="text-[#f87171] text-xs mt-1 block">{errors.publishTime}</span>
                    )}
                  </div>
                </div>

                {values.publishDate && values.publishTime && (
                  <div className="bg-[rgba(99,102,241,0.05)] border border-[rgba(99,102,241,0.15)] rounded-xl px-4 py-3 text-sm text-[#818cf8] backdrop-blur-[12px]">
                    Will publish: {new Date(`${values.publishDate}T${values.publishTime}`).toLocaleString()}
                    {selectedIntegration && ` on ${selectedIntegration.name} (${selectedIntegration.platform})`}
                  </div>
                )}

                {error && <div className="bg-[rgba(248,113,113,0.05)] border border-[rgba(248,113,113,0.15)] rounded-xl px-4 py-3 text-[#f87171] text-sm">{error}</div>}
                {success && <div className="bg-[rgba(52,211,153,0.05)] border border-[rgba(52,211,153,0.15)] rounded-xl px-4 py-3 text-[#34d399] text-sm">{success}</div>}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    onClick={() => setFieldValue("state", "DRAFT")}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-[rgba(15,23,42,0.35)] hover:bg-[rgba(15,23,42,0.55)] text-gray-300 font-medium rounded-xl border border-white/[0.05] transition disabled:opacity-50 cursor-pointer backdrop-blur-[12px]"
                  >
                    {isSubmitting && values.state === "DRAFT" ? "Saving..." : "Save as Draft"}
                  </button>
                  <button
                    type="submit"
                    onClick={() => setFieldValue("state", "QUEUE")}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-[#6366f1] hover:bg-[#5558e6] text-white font-semibold rounded-xl transition shadow-[0_0_15px_rgba(99,102,241,0.35)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting && values.state === "QUEUE" ? "Scheduling..." : "Schedule Post"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
}
