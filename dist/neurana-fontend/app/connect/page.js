"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConnectWallet;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const card_1 = require("@/components/ui/card");
const wallet_connect_1 = require("@/components/wallet-connect");
const sonner_1 = require("sonner");
function ConnectWallet() {
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        // Check if wallet is already connected
        const walletAddress = localStorage.getItem("walletAddress");
        if (walletAddress) {
            router.push("/agent");
        }
    }, [router]);
    return (<div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <card_1.Card className="p-6 bg-black/30 border-primary/20">
          <div className="flex flex-col items-center mb-6">
            <lucide_react_1.Wallet className="w-12 h-12 mb-4 text-primary"/>
            <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
            <p className="text-muted-foreground text-center mt-2">
              Connect your wallet to start trading with AI agents
            </p>
          </div>

          <div className="space-y-4">
            <wallet_connect_1.WalletConnect onConnect={() => {
            sonner_1.toast.success("Wallet connected successfully!");
            router.push("/agent");
        }}/>
          </div>
        </card_1.Card>
      </framer_motion_1.motion.div>
    </div>);
}
