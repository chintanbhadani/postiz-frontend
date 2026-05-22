"use client";
import { useEffect } from "react";
import { useAuth } from "../context/auth.context";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(user ? "/" : "/login");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}