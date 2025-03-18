"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navbar = Navbar;
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
// This would come from your auth/state management
const hasAgent = true; // Toggle this to test different states
const navigation = [
    { name: "Agent", href: "/agent", icon: lucide_react_1.Brain },
    { name: "Game", href: "/leaderboard", icon: lucide_react_1.Trophy },
    { name: "Vaults", href: "/vaults", icon: lucide_react_1.Wallet },
];
function Navbar() {
    const pathname = (0, navigation_1.usePathname)();
    // Don't render navbar on home page
    if (pathname === "/") {
        return null;
    }
    return (<nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <link_1.default href="/" className="mr-8">
            <lucide_react_1.Brain className="w-8 h-8"/>
          </link_1.default>

          <div className="flex gap-6">
            {navigation.map((item) => (<link_1.default key={item.href} href={item.href} className={(0, utils_1.cn)("flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary", pathname === item.href
                ? "text-primary"
                : "text-muted-foreground")}>
                {item.icon && <item.icon className="w-4 h-4"/>}
                {item.name}
              </link_1.default>))}
          </div>
        </div>
      </div>
    </nav>);
}
