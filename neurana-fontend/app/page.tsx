"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, BarChart, Bot, Zap, ArrowRight, LineChart } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already connected
    const walletAddress = localStorage.getItem("walletAddress");
    if (walletAddress) {
      router.push("/agent");
    }
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-6xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-6">
            Train AI Agents for{" "}
            <span className="text-primary">Automated Trading</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, train, and deploy AI trading agents with advanced strategies
            and real-time market data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-black/30 border-primary/20">
            <Brain className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Trading</h3>
            <p className="text-muted-foreground">
              Leverage advanced AI models to create sophisticated trading
              strategies.
            </p>
          </Card>

          <Card className="p-6 bg-black/30 border-primary/20">
            <BarChart className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
            <p className="text-muted-foreground">
              Real-time market data analysis and pattern recognition.
            </p>
          </Card>

          <Card className="p-6 bg-black/30 border-primary/20">
            <Bot className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Automated Execution</h3>
            <p className="text-muted-foreground">
              Fully automated trade execution with risk management.
            </p>
          </Card>
        </div>

        <div className="text-center mb-12">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => router.push("/create")}
          >
            Create Your Agent <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Train Your Agent with Real Market Data
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our platform provides a comprehensive environment for training and
              testing your AI trading agents using real market data and advanced
              simulation capabilities.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Zap className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold">Real-Time Training</h4>
                  <p className="text-sm text-muted-foreground">
                    Train your agent with live market data
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <LineChart className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold">Performance Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Track and analyze your agent's performance
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Card className="aspect-video bg-black/30 border-primary/20" />
        </div>
      </div>
    </main>
  );
}
