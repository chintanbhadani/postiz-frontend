import { Metadata } from 'next';

export const metadata: Metadata = {
  other: {
    'tiktok-developers-site-verification': 'U2SUujrhQDPVUIEKSZDAf3A8O76kxllx',
  },
};

export default function CallbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
