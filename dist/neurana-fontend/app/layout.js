"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
require("./globals.css");
const google_1 = require("next/font/google");
const theme_provider_1 = require("@/components/theme-provider");
const navbar_1 = require("./components/navbar");
const utils_1 = require("@/lib/utils");
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "Neurena Fund - AI Trading Agent Launchpad",
    description: "Deploy sophisticated AI trading agents, compete in high-stakes tournaments, and access institutional liquidity pools on Injective.",
};
function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <theme_provider_1.ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="neurena-theme">
          <navbar_1.Navbar />
          <main className={(0, utils_1.cn)("min-h-screen", 
        // Add top padding to all pages except home
        "pt-16" // This matches the navbar height
        )}>
            {children}
          </main>
        </theme_provider_1.ThemeProvider>
      </body>
    </html>);
}
