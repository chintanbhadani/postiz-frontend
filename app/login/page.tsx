"use client";
import { useState } from "react";
import { useAuth } from "../../context/auth.context";
import Link from "next/link";
import { useDispatch } from 'react-redux';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Loader as Loader2 } from "lucide-react";
import { errorToast } from "@/helper/toast";
import { setLoggedUser, setToken } from "@/store/slice/Base";
import { useRouter } from "next/navigation";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setError("");
    try {
      const response = await login(values.email, values.password);
      if (response?.data?.success) {
        router.push('/dashboard');
        dispatch(setToken(response?.data?.token));
        dispatch(setLoggedUser(response?.data?.user));
      } else {
        errorToast(response?.data?.message);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#030712] relative">

      {/* Background grid + glow */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-12 md:py-0 relative z-10">
        <div className="mx-auto w-full max-w-xs">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="absolute inset-0 bg-[#6366f1] rounded-lg transform -rotate-6 opacity-60 blur-[2px]"></div>
              <div className="absolute inset-0 bg-[#6366f1] rounded-lg transform rotate-2 opacity-80"></div>
              <div className="absolute inset-0 bg-[#6366f1] rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                <span className="text-white text-sm font-black">P</span>
              </div>
            </div>
            <span className="text-white font-black text-xl tracking-tight">Postilio</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Log in</h1>
          <p className="text-gray-500 mb-8">
            New to Postilio?{" "}
            <Link href="/register" className="text-[#818cf8] hover:text-[#6366f1] font-medium hover:underline">
              Create an account
            </Link>
          </p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form noValidate autoComplete="off" className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="you@example.com"
                    className={`w-full bg-[rgba(15,23,42,0.35)] border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[rgba(99,102,241,0.3)] transition backdrop-blur-[12px] ${
                      touched.email && errors.email ? "border-[rgba(248,113,113,0.3)]" : "border-white/[0.05]"
                    }`}
                  />
                  {touched.email && errors.email && (
                    <span className="text-[#f87171] text-xs mt-1 block">{errors.email}</span>
                  )}
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-400">Password</label>
                    <Link href="#" className="text-xs text-[#818cf8] hover:text-[#6366f1] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Enter your password"
                      className={`w-full bg-[rgba(15,23,42,0.35)] border rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[rgba(99,102,241,0.3)] transition backdrop-blur-[12px] ${
                        touched.password && errors.password ? "border-[rgba(248,113,113,0.3)]" : "border-white/[0.05]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <span className="text-[#f87171] text-xs mt-1 block">{errors.password}</span>
                  )}
                </div>

                {error && (
                  <div className="bg-[rgba(248,113,113,0.05)] border border-[rgba(248,113,113,0.15)] rounded-xl px-4 py-3 text-[#f87171] text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#6366f1] hover:bg-[#5558e6] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.35)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Log In"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 pt-6 border-t border-white/[0.05] text-center">
            <div className="flex justify-center gap-4 text-xs text-gray-500 mb-2">
              <Link href="/privacy-policy" className="hover:text-[#818cf8] transition-colors font-medium">Privacy Policy & Data Deletion</Link>
              {/* <span>•</span> */}
              {/* <Link href="/terms" className="hover:text-[#818cf8] transition-colors font-medium">Terms of Service</Link> */}
            </div>
            <p className="text-[10px] text-gray-600 mt-2">
              &copy; {new Date().getFullYear()} Postilio. A product of VARNI ENTERPRISE.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Graphic (Hidden on mobile) */}
      <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden bg-[rgba(99,102,241,0.03)] border-l border-white/[0.03]">
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 max-w-md px-8">
          <div className="inline-block px-3 py-1 border border-[rgba(99,102,241,0.2)] rounded-full bg-[rgba(99,102,241,0.08)] mb-6">
            <span className="text-[10px] font-bold text-[#818cf8] uppercase tracking-wider">New</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Manage your social media presence easily
          </h2>

          {/* Glass card preview */}
          <div className="bg-[rgba(15,23,42,0.55)] backdrop-blur-[16px] border border-white/[0.08] rounded-2xl p-5 transform rotate-1 hover:rotate-0 transition-transform duration-500 shadow-xl">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.15)]" />
              <div className="flex-1 flex flex-col justify-center gap-2">
                <div className="h-3 bg-white/[0.06] rounded w-1/3" />
                <div className="h-2 bg-white/[0.03] rounded w-2/3" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-20 bg-white/[0.03] rounded-xl border border-white/[0.04]" />
              <div className="flex justify-end">
                <div className="h-10 w-24 bg-[#6366f1] rounded-lg shadow-[0_0_10px_rgba(99,102,241,0.3)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
