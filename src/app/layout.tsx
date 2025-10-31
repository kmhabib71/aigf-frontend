import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { SocketProvider } from "../contexts/SocketContext";
import { SiteSettingsProvider } from "../contexts/SiteSettingsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://romancecanvas.com'),
  title: {
    default: 'RomanceCanvas - AI-Powered Interactive Romance Stories & Chat',
    template: '%s | RomanceCanvas',
  },
  description: 'AI-powered interactive fiction platform. Create and experience infinite stories. Product: Romantic Chat · Create Story. Start free today!',
  keywords: ['AI romance', 'interactive romance stories', 'romantic AI chat', 'AI girlfriend chat', 'romance story generator', 'AI storytelling', 'romantic chatbot', 'interactive fiction'],
  authors: [{ name: 'RomanceCanvas' }],
  creator: 'RomanceCanvas',
  publisher: 'RomanceCanvas',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://romancecanvas.com',
    siteName: 'RomanceCanvas',
    title: 'RomanceCanvas - AI-Powered Interactive Romance Stories & Chat',
    description: 'Create immersive AI-powered romance stories with interactive choices and romantic AI chat. Personalized narratives await.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RomanceCanvas - Interactive Romance Stories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RomanceCanvas - AI-Powered Interactive Romance Stories & Chat',
    description: 'Create immersive AI-powered romance stories with interactive choices and romantic AI chat',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/logo-ico.ico",
    shortcut: "/logo-ico.ico",
    apple: "/logo.png",
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RomanceCanvas',
    url: 'https://romancecanvas.com',
    logo: 'https://romancecanvas.com/logo.png',
    description: 'AI-powered interactive romance story and chat platform',
    sameAs: [
      // Add your social media URLs when available
      // 'https://twitter.com/romancecanvas',
      // 'https://facebook.com/romancecanvas',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@romancecanvas.com',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RomanceCanvas',
    url: 'https://romancecanvas.com',
    description: 'Create immersive AI-powered romance stories and experience romantic AI chat',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://romancecanvas.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Facebook App ID - Add your actual app ID from Facebook Developer Console */}
        <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FB_APP_ID || "YOUR_FB_APP_ID_HERE"} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SocketProvider>
            <SiteSettingsProvider>
            {children}
            </SiteSettingsProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
