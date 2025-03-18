"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Brain,
  BarChart2,
  Bot,
  Zap,
  ArrowRight,
  LineChart,
  Settings,
  MessageSquare,
  PlayCircle,
  RefreshCw,
  TrendingUp,
  BookOpen,
  Target,
  Send,
  GitBranch,
  History,
  Workflow,
  PauseCircle,
} from "lucide-react";

interface Message {
  role: string;
  content: string;
  timestamp: Date;
}

interface Agent {
  agentId: string;
  name: string;
  owner: string;
}

interface Trade {
  id: string;
  timestamp: Date;
  type: string;
  amount: number;
  price: number;
  executionStatus: string;
}

interface TrainingSession {
  id: string;
  status: string;
  startTime: Date;
  metrics: {
    accuracy: number;
    profitLoss: number;
    tradesExecuted: number;
  };
}

const TRAINING_TOPICS = [
  {
    title: "Risk Management",
    examples: [
      "Set stop loss at 2% of portfolio value",
      "Use dynamic position sizing based on volatility",
      "Implement trailing stops for trending markets",
    ],
    icon: Brain,
    level: "Beginner",
  },
  {
    title: "Market Analysis",
    examples: [
      "Analyze BTC/USD price action during high volatility",
      "Monitor volume patterns in trending markets",
      "Identify key support and resistance levels",
    ],
    icon: BarChart2,
    level: "Intermediate",
  },
  {
    title: "Strategy Development",
    examples: [
      "Create a mean reversion strategy for ranging markets",
      "Develop trend following rules with multiple timeframes",
      "Design breakout trading conditions",
    ],
    icon: Target,
    level: "Advanced",
  },
  {
    title: "Performance Optimization",
    examples: [
      "Optimize entry timing based on market conditions",
      "Adjust position sizing for different volatility regimes",
      "Fine-tune take profit levels",
    ],
    icon: Zap,
    level: "Expert",
  },
];

