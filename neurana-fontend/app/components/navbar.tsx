"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Trophy, Wallet, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// This would come from your auth/state management
const hasAgent = true; // Toggle this to test different states

const navigation = [
  { name: "Agent", href: "/agent", icon: Brain },
  { name: "Game", href: "/leaderboard", icon: Trophy },
  { name: "Vaults", href: "/vaults", icon: Wallet },
];

export function Navbar() {
  const pathname = usePathname();

  // Don't render navbar on home page
  if (pathname === "/") {
    return null;
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-8">
            <Brain className="w-8 h-8" />
          </Link>

          <div className="flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
