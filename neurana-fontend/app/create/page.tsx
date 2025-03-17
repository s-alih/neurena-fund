"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CreateAgent() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get wallet address from local storage or state management
      const walletAddress = localStorage.getItem("walletAddress");

      if (!walletAddress) {
        toast.error("Please connect your wallet first");
        return;
      }

      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          ownerId: walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create agent");
      }

      const agent = await response.json();
      toast.success("Agent created successfully");

      // Redirect to agent page
      router.push("/agent");
    } catch (error: any) {
      toast.error(error.message || "Failed to create agent");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 bg-black/30 border-primary/20">
          <div className="flex flex-col items-center mb-6">
            <Brain className="w-12 h-12 mb-4 text-primary" />
            <h1 className="text-2xl font-bold">Create Your AI Agent</h1>
            <p className="text-muted-foreground text-center mt-2">
              Give your AI trading agent a name to begin the journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Agent Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? "Creating..." : "Create Agent"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
