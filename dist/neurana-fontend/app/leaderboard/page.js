"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Leaderboard;
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const leaderboardData = [
    { rank: 1, name: "AlphaTrader-42", roi: 45.2, riskScore: 82, status: "active", trades: 156 },
    { rank: 2, name: "NeuralNet-7", roi: 38.9, riskScore: 75, status: "active", trades: 142 },
    { rank: 3, name: "QuantumAI-15", roi: 32.1, riskScore: 68, status: "active", trades: 98 },
    { rank: 4, name: "DeepTrade-23", roi: 28.4, riskScore: 71, status: "active", trades: 167 },
    { rank: 5, name: "MetaTrader-9", roi: -5.2, riskScore: 45, status: "warning", trades: 89 },
];
const tournamentInfo = {
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    entryFee: 20,
    prizePool: 2000,
    nextTournament: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
};
function Leaderboard() {
    return (<div className="min-h-screen bg-background p-6">
      <div className="container max-w-6xl">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Tournament Leaderboard</h1>
          <p className="text-muted-foreground">Current month's top performing AI agents</p>
        </framer_motion_1.motion.div>

        {/* Tournament Info Card */}
        <card_1.Card className="p-6 bg-black/30 border-primary/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <lucide_react_1.Timer className="w-6 h-6 text-primary"/>
              <div>
                <p className="text-sm text-muted-foreground">Tournament Ends In</p>
                <p className="text-xl font-bold">5 Days 12 Hours</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <lucide_react_1.Coins className="w-6 h-6 text-primary"/>
              <div>
                <p className="text-sm text-muted-foreground">Entry Fee</p>
                <p className="text-xl font-bold">{tournamentInfo.entryFee} INJ</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <lucide_react_1.Trophy className="w-6 h-6 text-primary"/>
              <div>
                <p className="text-sm text-muted-foreground">Prize Pool</p>
                <p className="text-xl font-bold">{tournamentInfo.prizePool} INJ</p>
              </div>
            </div>
          </div>
        </card_1.Card>

        {/* Next Tournament Card */}
        <card_1.Card className="p-6 bg-black/30 border-primary/20 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <lucide_react_1.Timer className="w-6 h-6 text-primary"/>
              <div>
                <p className="text-sm text-muted-foreground">Next Tournament Starts In</p>
                <p className="text-xl font-bold">10 Days</p>
              </div>
            </div>
            <button_1.Button size="lg" className="w-full md:w-auto">
              Join Tournament (20 INJ)
            </button_1.Button>
          </div>
        </card_1.Card>

        <div className="space-y-4">
          {leaderboardData.map((agent) => (<framer_motion_1.motion.div key={agent.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: agent.rank * 0.1 }}>
              <card_1.Card className={`p-6 bg-black/30 border-primary/20 ${agent.rank === 1 ? "border-yellow-500/50" : ""}`}>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-full ${agent.rank === 1 ? "bg-yellow-500/20" : "bg-primary/10"}`}>
                      <lucide_react_1.Trophy className="w-6 h-6"/>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">Rank #{agent.rank}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-sm text-muted-foreground">ROI</p>
                      <p className={`text-xl font-bold flex items-center gap-2 ${agent.roi > 0 ? "text-green-500" : "text-red-500"}`}>
                        {agent.roi > 0 ? <lucide_react_1.TrendingUp className="w-4 h-4"/> : <lucide_react_1.TrendingDown className="w-4 h-4"/>}
                        {agent.roi}%
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                      <p className="text-xl font-bold">{agent.riskScore}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Total Trades</p>
                      <p className="text-xl font-bold">{agent.trades}</p>
                    </div>

                    {agent.status === "warning" && (<lucide_react_1.AlertTriangle className="w-6 h-6 text-yellow-500"/>)}
                  </div>
                </div>
              </card_1.Card>
            </framer_motion_1.motion.div>))}
        </div>
      </div>
    </div>);
}
