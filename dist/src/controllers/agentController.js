"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getChatHistory = exports.getAgentByOwnerId = exports.createAgent = void 0;
const agentService_1 = require("../services/agentService");
const geminiService_1 = require("../services/geminiService");
const chromaService_1 = require("../services/chromaService");
const agentService = new agentService_1.AgentService();
const geminiService = new geminiService_1.GeminiService();
const chromaService = new chromaService_1.ChromaService();
const createAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, ownerId } = req.body;
        if (!name || !ownerId) {
            res.status(400).json({ error: "Name and ownerId are required" });
            return;
        }
        const newAgent = {
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
        const createdAgent = yield agentService.createAgent(newAgent);
        res.status(201).json(createdAgent);
    }
    catch (error) {
        console.error("Error creating agent:", error);
        res.status(500).json({ error: error.message || "Error creating agent" });
    }
});
exports.createAgent = createAgent;
const getAgentByOwnerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ownerId } = req.params;
        const agent = yield agentService.getAgentByOwnerId(ownerId);
        if (!agent) {
            res.status(404).json({ error: "No agent found for this owner" });
            return;
        }
        res.status(200).json(agent);
    }
    catch (error) {
        console.error("Error getting agent:", error);
        res.status(500).json({ error: error.message || "Error getting agent" });
    }
});
exports.getAgentByOwnerId = getAgentByOwnerId;
const getChatHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentId } = req.params;
        const chatHistory = yield chromaService.getChatHistory(agentId);
        res.status(200).json(chatHistory);
    }
    catch (error) {
        console.error("Error getting chat history:", error);
        res
            .status(500)
            .json({ error: error.message || "Error getting chat history" });
    }
});
exports.getChatHistory = getChatHistory;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const { agentId } = req.params;
        const { message } = req.body;
        if (!message) {
            res.status(400).json({ error: "Message is required" });
            return;
        }
        // Store user message
        const userMessage = {
            id: Date.now().toString(),
            agentId,
            role: "user",
            content: message,
            timestamp: new Date(),
        };
        yield chromaService.storeChatMessage(userMessage);
        // Get chat history for context
        const chatHistory = yield chromaService.getChatHistory(agentId);
        const context = chatHistory
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n");
        // Set up streaming response
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        let fullResponse = "";
        // Generate and stream AI response
        const responseStream = geminiService.generateResponseStream(message, context);
        try {
            for (var _d = true, responseStream_1 = __asyncValues(responseStream), responseStream_1_1; responseStream_1_1 = yield responseStream_1.next(), _a = responseStream_1_1.done, !_a; _d = true) {
                _c = responseStream_1_1.value;
                _d = false;
                const chunk = _c;
                fullResponse += chunk;
                res.write(`data: ${chunk}\n\n`);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = responseStream_1.return)) yield _b.call(responseStream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Store AI response
        const aiResponse = {
            id: (Date.now() + 1).toString(),
            agentId,
            role: "assistant",
            content: fullResponse,
            timestamp: new Date(),
        };
        yield chromaService.storeChatMessage(aiResponse);
        res.end();
    }
    catch (error) {
        console.error("Error processing message:", error);
        res
            .status(500)
            .json({ error: error.message || "Error processing message" });
    }
});
exports.sendMessage = sendMessage;
