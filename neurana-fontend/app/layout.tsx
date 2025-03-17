import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "./components/navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neurena Fund - AI Trading Agent Launchpad",
  description:
    "Deploy sophisticated AI trading agents, compete in high-stakes tournaments, and access institutional liquidity pools on Injective.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="neurena-theme"
        >
          <Navbar />
          <main
            className={cn(
              "min-h-screen",
              // Add top padding to all pages except home
              "pt-16" // This matches the navbar height
            )}
          >
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
