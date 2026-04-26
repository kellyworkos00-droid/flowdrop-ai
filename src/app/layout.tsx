import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import "@/styles/globals.css";
import { AppProviders } from "@/providers/app-providers";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flowdrop-ai.vercel.app"),
  title: {
    default: "FlowDrop - AI Workflow Command Center",
    template: "%s | FlowDrop",
  },
  description:
    "FlowDrop is the AI workflow operating system for teams: command-center execution, automation, accountability, and auditable collaboration in one app.",
  keywords: [
    "FlowDrop",
    "workflow management",
    "team productivity",
    "AI project management",
    "task automation",
    "team collaboration",
    "SLA tracking",
    "audit trail",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://flowdrop-ai.vercel.app",
    title: "FlowDrop - AI Workflow Command Center",
    description:
      "Run your team with less noise and more momentum using command-center execution, AI insights, and one-click workflow actions.",
    siteName: "FlowDrop",
    images: [
      {
        url: "/screenshots/command-center.svg",
        width: 1400,
        height: 900,
        alt: "FlowDrop command center screenshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowDrop - AI Workflow Command Center",
    description:
      "Command-center workflows, AI risk signals, team accountability, and audit-ready operations in one place.",
    images: ["/screenshots/command-center.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "9f0309d1e55a97d8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
