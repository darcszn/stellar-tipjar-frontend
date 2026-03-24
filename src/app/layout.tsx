import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navbar } from "@/components/Navbar";
import { WalletProvider } from "@/contexts/WalletContext";
import "@/styles/globals.css";
import { buildMetadata } from "@/utils/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Stellar Tip Jar",
    description: "Support creators globally with low-fee Stellar tips.",
  }),
  title: {
    default: "Stellar Tip Jar",
    template: "%s | Stellar Tip Jar",
  },
  keywords: ["stellar", "tip jar", "crypto tips", "creator support", "blockchain payments"],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen">
            <Navbar />
            <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
