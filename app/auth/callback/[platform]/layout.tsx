import { Metadata } from 'next';

export const metadata: Metadata = {
  other: {
    'tiktok-developers-site-verification': 'D7oiIPLKkIpPyFrF0dP1MjxemnhfkvKB',
  },
};

export default function CallbackLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fallback tags just in case TikTok checks the HTML instead of the text file */}
      <head>
        <meta name="tiktok-developers-site-verification" content="cxFdexKoDhUP0NE18CF3LVQXMMtVp7NW" />
      </head>
      {children}
    </>
  );
}
