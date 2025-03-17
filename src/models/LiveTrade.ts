export interface LiveTradeExecution {
  executionId: string;
  agentId: string;
  vaultId: string;
  pair: string;
  tradeType: "Buy" | "Sell";
  amount: number;
  price: number;
  executionStatus: "Pending" | "Completed" | "Failed";
  timestamp: Date;
}
