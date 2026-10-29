import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import ThemeProvider from "@/app/components/ui/ThemeProvider";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arlodel.pages.dev"),
  title: "Hakeeem | Full-Stack Developer",
  description:
    "Portfolio of Alif Nur Rahman Hakim (Hakeeem) — Information Systems student & freelance full-stack developer crafting minimal, resilient web experiences.",
  keywords: [
    "Alif Nur Rahman Hakim",
    "Hakeeem",
    "ArloDel",
    "Full-Stack Developer",
    "Next.js",
    "Laravel",
    "TypeScript",
    "Tailwind CSS",
    "Web Developer Surabaya",
  ],
  authors: [{ name: "Alif Nur Rahman Hakim", url: "https://github.com/ArloDel" }],
  creator: "Alif Nur Rahman Hakim",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arlodel.pages.dev",
    title: "Alif Nur Rahman Hakim | Full-Stack Developer",
    description:
      "Crafting minimal, resilient web experiences with precise UIs and clean architecture — Next.js, TypeScript & Laravel.",
    siteName: "Hakeeem Portfolio",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Alif Nur Rahman Hakim — Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alif Nur Rahman Hakim | Full-Stack Developer",
    description:
      "Crafting minimal, resilient web experiences with precise UIs and clean architecture.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0C" },
    { media: "(prefers-color-scheme: light)", color: "#F6F7FA" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="noise min-h-screen bg-canvas font-sans text-ink antialiased selection:bg-accent/30 selection:text-ink-hi">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
