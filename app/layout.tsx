import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/auth.context";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ToastContainer } from "react-toastify";
import { Providers } from "./provider";
import { ThemeProvider } from "./theme-provider";

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
  title: "Postilio — Social Media Scheduler",
  description: "Schedule and manage your social media posts across all platforms",
  icons: {
    icon: "/asset/logo.png",
    shortcut: "/asset/logo.png",
    apple: "/asset/logo.png",
  },
  other: {
    'tiktok-developers-site-verification': process.env.NEXT_PUBLIC_TIKTOK_SITE_VERIFICATION || '',
  },
};

import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JTXH7WHX68"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-JTXH7WHX68');
          `}
        </Script>
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppRouterCacheProvider>
            <Providers>
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
                {children}
              </AuthProvider>
            </Providers>
          </AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}