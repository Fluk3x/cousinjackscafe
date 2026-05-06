import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { IntroSplash } from "@/components/intro-splash";
import { OrderShell } from "@/components/order-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cafe } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(cafe.siteUrl),
  title: {
    default: "Cousin Jacks Café Guildford | Coffee, Breakfast & Lunch",
    template: "%s | Cousin Jacks Café",
  },
  description: cafe.shortTagline,
  keywords: ["Cousin Jacks Café", "Guildford cafe", "Guildford NSW coffee", "breakfast Guildford", "Western Sydney cafe"],
  applicationName: "Cousin Jacks Café",
  authors: [{ name: cafe.name }],
  creator: "Cousin Jacks Café",
  openGraph: {
    title: "Cousin Jacks Café Guildford",
    description: cafe.shortTagline,
    url: cafe.siteUrl,
    siteName: "Cousin Jacks Café",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cousin Jacks Café Guildford",
    description: cafe.shortTagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#050302",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[var(--cj-charcoal)] font-sans antialiased text-[var(--cj-soft)]">
        <IntroSplash />
        <div className="noise" aria-hidden="true" />
        <SiteHeader />
        <OrderShell>{children}</OrderShell>
        <SiteFooter />
      </body>
    </html>
  );
}
