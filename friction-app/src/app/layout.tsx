import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Friction - Stop Impulse Buys",
  description: "Connect your bank, see your subscriptions, and get nudged before you buy. Take control of your spending habits.",
  keywords: ["impulse buying", "budgeting", "spending tracker", "subscriptions", "financial wellness"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#12121a",
          colorInputBackground: "#1a1a25",
          colorInputText: "#f9fafb",
        },
      }}
    >
      <html lang="en">
        <body className={inter.variable}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
