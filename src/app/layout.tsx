import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/Providers";
import { themeInitScript } from "@/lib/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUTR Connect",
  description: "Staff console for jobs, approvals, evidence, and the homeowner portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased rutr-shell`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
