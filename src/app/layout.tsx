import type { Metadata, Viewport } from 'next';
import { Figtree, Sora, Kode_Mono } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/ThemeProvider';
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${figtree.variable} ${sora.variable} ${kodeMono.variable} min-h-screen antialiased`}
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
