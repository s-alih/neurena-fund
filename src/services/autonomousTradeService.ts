import { TradingAgent } from "../models/Agent";
import { LiveTradeExecution } from "../models/LiveTrade";
import { ChromaService, ChatMessage } from "./chromaService";
import { GeminiService } from "./geminiService";
import { AgentService } from "./agentService";
import { ChainGrpcWasmApi, IndexerGrpcSpotApi } from "@injectivelabs/sdk-ts";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import {
  agentsCollection,
  liveTradesCollection,
  tradeSimulationsCollection,
} from "../config";

interface MarketData {
  pair: string;
  price: number;
  timestamp: Date;
  volume: number;
  high24h: number;
  low24h: number;
}

interface TradeDecision {
  shouldTrade: boolean;
  tradeType: "Buy" | "Sell";
  amount: number;
  confidence: number;
  reasoning: string;
}

interface TradeSimulation {
  simulationId: string;
  agentId: string;
  tradeType: "Buy" | "Sell";
  pair: string;
  amount: number;
  entryPrice: number;
  exitPrice: number | null;
  pnl: number | null;
  status: "Open" | "Closed";
  timestamp: Date;
  confidence: number;
  reasoning: string;
}

export class AutonomousTradeService {
  private chromaService: ChromaService;
  private geminiService: GeminiService;
  private agentService: AgentService;
  private marketDataBuffer: Map<string, MarketData[]> = new Map();
  private spotApi: IndexerGrpcSpotApi;
  private readonly MARKET_ID =
    "0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe"; // INJ/USDT

  constructor() {
    this.chromaService = new ChromaService();
    this.geminiService = new GeminiService();
    this.agentService = new AgentService();

    const endpoints = getNetworkEndpoints(Network.TestnetK8s);
    this.spotApi = new IndexerGrpcSpotApi(endpoints.indexer);

    // Start market data polling
    this.startMarketDataPolling();
  }

  private async startMarketDataPolling() {
    const pollMarketData = async () => {
      try {
        const trades = await this.spotApi.fetchTrades({
          marketId: this.MARKET_ID,
        });

        if (trades.trades.length > 0) {
          const latestTrade = trades.trades[0];
          const marketData: MarketData = {
            pair: "INJ/USDT",
            price: parseFloat(latestTrade.price),
            timestamp: new Date(latestTrade.executedAt),
            volume: parseFloat(latestTrade.quantity),
            high24h: 0, // You can fetch this separately if needed
            low24h: 0, // You can fetch this separately if needed
          };

          this.updateMarketDataBuffer(marketData);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    // Poll every 5 seconds
    setInterval(pollMarketData, 5000);
    // Initial poll
    pollMarketData();
  }

  private updateMarketDataBuffer(data: MarketData) {
    if (!this.marketDataBuffer.has(data.pair)) {
      this.marketDataBuffer.set(data.pair, []);
    }

    const buffer = this.marketDataBuffer.get(data.pair)!;
    buffer.push(data);

    // Keep last 100 data points
    if (buffer.length > 100) {
      buffer.shift();
    }
  }

  async startAutonomousTrading() {
    try {
      // Fetch all active agents
      const agents = await this.getAllActiveAgents();
      console.log("Agents:", agents);

      for (const agent of agents) {
        await this.processAgent(agent);
      }
    } catch (error) {
      console.error("Error in autonomous trading:", error);
    }
  }

  private async getAllActiveAgents(): Promise<TradingAgent[]> {
    try {
      const snapshot = await agentsCollection
        .where("status", "==", "Active")
        .get();

      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        agentId: doc.id,
      })) as TradingAgent[];
    } catch (error) {
      console.error("Error fetching active agents:", error);
      return [];
    }
  }

  private async processAgent(agent: TradingAgent) {
    try {
      // Get agent's chat history for context
      const chatHistory = await this.chromaService.getChatHistory(
        agent.agentId
      );

      // Get relevant market data
      const marketData = this.getRelevantMarketData();

      // Generate trade decision using AI
      const decision = await this.generateTradeDecision(
        agent,
        chatHistory,
        marketData
      );
      console.log("Decision:", decision);

      if (decision.shouldTrade && decision.confidence >= 0.7) {
        // Only execute high-confidence trades
        // First simulate the trade
        const simulation = await this.simulateTrade(
          agent,
          decision,
          marketData[marketData.length - 1]
        );
        console.log("Simulation:", simulation);
        if (simulation.status === "Open") {
          // Execute the actual trade if simulation is successful
          await this.executeTrade(agent, decision, simulation);
        }

        // Update agent's performance metrics
        await this.updateAgentMetrics(agent, simulation);
      }
    } catch (error) {
      console.error(`Error processing agent ${agent.agentId}:`, error);
    }
  }

