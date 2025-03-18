"use strict";
"use client";
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
exports.default = CreateAgent;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const sonner_1 = require("sonner");
function CreateAgent() {
    const router = (0, navigation_1.useRouter)();
    const [name, setName] = (0, react_1.useState)("");
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setIsLoading(true);
        try {
            const walletAddress = localStorage.getItem("walletAddress");
            if (!walletAddress) {
                sonner_1.toast.error("Please connect your wallet first");
                return;
            }
            const response = yield fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agents`, {
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
            yield response.json();
            sonner_1.toast.success("Agent created successfully!");
            router.push("/agent");
        }
        catch (error) {
            sonner_1.toast.error(error.message || "Failed to create agent");
        }
        finally {
            setIsLoading(false);
        }
    });
    return (<div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <card_1.Card className="p-6 bg-black/30 border-primary/20">
          <div className="flex flex-col items-center mb-6">
            <lucide_react_1.Brain className="w-12 h-12 mb-4 text-primary"/>
            <h1 className="text-2xl font-bold">Create Your AI Agent</h1>
            <p className="text-muted-foreground text-center mt-2">
              Give your AI trading agent a name to begin the journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input_1.Input placeholder="Agent Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading}/>
            </div>
            <button_1.Button type="submit" className="w-full" size="lg" disabled={isLoading || !name.trim()}>
              {isLoading ? "Creating..." : "Create Agent"}
            </button_1.Button>
          </form>
        </card_1.Card>
      </framer_motion_1.motion.div>
    </div>);
}
