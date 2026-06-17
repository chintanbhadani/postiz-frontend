"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--main-background)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--secondary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
