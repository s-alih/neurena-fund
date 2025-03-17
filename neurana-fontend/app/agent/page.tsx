"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Send, ChartBar, MessageSquare, Settings, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AgentDashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI trading agent. How would you like to train me today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      {
        role: "user",
        content: input,
        timestamp: new Date(),
      },
      {
        role: "assistant",
        content: "I understand your trading strategy. I'll adapt my parameters accordingly.",
        timestamp: new Date(),
      },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Your AI Agent</h1>
              <p className="text-muted-foreground">Train and monitor your AI trading agent</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Configure
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Training Chat
                </TabsTrigger>
                <TabsTrigger value="performance" className="gap-2">
                  <ChartBar className="w-4 h-4" />
                  Performance
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat">
                <Card className="p-6 bg-black/30 border-primary/20">
                  <div className="h-[500px] flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-lg ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs opacity-50 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <Input
                        placeholder="Train your AI agent..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <Button onClick={sendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="performance">
                <Card className="p-6 bg-black/30 border-primary/20">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-black/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Current ROI</p>
                        <p className="text-2xl font-bold text-green-500">+28.5%</p>
                      </div>
                      <div className="p-4 bg-black/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="text-2xl font-bold">72%</p>
                      </div>
                    </div>
                    <div className="h-[300px] flex items-center justify-center border border-primary/20 rounded-lg">
                      <p className="text-muted-foreground">Performance Chart Coming Soon</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Card className="p-6 bg-black/30 border-primary/20">
            <h3 className="text-xl font-bold mb-6">Tournament Status</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Rank</p>
                  <p className="text-2xl font-bold">#4</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Brain className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Training Progress</p>
                  <p className="text-2xl font-bold">Level 3</p>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Join Next Tournament
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}