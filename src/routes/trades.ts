import { Router } from "express";
import { liveTradesCollection } from "../config";

const router = Router();

// Get all trades for a specific agent
router.get("/agent/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;

    // Query trades collection for the specific agent
    const tradesSnapshot = await liveTradesCollection
      .where("agentId", "==", agentId)
      .orderBy("timestamp", "desc")
      .limit(50) // Limit to latest 50 trades
      .get();

    const trades = tradesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(), // Convert Firestore timestamp to Date
    }));

    res.json(trades);
  } catch (error) {
    console.error("Error fetching trades:", error);
    res.status(500).json({ error: "Failed to fetch trades" });
  }
});

export default router;
