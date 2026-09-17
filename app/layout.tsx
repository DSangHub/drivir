import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drivir — Safe Moves. Real Rewards.",
  description: "Turn everyday trips into a safe-driving game and earn points for better decisions behind the wheel.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
