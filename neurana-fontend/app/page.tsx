"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Trophy,
  Wallet,
  ChartBar,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState({
    aum: 0,
    agents: 0,
    investors: 0,
  });

  useEffect(() => {
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
    } else {
      router.push("/agent");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

        <div className="container relative z-10 text-center">
          <motion.div
            className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary">
              Neurena Fund • Powered by Injective
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            AI-Powered Trading Agents for Elite Performance
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Deploy sophisticated AI trading agents, compete in high-stakes
            tournaments, and access institutional liquidity pools.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={handleLaunchApp}
            >
              Launch app <ArrowRight className="ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              View Performance
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/50 backdrop-blur-xl">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCard
              title="Assets Under Management"
              value={`$${(stats.aum / 1000000).toFixed(1)}M`}
              icon={<ChartBar className="w-6 h-6" />}
              subtitle="Total value managed by AI agents"
            />
            <StatsCard
              title="Active Trading Agents"
              value={stats.agents.toString()}
              icon={<Brain className="w-6 h-6" />}
              subtitle="AI agents in production"
            />
            <StatsCard
              title="Institutional Investors"
              value={stats.investors.toString()}
              icon={<Users className="w-6 h-6" />}
              subtitle="Professional traders & funds"
            />
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
            <FeatureCard
              title="Advanced AI Deployment"
              description="Deploy sophisticated trading algorithms with institutional-grade execution capabilities"
              icon={<Brain className="w-12 h-12" />}
              metric="Sub-ms Latency"
            />
            <FeatureCard
              title="Performance-Based Allocation"
              description="Compete in high-stakes tournaments to earn allocation from the institutional liquidity pool"
              icon={<Trophy className="w-12 h-12" />}
              metric="Up to $10M Allocation"
            />
            <FeatureCard
              title="Managed Liquidity Vaults"
              description="Access professional-grade liquidity pools with sophisticated risk management"
              icon={<Wallet className="w-12 h-12" />}
              metric="$250M+ Total AUM"
            />
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
                    <TrendingUp className="w-6 h-6 text-primary" />
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
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-muted-foreground">
                      Active Trading Agents
                    </p>
                  </div>
                </div>
                <Button size="lg" className="mt-6">
                  View All Performance Stats
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Card className="p-6 bg-black/30 border-primary/20">
                <div className="aspect-square rounded-lg bg-black/50 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Performance Chart Coming Soon
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle: string;
}

function StatsCard({ title, value, icon, subtitle }: StatsCardProps) {
  return (
    <Card className="p-6 bg-black/30 border-primary/20 backdrop-blur-xl">
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
    </Card>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  metric: string;
}

function FeatureCard({ title, description, icon, metric }: FeatureCardProps) {
  return (
    <Card className="p-8 bg-black/30 border-primary/20 backdrop-blur-xl hover:scale-105 transition-transform">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="p-4 rounded-full bg-primary/10 mb-4">{icon}</div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <div className="mt-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <span className="text-primary font-medium">{metric}</span>
        </div>
      </div>
    </Card>
  );
}
