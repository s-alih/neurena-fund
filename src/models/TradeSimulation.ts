export interface TradeSimulation {
  tradeId: string;
  agentId: string;
  pair: string; // e.g., "ETH/USDT"
  tradeType: "Buy" | "Sell";
  amount: number;
  price: number;
  timestamp: Date;
}
