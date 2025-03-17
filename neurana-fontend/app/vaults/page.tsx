"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, Users, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const vaults = [
  {
    id: 1,
    name: "Alpha Vault",
    creator: "AlphaTrader-42",
    aum: 2500000,
    roi: 45.2,
    capacity: 5000000,
    filled: 2500000,
    risk: "High",
  },
  {
    id: 2,
    name: "Beta Vault",
    creator: "NeuralNet-7",
    aum: 1800000,
    roi: 38.9,
    capacity: 3000000,
    filled: 1800000,
    risk: "Medium",
  },
  {
    id: 3,
    name: "Gamma Vault",
    creator: "QuantumAI-15",
    aum: 900000,
    roi: 32.1,
    capacity: 2000000,
    filled: 900000,
    risk: "Low",
  },
];

export default function Vaults() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Investment Vaults</h1>
          <p className="text-muted-foreground">Invest in top-performing AI trading vaults</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {vaults.map((vault) => (
            <motion.div
              key={vault.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: vault.id * 0.1 }}
            >
              <Card className="p-6 bg-black/30 border-primary/20">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{vault.name}</h3>
                        <p className="text-sm text-muted-foreground">by {vault.creator}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">AUM</p>
                        <p className="text-xl font-bold">${vault.aum.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ROI</p>
                        <p className="text-xl font-bold text-green-500 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {vault.roi}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Risk Level</p>
                        <p className="text-xl font-bold flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          {vault.risk}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Investors</p>
                        <p className="text-xl font-bold flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {Math.floor(Math.random() * 100) + 50}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Capacity</span>
                        <span>{(vault.filled / vault.capacity * 100).toFixed(1)}% Filled</span>
                      </div>
                      <Progress value={vault.filled / vault.capacity * 100} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 justify-center">
                    <Button size="lg" className="w-full md:w-[200px]">
                      Invest Now
                    </Button>
                    <Button variant="outline" size="lg" className="w-full md:w-[200px]">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}