export default function AgentDashboard() {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(
    null
  );
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoadingTrades, setIsLoadingTrades] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkWalletAndFetchAgent = async () => {
      try {
        const walletAddress = localStorage.getItem("walletAddress");
        console.log("Wallet Address:", walletAddress);

        if (!walletAddress) {
          console.log("No wallet address found");
          router.push("/connect");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agents/owner/${walletAddress}`
        );
        console.log("Response Status:", response.status);

        if (response.status === 404) {
          console.log("Agent not found, redirecting to create");
          router.push("/create");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch agent");
        }

        const agentData = await response.json();
        console.log("Agent Data:", agentData);

        if (isMounted) {
          setAgent(agentData);
          console.log("Agent State Set");

          // Fetch chat history
          try {
            console.log("Fetching chat history for agent:", agentData.agentId);
            const chatResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agents/${agentData.agentId}/chat`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("Chat history response status:", chatResponse.status);

            if (!chatResponse.ok) {
              const errorText = await chatResponse.text();
              console.error("Failed to fetch chat history:", errorText);
              throw new Error(`Failed to fetch chat history: ${errorText}`);
            }

            const chatHistory = await chatResponse.json();
            console.log("Received chat history:", chatHistory);

            if (Array.isArray(chatHistory)) {
              setMessages(
                chatHistory.map((msg) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp),
                }))
              );
              console.log("Chat History Set");
            } else {
              console.error("Invalid chat history format:", chatHistory);
              toast.error("Invalid chat history format received");
            }
          } catch (chatError) {
            console.error("Error fetching chat history:", chatError);
            toast.error("Failed to load chat history");
          }
        }
      } catch (error: any) {
        console.error("Error:", error);
        toast.error(error.message || "Failed to fetch agent data");
      } finally {
        if (isMounted) {
          console.log("Setting isLoading to false");
          setIsLoading(false);
        }
      }
    };

    checkWalletAndFetchAgent();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    const fetchTrades = async () => {
      if (!agent) return;
      setIsLoadingTrades(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trades/agent/${agent.agentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trades");
        }
        const tradesData = await response.json();
        setTrades(
          tradesData.map((trade: any) => ({
            ...trade,
            timestamp: new Date(trade.timestamp),
          }))
        );
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch trades");
      } finally {
        setIsLoadingTrades(false);
      }
    };

    fetchTrades();
    // Set up an interval to fetch trades every 30 seconds
    const interval = setInterval(fetchTrades, 30000);
    return () => clearInterval(interval);
  }, [agent]);

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  const startTrainingSession = () => {
    setActiveSession({
      id: Date.now().toString(),
      status: "active",
      startTime: new Date(),
      metrics: {
        accuracy: 0,
        profitLoss: 0,
        tradesExecuted: 0,
      },
    });
  };

  const toggleSimulation = () => {
    setShowSimulation(!showSimulation);
  };

  const sendMessage = async () => {
    if (!input.trim() || !agent) {
      console.log("No input or agent:", { input, agent });
      return;
    }

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      console.log(
        "Sending message to:",
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agents/${agent.agentId}/chat`
      );
      console.log("Message payload:", { message: input });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agents/${agent.agentId}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
          signal: signal,
        }
      );

      console.log("Chat response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Chat error response:", errorText);
        throw new Error(`Failed to send message: ${errorText}`);
      }

      if (!response.body) {
        throw new Error("No response body available");
      }

      const reader = response.body.getReader();
      let aiResponse = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("Stream complete");
            break;
          }

          // Check if the connection is still alive
          if (signal.aborted) {
            throw new Error("Connection aborted");
          }

          const text = new TextDecoder().decode(value);
          console.log("Received chunk:", text);

          const lines = text.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const content = line.slice(6);
              console.log("Parsed content:", content);
              aiResponse += content;

              // Update messages atomically to prevent race conditions
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];

                if (lastMessage?.role === "assistant") {
                  return [
                    ...newMessages.slice(0, -1),
                    {
                      ...lastMessage,
                      content: aiResponse,
                      timestamp: new Date(),
                    },
                  ];
                } else {
                  return [
                    ...newMessages,
                    {
                      role: "assistant",
                      content: aiResponse,
                      timestamp: new Date(),
                    },
                  ];
                }
              });
            }
          }
        }
      } catch (streamError) {
        console.error("Stream error:", streamError);
        reader.cancel();
        throw streamError;
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      if (error.name === "AbortError") {
        toast.error("Connection timed out. Please try again.");
      } else {
        toast.error(error.message || "Failed to send message");
      }

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "Sorry, there was an error processing your message. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      controller.abort(); // Clean up the controller
    }
  };

  if (isLoading) {
    console.log("Rendering loading state");
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!agent) {
    console.log("No agent found, rendering null");
    return null;
  }

  console.log("Rendering main dashboard");
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
              <h1 className="text-4xl font-bold mb-4">{agent.name}</h1>
              <p className="text-muted-foreground">
                Train and monitor your AI trading agent
              </p>
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Training Chat
                </TabsTrigger>
                <TabsTrigger value="simulation" className="gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Latest Trades
                </TabsTrigger>
                <TabsTrigger value="performance" className="gap-2">
                  <BarChart2 className="w-4 h-4" />
                  Performance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat">
                <Card className="p-6 bg-black/30 border-primary/20">
                  {activeSession && (
                    <div className="mb-4 p-3 bg-primary/10 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-primary" />
                        <span className="text-sm">Training Session Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Accuracy: {activeSession.metrics.accuracy}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          P/L: ${activeSession.metrics.profitLoss}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="h-[500px] flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {messages.length === 0 && (
                        <div className="text-center text-muted-foreground p-4">
                          <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">
                            Start Training Your Agent
                          </h3>
                          <p className="text-sm">
                            Choose a topic below or ask your own questions to
                            train your AI trading agent.
                          </p>
                        </div>
                      )}

                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
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
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] p-4 rounded-lg bg-muted">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Input
                        placeholder="Train your AI agent..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        disabled={isTyping}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={isTyping || !input.trim()}
                      >
                        {isTyping ? (
                          <div className="animate-spin">
                            <RefreshCw className="w-4 h-4" />
                          </div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex justify-between items-center gap-2 mb-4">
                      <div className="flex gap-2">
                        {!activeSession ? (
                          <Button
                            size="sm"
                            onClick={startTrainingSession}
                            className="gap-2"
                          >
                            <PlayCircle className="w-4 h-4" />
                            Start Training
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveSession(null)}
                            className="gap-2"
                          >
                            <PauseCircle className="w-4 h-4" />
                            End Session
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={toggleSimulation}
                          className="gap-2"
                        >
                          <GitBranch className="w-4 h-4" />
                          Toggle Simulation
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="gap-2">
                          <History className="w-4 h-4" />
                          History
                        </Button>
                        <Button size="sm" variant="ghost" className="gap-2">
                          <Workflow className="w-4 h-4" />
                          Workflow
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {TRAINING_TOPICS.map((topic) => (
                        <Button
                          key={topic.title}
                          variant={
                            selectedTopic === topic.title
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setSelectedTopic(
                              topic.title === selectedTopic ? null : topic.title
                            )
                          }
                          className="whitespace-nowrap"
                        >
                          <topic.icon className="w-4 h-4 mr-2" />
                          {topic.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="simulation">
                <Card className="p-6 bg-black/30 border-primary/20">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Latest Trades</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!agent) return;
                          setIsLoadingTrades(true);
                          fetch(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trades/agent/${agent.agentId}`
                          )
                            .then((response) => {
                              if (!response.ok)
                                throw new Error("Failed to fetch trades");
                              return response.json();
                            })
                            .then((tradesData) => {
                              setTrades(
                                tradesData.map((trade: any) => ({
                                  ...trade,
                                  timestamp: new Date(trade.timestamp),
                                }))
                              );
                            })
                            .catch((error) => {
                              toast.error(
                                error.message || "Failed to fetch trades"
                              );
                            })
                            .finally(() => {
                              setIsLoadingTrades(false);
                            });
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-black/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Total Trades
                        </p>
                        <p className="text-xl font-bold">{trades.length}</p>
                      </div>
                      <div className="p-3 bg-black/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Success Rate
                        </p>
                        <p className="text-xl font-bold">
                          {trades.length > 0
                            ? (
                                (trades.filter(
                                  (t) => t.executionStatus === "Completed"
                                ).length /
                                  trades.length) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </p>
                      </div>
                      <div className="p-3 bg-black/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          24h Volume
                        </p>
                        <p className="text-xl font-bold">
                          $
                          {trades
                            .filter(
                              (t) =>
                                new Date().getTime() -
                                  new Date(t.timestamp).getTime() <
                                24 * 60 * 60 * 1000
                            )
                            .reduce((acc, t) => acc + t.amount * t.price, 0)
                            .toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="performance">
                <Card className="p-6 bg-black/30 border-primary/20">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-black/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Current ROI
                        </p>
                        <p className="text-2xl font-bold text-green-500">
                          +28.5%
                        </p>
                      </div>
                      <div className="p-4 bg-black/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Win Rate
                        </p>
                        <p className="text-2xl font-bold">72%</p>
                      </div>
                    </div>
                    <div className="h-[300px] flex items-center justify-center border border-primary/20 rounded-lg">
                      <p className="text-muted-foreground">
                        Performance Chart Coming Soon
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Card className="p-6 bg-black/30 border-primary/20">
            <h3 className="text-xl font-bold mb-6">Training Progress</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Training Level
                  </p>
                  <p className="text-2xl font-bold">Level 3</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Brain className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Topics Mastered
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">2/8</p>
                    <span className="text-xs text-muted-foreground">
                      Topics
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Current Training Focus
                </h4>
                <div className="space-y-2">
                  {TRAINING_TOPICS.slice(0, 4).map((topic, index) => (
                    <div key={topic.title} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      <span className="text-sm">{topic.title}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {topic.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Training Milestones
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Basic Risk Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Market Analysis Fundamentals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Advanced Strategy Development</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <span>Portfolio Optimization</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Agent Stats
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-black/20 rounded">
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="text-lg font-semibold">72%</p>
                  </div>
                  <div className="p-2 bg-black/20 rounded">
                    <p className="text-xs text-muted-foreground">
                      Profit Factor
                    </p>
                    <p className="text-lg font-semibold">1.8</p>
                  </div>
                  <div className="p-2 bg-black/20 rounded">
                    <p className="text-xs text-muted-foreground">
                      Sharpe Ratio
                    </p>
                    <p className="text-lg font-semibold">2.1</p>
                  </div>
                  <div className="p-2 bg-black/20 rounded">
                    <p className="text-xs text-muted-foreground">
                      Max Drawdown
                    </p>
                    <p className="text-lg font-semibold">-12%</p>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg">
                View Detailed Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
