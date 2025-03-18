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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutonomousTradeService = void 0;
const chromaService_1 = require("./chromaService");
const geminiService_1 = require("./geminiService");
const agentService_1 = require("./agentService");
const sdk_ts_1 = require("@injectivelabs/sdk-ts");
const networks_1 = require("@injectivelabs/networks");
const config_1 = require("../config");
class AutonomousTradeService {
    constructor() {
        this.marketDataBuffer = new Map();
        this.MARKET_ID = "0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe"; // INJ/USDT
        this.chromaService = new chromaService_1.ChromaService();
        this.geminiService = new geminiService_1.GeminiService();
        this.agentService = new agentService_1.AgentService();
        const endpoints = (0, networks_1.getNetworkEndpoints)(networks_1.Network.TestnetK8s);
        this.spotApi = new sdk_ts_1.IndexerGrpcSpotApi(endpoints.indexer);
        // Start market data polling
        this.startMarketDataPolling();
    }
    startMarketDataPolling() {
        return __awaiter(this, void 0, void 0, function* () {
            const pollMarketData = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const trades = yield this.spotApi.fetchTrades({
                        marketId: this.MARKET_ID,
                    });
                    if (trades.trades.length > 0) {
                        const latestTrade = trades.trades[0];
                        const marketData = {
                            pair: "INJ/USDT",
                            price: parseFloat(latestTrade.price),
                            timestamp: new Date(latestTrade.executedAt),
                            volume: parseFloat(latestTrade.quantity),
                            high24h: 0, // You can fetch this separately if needed
                            low24h: 0, // You can fetch this separately if needed
                        };
                        this.updateMarketDataBuffer(marketData);
                    }
                }
                catch (error) {
                    console.error("Error fetching market data:", error);
                }
            });
            // Poll every 5 seconds
            setInterval(pollMarketData, 5000);
            // Initial poll
            pollMarketData();
        });
    }
    updateMarketDataBuffer(data) {
        if (!this.marketDataBuffer.has(data.pair)) {
            this.marketDataBuffer.set(data.pair, []);
        }
        const buffer = this.marketDataBuffer.get(data.pair);
        buffer.push(data);
        // Keep last 100 data points
        if (buffer.length > 100) {
            buffer.shift();
        }
    }
    startAutonomousTrading() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all active agents
                const agents = yield this.getAllActiveAgents();
                console.log("Agents:", agents);
                for (const agent of agents) {
                    yield this.processAgent(agent);
                }
            }
            catch (error) {
                console.error("Error in autonomous trading:", error);
            }
        });
    }
    getAllActiveAgents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const snapshot = yield config_1.agentsCollection
                    .where("status", "==", "Active")
                    .get();
                return snapshot.docs.map((doc) => (Object.assign(Object.assign({}, doc.data()), { agentId: doc.id })));
            }
            catch (error) {
                console.error("Error fetching active agents:", error);
                return [];
            }
        });
    }
    processAgent(agent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get agent's chat history for context
                const chatHistory = yield this.chromaService.getChatHistory(agent.agentId);
                // Get relevant market data
                const marketData = this.getRelevantMarketData();
                // Generate trade decision using AI
                const decision = yield this.generateTradeDecision(agent, chatHistory, marketData);
                console.log("Decision:", decision);
                if (decision.shouldTrade && decision.confidence >= 0.7) {
                    // Only execute high-confidence trades
                    // First simulate the trade
                    const simulation = yield this.simulateTrade(agent, decision, marketData[marketData.length - 1]);
                    console.log("Simulation:", simulation);
                    if (simulation.status === "Open") {
                        // Execute the actual trade if simulation is successful
                        yield this.executeTrade(agent, decision, simulation);
                    }
                    // Update agent's performance metrics
                    yield this.updateAgentMetrics(agent, simulation);
                }
            }
            catch (error) {
                console.error(`Error processing agent ${agent.agentId}:`, error);
            }
        });
    }
    getRelevantMarketData() {
        // Combine and process market data from buffer
        const allData = [];
        this.marketDataBuffer.forEach((buffer) => {
            allData.push(...buffer);
        });
        return allData;
    }
    generateTradeDecision(agent, chatHistory, marketData) {
        return __awaiter(this, void 0, void 0, function* () {
            // For testing: Generate random but valid trade decisions
            const tradeTypes = ["Buy", "Sell"];
            const randomType = tradeTypes[Math.floor(Math.random() * 2)];
            const randomAmount = parseFloat((Math.random() * 100).toFixed(2)); // Random amount between 0-100
            // Always return a trade decision with high confidence
            const decision = {
                shouldTrade: true,
                tradeType: randomType,
                amount: randomAmount,
                confidence: 0.9, // High confidence to ensure trade execution
                reasoning: `Test trade: ${randomType} ${randomAmount} INJ/USDT`,
            };
            console.log("Generated test trade decision:", decision);
            return decision;
        });
    }
    prepareTradeContext(agent, chatHistory, marketData) {
        // Combine relevant information for AI context
        return `
      Agent Profile:
      - Performance: ${JSON.stringify(agent.performanceMetrics)}
      - Status: ${agent.status}
      
      Recent Market Data:
      ${JSON.stringify(marketData.slice(-5))}
      
      Recent Training Context:
      ${chatHistory
            .slice(-5)
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n")}
    `;
    }
    generateTradePrompt(context) {
        return `
      Based on the following context, analyze the market conditions and determine if a trade should be executed.
      Provide your decision in JSON format with the following structure:
      {
        "shouldTrade": boolean,
        "tradeType": "Buy" or "Sell",
        "amount": number (0-100% of available balance),
        "confidence": number (0-1),
        "reasoning": "string explanation"
      }

      Context:
      ${context}
    `;
    }
    parseTradeDecision(response) {
        try {
            // Extract JSON from AI response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("No valid JSON found in response");
            }
            const decision = JSON.parse(jsonMatch[0]);
            return decision;
        }
        catch (error) {
            console.error("Error parsing trade decision:", error);
            return {
                shouldTrade: false,
                tradeType: "Buy",
                amount: 0,
                confidence: 0,
                reasoning: "Error parsing decision",
            };
        }
    }
    simulateTrade(agent, decision, currentMarketData) {
        return __awaiter(this, void 0, void 0, function* () {
            const simulation = {
                simulationId: Date.now().toString(),
                agentId: agent.agentId,
                tradeType: decision.tradeType,
                pair: currentMarketData.pair,
                amount: decision.amount,
                entryPrice: currentMarketData.price,
                exitPrice: null,
                pnl: null,
                status: "Open",
                timestamp: new Date(),
                confidence: decision.confidence,
                reasoning: decision.reasoning,
            };
            try {
                // Store simulation in database
                yield config_1.tradeSimulationsCollection
                    .doc(simulation.simulationId)
                    .set(simulation);
                return simulation;
            }
            catch (error) {
                console.error("Error creating trade simulation:", error);
                throw error;
            }
        });
    }
    executeTrade(agent, decision, simulation) {
        return __awaiter(this, void 0, void 0, function* () {
            const trade = {
                executionId: Date.now().toString(),
                agentId: agent.agentId,
                vaultId: agent.agentId, // Using agentId as vaultId for now
                pair: simulation.pair,
                tradeType: decision.tradeType,
                amount: decision.amount,
                price: simulation.entryPrice,
                executionStatus: "Pending",
                timestamp: new Date(),
            };
            try {
                // Store the trade first
                yield this.storeTrade(trade);
                // TODO: Implement actual Injective trade execution here
                // const injectiveTradeResult = await executeInjectiveTrade(trade);
                // For now, we'll simulate success
                trade.executionStatus = "Completed";
                yield this.updateTrade(trade);
                // Update simulation status
                yield config_1.tradeSimulationsCollection.doc(simulation.simulationId).update({
                    status: "Closed",
                    exitPrice: trade.price,
                    pnl: this.calculatePnL(simulation.entryPrice, trade.price, trade.amount, trade.tradeType),
                });
            }
            catch (error) {
                console.error("Error executing trade:", error);
                trade.executionStatus = "Failed";
                yield this.updateTrade(trade);
            }
        });
    }
    calculatePnL(entryPrice, exitPrice, amount, tradeType) {
        if (tradeType === "Buy") {
            return (exitPrice - entryPrice) * amount;
        }
        else {
            return (entryPrice - exitPrice) * amount;
        }
    }
    storeTrade(trade) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield config_1.liveTradesCollection.doc(trade.executionId).set(trade);
            }
            catch (error) {
                console.error("Error storing trade:", error);
                throw error;
            }
        });
    }
    updateTrade(trade) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = {
                    executionStatus: trade.executionStatus,
                    price: trade.price,
                    timestamp: trade.timestamp,
                };
                yield config_1.liveTradesCollection.doc(trade.executionId).update(updateData);
            }
            catch (error) {
                console.error("Error updating trade:", error);
                throw error;
            }
        });
    }
    updateAgentMetrics(agent, simulation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!simulation.pnl)
                return;
            const updatedMetrics = Object.assign(Object.assign({}, agent.performanceMetrics), { totalTrades: agent.performanceMetrics.totalTrades + 1, finalBalance: agent.performanceMetrics.finalBalance + simulation.pnl, roi: ((agent.performanceMetrics.finalBalance +
                    simulation.pnl -
                    agent.performanceMetrics.initialBalance) /
                    agent.performanceMetrics.initialBalance) *
                    100 });
            // Update win rate
            const totalWins = simulation.pnl > 0
                ? agent.performanceMetrics.winRate *
                    agent.performanceMetrics.totalTrades +
                    1
                : agent.performanceMetrics.winRate *
                    agent.performanceMetrics.totalTrades;
            updatedMetrics.winRate =
                (totalWins / (agent.performanceMetrics.totalTrades + 1)) * 100;
            try {
                yield config_1.agentsCollection.doc(agent.agentId).update({
                    performanceMetrics: updatedMetrics,
                    updatedAt: new Date(),
                });
            }
            catch (error) {
                console.error("Error updating agent metrics:", error);
                throw error;
            }
        });
    }
}
exports.AutonomousTradeService = AutonomousTradeService;
