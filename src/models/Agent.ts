export interface TradingAgent {
  agentId: string;
  name: string;
  ownerId: string;
  trainingDataId: string;
  performanceMetrics: {
    sharpeRatio: number;
    initialBalance: number;
    finalBalance: number;
    totalTrades: number;
    winRate: number;
    roi: number;
  };
  status: "Active" | "Competing" | "Retired";
  createdAt: Date;
  updatedAt: Date;
}
