export interface Vault {
  vaultId: string;
  investors: string[]; // List of userIds
  totalFunds: number;
  winningAgentId?: string;
  profitShare: {
    agent: number;
    investors: number;
    roi: number;
    platformFee: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
