import { ChromaClient, Collection } from "chromadb";

export interface ChatMessage {
  id: string;
  agentId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export class ChromaService {
  private client: ChromaClient;
  private collection: Collection | undefined;
  private isInitializing: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.client = new ChromaClient({
      path: process.env.CHROMA_DB_URL || "http://localhost:8000",
    });
  }

  private async initializeCollection(): Promise<void> {
    if (this.collection) return;

    if (this.isInitializing) {
      // Wait for ongoing initialization
      await this.initializationPromise;
      return;
    }

    this.isInitializing = true;
    this.initializationPromise = (async () => {
      try {
        console.log("Initializing ChromaDB collection...");
        // Wait for client to be ready
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Try to get existing collection first
        try {
          this.collection = await this.client.getCollection({
            name: "chat_history",
            embeddingFunction: {
              generate: async (texts: string[]) =>
                texts.map(() => new Array(1536).fill(0)),
            },
          });
          console.log("Found existing collection");
        } catch (error) {
          // If collection doesn't exist, create it
          console.log("Creating new collection...");
          this.collection = await this.client.createCollection({
            name: "chat_history",
            metadata: { "hnsw:space": "cosine" },
            embeddingFunction: {
              generate: async (texts: string[]) =>
                texts.map(() => new Array(1536).fill(0)),
            },
          });
        }
      } catch (error) {
        console.error("Failed to initialize ChromaDB collection:", error);
        throw error;
      } finally {
        this.isInitializing = false;
      }
    })();

    await this.initializationPromise;
  }

  async storeChatMessage(message: ChatMessage) {
    await this.initializeCollection();

    if (!this.collection) {
      throw new Error("Collection not initialized");
    }

    try {
      await this.collection.add({
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
    } catch (error) {
      console.error("Error storing chat message:", error);
      throw error;
    }
  }

  async getChatHistory(agentId: string): Promise<ChatMessage[]> {
    await this.initializeCollection();

    if (!this.collection) {
      console.warn("Collection not initialized, returning empty history");
      return [];
    }

    try {
      const result = await this.collection.get({
        where: { agentId: agentId },
        limit: 100,
      });

      if (!result.ids.length) {
        return [];
      }

      return result.ids.map((id, index) => {
        const document = result.documents?.[index];
        const metadata = result.metadatas?.[index] as {
          agentId: string;
          role: "user" | "assistant";
          timestamp: string;
        };

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
    } catch (error) {
      console.error("Error retrieving chat history:", error);
      return []; // Return empty array instead of throwing
    }
  }
}
