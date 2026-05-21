import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/auth.context";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ToastContainer } from "react-toastify";
import { Providers } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Postiz Standalone — Social Media Scheduler",
  description: "Schedule and manage your social media posts across all platforms",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <AuthProvider>
            <ToastContainer />
            <Providers>{children}</Providers>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}