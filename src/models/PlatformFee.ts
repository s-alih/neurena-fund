export interface PlatformFee {
  feeId: string;
  tournamentId?: string;
  vaultId?: string;
  agentId?: string;
  feeAmount: number;
  feeType: "EntryFee" | "ProfitShare" | "TransactionFee";
  timestamp: Date;
}
