import { Metadata } from 'next';

export const metadata: Metadata = {
  other: {
    'tiktok-developers-site-verification': 'D7oiIPLKkIpPyFrF0dP1MjxemnhfkvKB',
  },
};

export default function CallbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
