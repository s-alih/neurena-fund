import { TradingAgent } from "../models/Agent";
import { agentsCollection } from "../config";

export class AgentService {
  async createAgent(agent: TradingAgent): Promise<TradingAgent> {
    try {
      // Check if owner already has an agent
      const existingAgent = await this.getAgentByOwnerId(agent.ownerId);
      if (existingAgent) {
        throw new Error("Owner already has an agent");
      }

      await agentsCollection.doc(agent.agentId).set(agent);
      return agent;
    } catch (error) {
      throw error;
    }
  }

  async getAgentByOwnerId(ownerId: string): Promise<TradingAgent | null> {
    try {
      const querySnapshot = await agentsCollection
        .where("ownerId", "==", ownerId)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return { ...doc.data(), agentId: doc.id } as TradingAgent;
    } catch (error) {
      throw error;
    }
  }
}
