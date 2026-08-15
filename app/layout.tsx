import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Nav } from "@/components/blog/Nav";
import { Footer } from "@/components/blog/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thenotarchitect.dev";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#org`,
  name: "The Not Architect",
  url: SITE_URL,
  logo: `${SITE_URL}/thenotarchitect_logo_final.svg`,
  sameAs: ["https://www.linkedin.com/in/frederick-niekerk-b3446987/"],
};

const siteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "The Not Architect",
  url: SITE_URL,
  description:
    "Business and technology in equal measure — people, process, and delivery.",
  publisher: { "@id": `${SITE_URL}/#org` },
  inLanguage: "en-US",
};

export const metadata: Metadata = {
  title: {
    default: "The Not Architect",
    template: "%s | The Not Architect",
  },
  description:
    "Business and technology in equal measure — people, process, and delivery. I draw boxes, cross them out, and ship.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "The Not Architect",
  },
  keywords: [
    "software architecture",
    "technology leadership",
    "business technology",
    "systems thinking",
    "engineering leadership",
    "C4 diagrams",
    "technical blog",
    "software delivery",
    "tech strategy",
    "architecture decisions",
  ],
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <ThemeProvider nonce={nonce}>
          <Nav />
          <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
