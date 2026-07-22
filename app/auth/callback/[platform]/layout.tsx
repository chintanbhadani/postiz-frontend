import { Metadata } from 'next';

export const metadata: Metadata = {
  other: {
    'tiktok-developers-site-verification': process.env.NEXT_PUBLIC_TIKTOK_SITE_VERIFICATION || '',
  },
};

export default function CallbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
