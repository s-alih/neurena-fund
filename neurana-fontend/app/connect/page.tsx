"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/wallet-connect";
import { toast } from "sonner";

export default function ConnectWallet() {
  const router = useRouter();

  useEffect(() => {
    // Check if wallet is already connected
    const walletAddress = localStorage.getItem("walletAddress");
    if (walletAddress) {
      router.push("/agent");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 bg-black/30 border-primary/20">
          <div className="flex flex-col items-center mb-6">
            <Wallet className="w-12 h-12 mb-4 text-primary" />
            <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
            <p className="text-muted-foreground text-center mt-2">
              Connect your wallet to start trading with AI agents
            </p>
          </div>

          <div className="space-y-4">
            <WalletConnect
              onConnect={() => {
                toast.success("Wallet connected successfully!");
                router.push("/agent");
              }}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
