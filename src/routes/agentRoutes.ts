import { Router } from "express";
import { createAgent, getAgentByOwnerId } from "../controllers/agentController";

const router = Router();

// Create a new agent
router.post("/", createAgent);

// Get agent by owner ID (wallet address)
router.get("/owner/:ownerId", getAgentByOwnerId);

export default router;
