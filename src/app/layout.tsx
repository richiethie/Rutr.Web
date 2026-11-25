import type { Metadata } from "next";
import { Archivo_Black, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "RUTR — Contractor OS",
  description:
    "Connect field evidence to homeowner updates. Staff approvals and live portal for Rutters Roofing & Exteriors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased rutr-shell`}>
        {children}
      </body>
    </html>
  );
}
