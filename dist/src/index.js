"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const agentRoutes_1 = __importDefault(require("./routes/agentRoutes"));
const trades_1 = __importDefault(require("./routes/trades"));
const schedulerService_1 = require("./services/schedulerService");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Initialize scheduler
const scheduler = new schedulerService_1.SchedulerService();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/users", userRoutes_1.default);
app.use("/api/agents", agentRoutes_1.default);
app.use("/api/trades", trades_1.default);
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
