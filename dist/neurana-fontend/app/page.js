"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const navigation_1 = require("next/navigation");
function Home() {
    const router = (0, navigation_1.useRouter)();
    const [stats, setStats] = (0, react_1.useState)({
        aum: 0,
        agents: 0,
        investors: 0,
    });
    (0, react_1.useEffect)(() => {
        // Animate stats
        const interval = setInterval(() => {
            setStats({
                aum: Math.min(stats.aum + 1000000, 250000000),
                agents: Math.min(stats.agents + 1, 156),
                investors: Math.min(stats.investors + 10, 2500),
            });
        }, 50);
        return () => clearInterval(interval);
    }, [stats]);
    const handleLaunchApp = () => {
        const walletAddress = localStorage.getItem("walletAddress");
        if (!walletAddress) {
            router.push("/connect");
        }
        else {
            router.push("/agent");
        }
    };
    return (<main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-10"/>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"/>

        <div className="container relative z-10 text-center">
          <framer_motion_1.motion.div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary">
              Neurena Fund • Powered by Injective
            </span>
          </framer_motion_1.motion.div>

          <framer_motion_1.motion.h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            AI-Powered Trading Agents for Elite Performance
          </framer_motion_1.motion.h1>

          <framer_motion_1.motion.p className="text-xl md:text-2xl mb-8 text-muted-foreground" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            Deploy sophisticated AI trading agents, compete in high-stakes
            tournaments, and access institutional liquidity pools.
          </framer_motion_1.motion.p>

          <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex gap-4 justify-center">
            <button_1.Button size="lg" className="bg-primary hover:bg-primary/90" onClick={handleLaunchApp}>
              Launch app <lucide_react_1.ArrowRight className="ml-2"/>
            </button_1.Button>
            <button_1.Button size="lg" variant="outline">
              View Performance
            </button_1.Button>
          </framer_motion_1.motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/50 backdrop-blur-xl">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCard title="Assets Under Management" value={`$${(stats.aum / 1000000).toFixed(1)}M`} icon={<lucide_react_1.ChartBar className="w-6 h-6"/>} subtitle="Total value managed by AI agents"/>
            <StatsCard title="Active Trading Agents" value={stats.agents.toString()} icon={<lucide_react_1.Brain className="w-6 h-6"/>} subtitle="AI agents in production"/>
            <StatsCard title="Institutional Investors" value={stats.investors.toString()} icon={<lucide_react_1.Users className="w-6 h-6"/>} subtitle="Professional traders & funds"/>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">
            Institutional-Grade Trading Infrastructure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard title="Advanced AI Deployment" description="Deploy sophisticated trading algorithms with institutional-grade execution capabilities" icon={<lucide_react_1.Brain className="w-12 h-12"/>} metric="Sub-ms Latency"/>
            <FeatureCard title="Performance-Based Allocation" description="Compete in high-stakes tournaments to earn allocation from the institutional liquidity pool" icon={<lucide_react_1.Trophy className="w-12 h-12"/>} metric="Up to $10M Allocation"/>
            <FeatureCard title="Managed Liquidity Vaults" description="Access professional-grade liquidity pools with sophisticated risk management" icon={<lucide_react_1.Wallet className="w-12 h-12"/>} metric="$250M+ Total AUM"/>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="py-20 bg-black/30">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6">Proven Track Record</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <lucide_react_1.TrendingUp className="w-6 h-6 text-primary"/>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">45.2% APY</p>
                    <p className="text-muted-foreground">
                      Top Agent Performance
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <lucide_react_1.Users className="w-6 h-6 text-primary"/>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-muted-foreground">
                      Active Trading Agents
                    </p>
                  </div>
                </div>
                <button_1.Button size="lg" className="mt-6">
                  View All Performance Stats
                </button_1.Button>
              </div>
            </div>
            <div className="flex-1">
              <card_1.Card className="p-6 bg-black/30 border-primary/20">
                <div className="aspect-square rounded-lg bg-black/50 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Performance Chart Coming Soon
                  </p>
                </div>
              </card_1.Card>
            </div>
          </div>
        </div>
      </section>
    </main>);
}
function StatsCard({ title, value, icon, subtitle }) {
    return (<card_1.Card className="p-6 bg-black/30 border-primary/20 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-primary/10">{icon}</div>
        <div>
          <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            {value}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>
    </card_1.Card>);
}
function FeatureCard({ title, description, icon, metric }) {
    return (<card_1.Card className="p-8 bg-black/30 border-primary/20 backdrop-blur-xl hover:scale-105 transition-transform">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="p-4 rounded-full bg-primary/10 mb-4">{icon}</div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <div className="mt-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <span className="text-primary font-medium">{metric}</span>
        </div>
      </div>
    </card_1.Card>);
}
