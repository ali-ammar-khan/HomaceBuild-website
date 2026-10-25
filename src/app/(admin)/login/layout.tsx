import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staff Login | HomaceBuild and Realators',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
