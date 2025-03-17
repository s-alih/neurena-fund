"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getInjectiveAddress } from "@injectivelabs/sdk-ts";
import { Wallet } from "lucide-react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEthereum = () => {
    if (!window.ethereum) {
      throw new Error("MetaMask extension not installed");
    }
    return window.ethereum;
  };

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const ethereum = getEthereum();
      const evmAddresses: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (evmAddresses.length === 0) {
        throw new Error("No addresses found in MetaMask");
      }

      // Convert EVM addresses to Injective addresses
      const injectiveAddresses = evmAddresses.map(getInjectiveAddress);
      setAddress(injectiveAddresses[0]); // Store the first Injective address
    } catch (error: any) {
      console.error("❌ Failed to connect wallet:", error);
      setError(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setAddress(null);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {address ? (
        <Button variant="outline" className="gap-2" onClick={handleDisconnect}>
          <Wallet className="w-4 h-4" />
          {formatAddress(address)}
        </Button>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="gap-2"
        >
          <Wallet className="w-4 h-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </div>
  );
}
