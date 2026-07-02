import { Metadata } from 'next';

export const metadata: Metadata = {
  other: {
    'tiktok-developers-site-verification': 'cxFdexKoDhUP0NE18CF3LVQXMMtVp7NW',
  },
};

export default function CallbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
