export interface Investment {
  investmentId: string;
  userId: string;
  agentId: string;
  amountInvested: number;
  returnGenerated: number;
  status: "Active" | "Withdrawn";
  createdAt: Date;
  updatedAt: Date;
}
