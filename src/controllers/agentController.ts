import { RequestHandler } from "express";
import { AgentService } from "../services/agentService";
import { GeminiService } from "../services/geminiService";
import { ChromaService, ChatMessage } from "../services/chromaService";
import { TradingAgent } from "../models/Agent";

const agentService = new AgentService();
const geminiService = new GeminiService();
const chromaService = new ChromaService();

export const createAgent: RequestHandler = async (req, res) => {
  try {
    const { name, ownerId } = req.body;

    if (!name || !ownerId) {
      res.status(400).json({ error: "Name and ownerId are required" });
      return;
    }

    const newAgent: TradingAgent = {
      agentId: `${ownerId}_${Date.now()}`, // Generate unique ID
      name,
      ownerId,
      trainingDataId: "", // Will be populated during training
      performanceMetrics: {
        sharpeRatio: 0,
        initialBalance: 10000,
        finalBalance: 10000,
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

export const getAgentByOwnerId: RequestHandler = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const agent = await agentService.getAgentByOwnerId(ownerId);

    if (!agent) {
      res.status(404).json({ error: "No agent found for this owner" });
      return;
    }

    res.status(200).json(agent);
  } catch (error: any) {
    console.error("Error getting agent:", error);
    res.status(500).json({ error: error.message || "Error getting agent" });
  }
};

export const getChatHistory: RequestHandler = async (req, res) => {
  try {
    const { agentId } = req.params;
    const chatHistory = await chromaService.getChatHistory(agentId);
    res.status(200).json(chatHistory);
  } catch (error: any) {
    console.error("Error getting chat history:", error);
    res
      .status(500)
      .json({ error: error.message || "Error getting chat history" });
  }
};

export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // Store user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      agentId,
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    await chromaService.storeChatMessage(userMessage);

    // Get chat history for context
    const chatHistory = await chromaService.getChatHistory(agentId);
    const context = chatHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // Set up streaming response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    // Generate and stream AI response
    const responseStream = geminiService.generateResponseStream(
      message,
      context
    );
    for await (const chunk of responseStream) {
      fullResponse += chunk;
      res.write(`data: ${chunk}\n\n`);
    }

    // Store AI response
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      agentId,
      role: "assistant",
      content: fullResponse,
      timestamp: new Date(),
    };
    await chromaService.storeChatMessage(aiResponse);

    res.end();
  } catch (error: any) {
    console.error("Error processing message:", error);
    res
      .status(500)
      .json({ error: error.message || "Error processing message" });
  }
};