  private getRelevantMarketData(): MarketData[] {
    // Combine and process market data from buffer
    const allData: MarketData[] = [];
    this.marketDataBuffer.forEach((buffer) => {
      allData.push(...buffer);
    });
    return allData;
  }

  private async generateTradeDecision(
    agent: TradingAgent,
    chatHistory: ChatMessage[],
    marketData: MarketData[]
  ): Promise<TradeDecision> {
    // For testing: Generate random but valid trade decisions
    const tradeTypes: ["Buy", "Sell"] = ["Buy", "Sell"];
    const randomType = tradeTypes[Math.floor(Math.random() * 2)];
    const randomAmount = parseFloat((Math.random() * 100).toFixed(2)); // Random amount between 0-100

    // Always return a trade decision with high confidence
    const decision: TradeDecision = {
      shouldTrade: true,
      tradeType: randomType,
      amount: randomAmount,
      confidence: 0.9, // High confidence to ensure trade execution
      reasoning: `Test trade: ${randomType} ${randomAmount} INJ/USDT`,
    };

    console.log("Generated test trade decision:", decision);
    return decision;
  }

  private prepareTradeContext(
    agent: TradingAgent,
    chatHistory: ChatMessage[],
    marketData: MarketData[]
  ): string {
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

  private generateTradePrompt(context: string): string {
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

  private parseTradeDecision(response: string): TradeDecision {
    try {
      // Extract JSON from AI response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const decision = JSON.parse(jsonMatch[0]);
      return decision as TradeDecision;
    } catch (error) {
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

  private async simulateTrade(
    agent: TradingAgent,
    decision: TradeDecision,
    currentMarketData: MarketData
  ): Promise<TradeSimulation> {
    const simulation: TradeSimulation = {
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
      await tradeSimulationsCollection
        .doc(simulation.simulationId)
        .set(simulation);
      return simulation;
    } catch (error) {
      console.error("Error creating trade simulation:", error);
      throw error;
    }
  }

  private async executeTrade(
    agent: TradingAgent,
    decision: TradeDecision,
    simulation: TradeSimulation
  ) {
    const trade: LiveTradeExecution = {
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
      await this.storeTrade(trade);

      // TODO: Implement actual Injective trade execution here
      // const injectiveTradeResult = await executeInjectiveTrade(trade);

      // For now, we'll simulate success
      trade.executionStatus = "Completed";
      await this.updateTrade(trade);

      // Update simulation status
      await tradeSimulationsCollection.doc(simulation.simulationId).update({
        status: "Closed",
        exitPrice: trade.price,
        pnl: this.calculatePnL(
          simulation.entryPrice,
          trade.price,
          trade.amount,
          trade.tradeType
        ),
      });
    } catch (error) {
      console.error("Error executing trade:", error);
      trade.executionStatus = "Failed";
      await this.updateTrade(trade);
    }
  }

  private calculatePnL(
    entryPrice: number,
    exitPrice: number,
    amount: number,
    tradeType: "Buy" | "Sell"
  ): number {
    if (tradeType === "Buy") {
      return (exitPrice - entryPrice) * amount;
    } else {
      return (entryPrice - exitPrice) * amount;
    }
  }

  private async storeTrade(trade: LiveTradeExecution) {
    try {
      await liveTradesCollection.doc(trade.executionId).set(trade);
    } catch (error) {
      console.error("Error storing trade:", error);
      throw error;
    }
  }

  private async updateTrade(trade: LiveTradeExecution) {
    try {
      const updateData = {
        executionStatus: trade.executionStatus,
        price: trade.price,
        timestamp: trade.timestamp,
      };
      await liveTradesCollection.doc(trade.executionId).update(updateData);
    } catch (error) {
      console.error("Error updating trade:", error);
      throw error;
    }
  }

  private async updateAgentMetrics(
    agent: TradingAgent,
    simulation: TradeSimulation
  ) {
    if (!simulation.pnl) return;

    const updatedMetrics = {
      ...agent.performanceMetrics,
      totalTrades: agent.performanceMetrics.totalTrades + 1,
      finalBalance: agent.performanceMetrics.finalBalance + simulation.pnl,
      roi:
        ((agent.performanceMetrics.finalBalance +
          simulation.pnl -
          agent.performanceMetrics.initialBalance) /
          agent.performanceMetrics.initialBalance) *
        100,
    };

    // Update win rate
    const totalWins =
      simulation.pnl > 0
        ? agent.performanceMetrics.winRate *
            agent.performanceMetrics.totalTrades +
          1
        : agent.performanceMetrics.winRate *
          agent.performanceMetrics.totalTrades;

    updatedMetrics.winRate =
      (totalWins / (agent.performanceMetrics.totalTrades + 1)) * 100;

    try {
      await agentsCollection.doc(agent.agentId).update({
        performanceMetrics: updatedMetrics,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating agent metrics:", error);
      throw error;
    }
  }
}
