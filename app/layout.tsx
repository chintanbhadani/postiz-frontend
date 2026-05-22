import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/auth.context";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ToastContainer } from "react-toastify";
import { Providers } from "./provider";

const syne = Syne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-syne",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Postiz — Social Media Scheduler",
  description: "Schedule and manage your social media posts across all platforms",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <AppRouterCacheProvider>
          <AuthProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              toastStyle={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "13px",
                borderRadius: "12px",
              }}
            />
            <Providers>{children}</Providers>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}