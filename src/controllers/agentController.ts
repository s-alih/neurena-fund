import { Request, Response } from "express";
import { AgentService } from "../services/agentService";
import { TradingAgent } from "../models/Agent";

const agentService = new AgentService();

export const createAgent = async (req: Request, res: Response) => {
  try {
    const { name, ownerId } = req.body;

    if (!name || !ownerId) {
      return res.status(400).json({ error: "Name and ownerId are required" });
    }

    const newAgent: TradingAgent = {
      agentId: `${ownerId}_${Date.now()}`, // Generate unique ID
      name,
      ownerId,
      trainingDataId: "", // Will be populated during training
      performanceMetrics: {
        sharpeRatio: 0,
        totalTrades: 0,
        winRate: 0,
        roi: 0,
      },
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdAgent = await agentService.createAgent(newAgent);
    res.status(201).json(createdAgent);
  } catch (error: any) {
    console.error("Error creating agent:", error);
    res.status(500).json({ error: error.message || "Error creating agent" });
  }
};

export const getAgentByOwnerId = async (req: Request, res: Response) => {
  try {
    const { ownerId } = req.params;
    const agent = await agentService.getAgentByOwnerId(ownerId);

    if (!agent) {
      return res.status(404).json({ error: "No agent found for this owner" });
    }

    res.status(200).json(agent);
  } catch (error: any) {
    console.error("Error getting agent:", error);
    res.status(500).json({ error: error.message || "Error getting agent" });
  }
};
