export interface Tournament {
    tournamentId: string;
    entryFee: number;
    participants: string[]; // List of agentIds
    startTime: Date;
    endTime: Date;
    prizePool: number;
    winnerAgentId?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  