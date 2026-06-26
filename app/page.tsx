"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Share2, TrendingUp } from "lucide-react";

export default function RootPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-gray-800 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/asset/logo.png" alt="Postilio Logo" className="w-8 h-8 rounded-lg object-contain" />
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Postilio
          </div>
        </div>
        <div>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
          >
            Log in / Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
          Manage your social media <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">in one place.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
          Postilio is the ultimate social media scheduling tool. Plan, publish, and analyze your content across all major platforms with ease.
        </p>
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg hover:scale-105 transition-transform"
        >
          Get Started
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl">
          <div className="flex flex-col items-center p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
            <p className="text-gray-400 text-sm">Plan your posts days, weeks, or months in advance across all platforms.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 text-purple-400">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Multi-Platform</h3>
            <p className="text-gray-400 text-sm">Connect TikTok, LinkedIn, Instagram, Facebook, and more seamlessly.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-gray-900/50 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Analytics</h3>
            <p className="text-gray-400 text-sm">Track engagement and measure the success of your social campaigns.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-gray-800 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-4">
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Postilio. A product of VARNI ENTERPRISE. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
