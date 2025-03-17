import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import agentRoutes from "./routes/agentRoutes";
import tradeRoutes from "./routes/trades";
import { SchedulerService } from "./services/schedulerService";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize scheduler
const scheduler = new SchedulerService();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/trades", tradeRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Automatically start the scheduler when server starts
  // scheduler.startScheduler();
});
