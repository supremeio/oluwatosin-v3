import type { Metadata, Viewport } from 'next';
import { Figtree, Sora, Kode_Mono } from 'next/font/google';
import './globals.css';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  preload: false,
});

const kodeMono = Kode_Mono({
  subsets: ['latin'],
  variable: '--font-kode-mono',
  display: 'swap',
  preload: false,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Oluwatosin Kazeem — Product Designer Portfolio '26",
  description:
    'Product Designer and design engineer who bridges design and development through systematic problem-solving, scalable design systems, and AI-accelerated front-end implementation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <body
        className={`${figtree.variable} ${sora.variable} ${kodeMono.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
