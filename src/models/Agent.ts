export interface TradingAgent {
  agentId: string;
  name:string;
  ownerId: string;
  trainingDataId: string;
  performanceMetrics: {
    sharpeRatio: number;
    totalTrades: number;
    winRate: number;
    roi: number;
  };
  status: "Active" | "Competing" | "Retired";
  createdAt: Date;
  updatedAt: Date;
}
