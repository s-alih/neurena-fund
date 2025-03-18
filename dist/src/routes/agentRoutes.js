"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agentController_1 = require("../controllers/agentController");
const router = (0, express_1.Router)();
// Create a new agent
router.post("/", agentController_1.createAgent);
// Get agent by owner ID (wallet address)
router.get("/owner/:ownerId", agentController_1.getAgentByOwnerId);
// Chat functionality
router.get("/:agentId/chat", agentController_1.getChatHistory);
router.post("/:agentId/chat", agentController_1.sendMessage);
exports.default = router;
