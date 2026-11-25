import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "RUTR Connect",
  description:
    "Staff console for Rutters Connect — jobs, approvals, integrations, and homeowner portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable} antialiased rutr-shell`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
