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
const express_1 = require("express");
const config_1 = require("../config");
const router = (0, express_1.Router)();
// Get all trades for a specific agent
router.get("/agent/:agentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agentId } = req.params;
        // Query trades collection for the specific agent
        const tradesSnapshot = yield config_1.liveTradesCollection
            .where("agentId", "==", agentId)
            .orderBy("timestamp", "desc")
            .limit(50) // Limit to latest 50 trades
            .get();
        const trades = tradesSnapshot.docs.map((doc) => (Object.assign(Object.assign({ id: doc.id }, doc.data()), { timestamp: doc.data().timestamp.toDate() })));
        res.json(trades);
    }
    catch (error) {
        console.error("Error fetching trades:", error);
        res.status(500).json({ error: "Failed to fetch trades" });
    }
}));
exports.default = router;
