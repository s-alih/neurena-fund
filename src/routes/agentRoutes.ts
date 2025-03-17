import { Router } from "express";
import {
  createAgent,
  getAgentByOwnerId,
  getChatHistory,
  sendMessage,
} from "../controllers/agentController";

const router = Router();

// Create a new agent
router.post("/", createAgent);

// Get agent by owner ID (wallet address)
router.get("/owner/:ownerId", getAgentByOwnerId);

// Chat functionality
router.get("/:agentId/chat", getChatHistory);
router.post("/:agentId/chat", sendMessage);

export default router;
