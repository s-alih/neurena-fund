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
exports.WalletConnect = WalletConnect;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const sonner_1 = require("sonner");
const exceptions_1 = require("@injectivelabs/exceptions");
const sdk_ts_1 = require("@injectivelabs/sdk-ts");
function WalletConnect({ onConnect }) {
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    const [address, setAddress] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        const savedAddress = localStorage.getItem("walletAddress");
        if (savedAddress) {
            setIsConnected(true);
            setAddress(savedAddress);
        }
    }, []);
    const connect = () => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!window.ethereum) {
                throw new exceptions_1.Web3Exception(new Error("Please install MetaMask"));
            }
            const accounts = yield window.ethereum.request({
                method: "eth_requestAccounts",
            });
            if (!accounts || accounts.length === 0) {
                throw new exceptions_1.Web3Exception(new Error("No accounts found"));
            }
            const address = (0, sdk_ts_1.getInjectiveAddress)(accounts[0]);
            localStorage.setItem("walletAddress", address);
            setAddress(address);
            setIsConnected(true);
            if (onConnect) {
                onConnect();
            }
        }
        catch (error) {
            console.error("Failed to connect wallet:", error);
            sonner_1.toast.error("Failed to connect wallet. Please make sure you have MetaMask installed.");
        }
    });
    const disconnect = () => __awaiter(this, void 0, void 0, function* () {
        try {
            localStorage.removeItem("walletAddress");
            setAddress("");
            setIsConnected(false);
        }
        catch (error) {
            console.error("Failed to disconnect wallet:", error);
            sonner_1.toast.error("Failed to disconnect wallet");
        }
    });
    if (!isConnected) {
        return (<button_1.Button onClick={connect} className="w-full">
        <lucide_react_1.Wallet className="mr-2 h-4 w-4"/>
        Connect Wallet
      </button_1.Button>);
    }
    return (<button_1.Button onClick={disconnect} variant="outline" className="w-full">
      <lucide_react_1.Wallet className="mr-2 h-4 w-4"/>
      {address.slice(0, 6)}...{address.slice(-4)}
    </button_1.Button>);
}
