export interface User {
  userId: string;
  walletAddress: string;
  role: "Trader" | "Investor" | "AI_Creator";
  createdAt: Date;
  updatedAt: Date;
}
