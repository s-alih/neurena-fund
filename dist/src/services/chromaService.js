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
exports.ChromaService = void 0;
const chromadb_1 = require("chromadb");
class ChromaService {
    constructor() {
        this.isInitializing = false;
        this.initializationPromise = null;
        this.client = new chromadb_1.ChromaClient({
            path: process.env.CHROMA_DB_URL || "http://localhost:8000",
        });
    }
    initializeCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.collection)
                return;
            if (this.isInitializing) {
                // Wait for ongoing initialization
                yield this.initializationPromise;
                return;
            }
            this.isInitializing = true;
            this.initializationPromise = (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log("Initializing ChromaDB collection...");
                    // Wait for client to be ready
                    yield new Promise((resolve) => setTimeout(resolve, 1000));
                    // Try to get existing collection first
                    try {
                        this.collection = yield this.client.getCollection({
                            name: "chat_history",
                            embeddingFunction: {
                                generate: (texts) => __awaiter(this, void 0, void 0, function* () { return texts.map(() => new Array(1536).fill(0)); }),
                            },
                        });
                        console.log("Found existing collection");
                    }
                    catch (error) {
                        // If collection doesn't exist, create it
                        console.log("Creating new collection...");
                        this.collection = yield this.client.createCollection({
                            name: "chat_history",
                            metadata: { "hnsw:space": "cosine" },
                            embeddingFunction: {
                                generate: (texts) => __awaiter(this, void 0, void 0, function* () { return texts.map(() => new Array(1536).fill(0)); }),
                            },
                        });
                    }
                }
                catch (error) {
                    console.error("Failed to initialize ChromaDB collection:", error);
                    throw error;
                }
                finally {
                    this.isInitializing = false;
                }
            }))();
            yield this.initializationPromise;
        });
    }
    storeChatMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializeCollection();
            if (!this.collection) {
                throw new Error("Collection not initialized");
            }
            try {
                yield this.collection.add({
                    ids: [message.id],
                    metadatas: [
                        {
                            agentId: message.agentId,
                            role: message.role,
                            timestamp: message.timestamp.toISOString(),
                        },
                    ],
                    documents: [message.content],
                    embeddings: [[0]], // Dummy embedding as required by ChromaDB
                });
            }
            catch (error) {
                console.error("Error storing chat message:", error);
                throw error;
            }
        });
    }
    getChatHistory(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializeCollection();
            if (!this.collection) {
                console.warn("Collection not initialized, returning empty history");
                return [];
            }
            try {
                const result = yield this.collection.get({
                    where: { agentId: agentId },
                    limit: 100,
                });
                if (!result.ids.length) {
                    return [];
                }
                return result.ids.map((id, index) => {
                    var _a, _b;
                    const document = (_a = result.documents) === null || _a === void 0 ? void 0 : _a[index];
                    const metadata = (_b = result.metadatas) === null || _b === void 0 ? void 0 : _b[index];
                    if (!document || !metadata) {
                        throw new Error("Invalid chat message data");
                    }
                    return {
                        id: id.toString(),
                        agentId: metadata.agentId,
                        role: metadata.role,
                        content: document.toString(),
                        timestamp: new Date(metadata.timestamp),
                    };
                });
            }
            catch (error) {
                console.error("Error retrieving chat history:", error);
                return []; // Return empty array instead of throwing
            }
        });
    }
}
exports.ChromaService = ChromaService;
