"use client";
import { useState } from "react";
import { useAuth } from "../../context/auth.context";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  organizationName: Yup.string().required("Organization name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

export default function RegisterPage() {
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setError("");
    try {
      await register({
        name: values.name,
        organizationName: values.organizationName,
        email: values.email,
        password: values.password
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[var(--main-background)] relative">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-12 md:py-0 relative z-10">
        <div className="mx-auto w-full max-w-xs">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="absolute inset-0 bg-[var(--secondary)] rounded-lg transform -rotate-6 opacity-60 blur-[2px]"></div>
              <div className="absolute inset-0 bg-[var(--secondary)] rounded-lg transform rotate-2 opacity-80"></div>
              <div className="absolute inset-0 bg-[var(--secondary)] rounded-lg flex items-center justify-center shadow-[var(--shadow-rose)]">
                <span className="text-white text-sm font-black">P</span>
              </div>
            </div>
            <span className="text-[var(--primary)] font-black text-xl tracking-tight">Postilio</span>
          </div>

          <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">Create an account</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--secondary)] hover:text-[var(--secondary-light)] font-bold hover:underline">
              Log in
            </Link>
          </p>

          <Formik
            initialValues={{ name: "", organizationName: "", email: "", password: "" }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form noValidate autoComplete="off" className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Your Name</label>
                    <input
                      name="name"
                      type="text"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="John"
                      className={`w-full bg-[var(--natural)] border rounded-xl px-4 py-3 text-[var(--primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-[var(--secondary)] transition ${
                        touched.name && errors.name ? "border-[var(--error)]" : "border-[var(--border)]"
                      }`}
                    />
                    {touched.name && errors.name && (
                      <span className="text-[var(--error)] text-xs mt-1 block font-bold">{errors.name}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Organization</label>
                    <input
                      name="organizationName"
                      type="text"
                      value={values.organizationName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Acme Inc"
                      className={`w-full bg-[var(--natural)] border rounded-xl px-4 py-3 text-[var(--primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-[var(--secondary)] transition ${
                        touched.organizationName && errors.organizationName ? "border-[var(--error)]" : "border-[var(--border)]"
                      }`}
                    />
                    {touched.organizationName && errors.organizationName && (
                      <span className="text-[var(--error)] text-xs mt-1 block font-bold">{errors.organizationName}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="you@example.com"
                    className={`w-full bg-[var(--natural)] border rounded-xl px-4 py-3 text-[var(--primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-[var(--secondary)] transition ${
                      touched.email && errors.email ? "border-[var(--error)]" : "border-[var(--border)]"
                    }`}
                  />
                  {touched.email && errors.email && (
                    <span className="text-[var(--error)] text-xs mt-1 block font-bold">{errors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Min. 6 characters"
                      className={`w-full bg-[var(--natural)] border rounded-xl px-4 py-3 pr-12 text-[var(--primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:border-[var(--secondary)] transition ${
                        touched.password && errors.password ? "border-[var(--error)]" : "border-[var(--border)]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)] transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <span className="text-[var(--error)] text-xs mt-1 block font-bold">{errors.password}</span>
                  )}
                </div>

                {error && (
                  <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3 text-[var(--error)] text-sm font-bold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Sign Up"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
            <div className="flex justify-center gap-4 text-xs text-[var(--text-secondary)] mb-2">
              <Link href="/privacy-policy" className="hover:text-[var(--primary)] transition-colors font-bold">Privacy Policy & Data Deletion</Link>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-2 font-medium">
              &copy; {new Date().getFullYear()} Postilio. A product of VARNI ENTERPRISE.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Graphic (Hidden on mobile) */}
      <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#92C1F5] via-[#A0B0F6] to-[#B39DFA] border-l border-[var(--border)]">
        {/* Glowing orbs for glassy effect */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#7DB1F7] rounded-full mix-blend-screen filter blur-[100px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#987DF7] rounded-full mix-blend-screen filter blur-[100px] opacity-60 pointer-events-none" />

        <div className="relative z-10 max-w-md px-8">
          <div className="inline-block px-3 py-1 border border-[rgba(255,255,255,0.4)] rounded-full bg-[rgba(255,255,255,0.2)] mb-6 shadow-sm">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Welcome</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Join thousands of creators scheduling their posts
          </h2>

          <div className="bg-[rgba(255,255,255,0.2)] backdrop-blur-md border border-[rgba(255,255,255,0.4)] rounded-2xl p-5 transform -rotate-1 hover:rotate-0 transition-transform duration-500 shadow-xl">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.5)] flex items-center justify-center">
                <span className="text-white font-bold text-lg">+</span>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-2">
                <div className="h-3 bg-[rgba(255,255,255,0.6)] rounded w-1/2" />
                <div className="h-2 bg-[rgba(255,255,255,0.4)] rounded w-3/4" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-16 bg-[rgba(255,255,255,0.1)] rounded-xl border border-[rgba(255,255,255,0.3)]" />
              <div className="h-16 bg-[rgba(255,255,255,0.1)] rounded-xl border border-[rgba(255,255,255,0.3)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
