"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ChartBar, Gauge, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function CreateAgent() {
  const [strategy, setStrategy] = useState("scalping");
  const [riskLevel, setRiskLevel] = useState(50);
  const [liveData, setLiveData] = useState(false);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Create Your AI Trading Agent</h1>
          <p className="text-muted-foreground">Configure your AI agent's trading strategy and parameters</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-black/30 border-primary/20">
              <div className="space-y-8">
                {/* Strategy Selection */}
                <div>
                  <Label className="text-lg mb-4">Trading Strategy</Label>
                  <Select value={strategy} onValueChange={setStrategy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scalping">Scalping</SelectItem>
                      <SelectItem value="arbitrage">Arbitrage</SelectItem>
                      <SelectItem value="trend">Trend Following</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Risk Level */}
                <div>
                  <Label className="text-lg mb-4">Risk Level</Label>
                  <div className="space-y-4">
                    <Slider
                      value={[riskLevel]}
                      onValueChange={([value]) => setRiskLevel(value)}
                      max={100}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Conservative</span>
                      <span>Balanced</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                </div>

                {/* Data Feed Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-lg">Live Data Feed</Label>
                    <p className="text-sm text-muted-foreground">Use real-time market data for training</p>
                  </div>
                  <Switch
                    checked={liveData}
                    onCheckedChange={setLiveData}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Preview */}
          <Card className="p-6 bg-black/30 border-primary/20">
            <h3 className="text-xl font-bold mb-6">Performance Preview</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Gauge className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Expected ROI</p>
                  <p className="text-2xl font-bold">12.5%</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ChartBar className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">68%</p>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Start Training <Brain className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}