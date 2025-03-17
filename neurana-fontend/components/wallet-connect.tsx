import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { ChainId } from "@injectivelabs/ts-types";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { toast } from "sonner";
import { Web3Exception } from "@injectivelabs/exceptions";
import { getInjectiveAddress } from "@injectivelabs/sdk-ts";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (
        event: string,
        callback: (accounts: string[]) => void
      ) => void;
    };
  }
}

interface WalletConnectProps {
  onConnect?: () => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setIsConnected(true);
      setAddress(savedAddress);
    }
  }, []);

  const connect = async () => {
    try {
      if (!window.ethereum) {
        throw new Web3Exception(new Error("Please install MetaMask"));
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Web3Exception(new Error("No accounts found"));
      }

      const address = getInjectiveAddress(accounts[0]);
      localStorage.setItem("walletAddress", address);
      setAddress(address);
      setIsConnected(true);

      if (onConnect) {
        onConnect();
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      toast.error(
        "Failed to connect wallet. Please make sure you have MetaMask installed."
      );
    }
  };

  const disconnect = async () => {
    try {
      localStorage.removeItem("walletAddress");
      setAddress("");
      setIsConnected(false);
    } catch (error: any) {
      console.error("Failed to disconnect wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  if (!isConnected) {
    return (
      <Button onClick={connect} className="w-full">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <Button onClick={disconnect} variant="outline" className="w-full">
      <Wallet className="mr-2 h-4 w-4" />
      {address.slice(0, 6)}...{address.slice(-4)}
    </Button>
  );
}
