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
    <div className="flex min-h-screen w-full bg-[var(--main-background)] relative">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-12 md:py-0 relative z-10">
        <div className="mx-auto w-full max-w-xs">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <img src="/asset/logo.png" alt="Postilio Logo" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Postilio</span>
          </div>

          <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">Log in</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            New to Postilio?{" "}
            <Link href="/register" className="text-[var(--secondary)] hover:text-[var(--secondary-light)] font-bold hover:underline">
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
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-[var(--text-secondary)]">Password</label>
                    <Link href="#" className="text-xs font-bold text-[var(--secondary)] hover:text-[var(--secondary-light)] hover:underline">
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
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Log In"}
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
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">New</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Manage your social media presence easily
          </h2>

          {/* Glass card preview */}
          <div className="bg-[rgba(255,255,255,0.2)] backdrop-blur-md border border-[rgba(255,255,255,0.4)] rounded-2xl p-5 transform rotate-1 hover:rotate-0 transition-transform duration-500 shadow-xl">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.5)]" />
              <div className="flex-1 flex flex-col justify-center gap-2">
                <div className="h-3 bg-[rgba(255,255,255,0.6)] rounded w-1/3" />
                <div className="h-2 bg-[rgba(255,255,255,0.4)] rounded w-2/3" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-20 bg-[rgba(255,255,255,0.1)] rounded-xl border border-[rgba(255,255,255,0.3)]" />
              <div className="flex justify-end">
                <div className="h-10 w-24 bg-[var(--secondary)] rounded-lg shadow-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
