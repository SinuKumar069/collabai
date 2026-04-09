import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollabAI | Intelligent Team Orchestration",
  description:
    "AI-powered collaborative project management platform for modern engineering teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#020617] text-slate-200 selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
        {/* Global Aesthetic Overlay - Subtle Glow */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full opacity-50" />
        </div>

        <Providers>
          {/* Header sits on top of all pages */}
          <Header />

          {/* Main content wrapper */}
          <main className="flex-1 flex flex-col relative">
            {/* Page Transition/Loading Space */}
            {children}
          </main>
        </Providers>

        {/* Global Border Accents */}
        <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800/50 to-transparent z-50 pointer-events-none" />
      </body>
    </html>
  );
}
