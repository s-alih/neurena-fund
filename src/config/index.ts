import { db } from "./firebase";

export const usersCollection = db.collection("users");
export const tradesCollection = db.collection("trades");
export const investmentsCollection = db.collection("investments");
export const vaultsCollection = db.collection("vaults");
export const agentsCollection = db.collection("agents");
export const platformFeesCollection = db.collection("platform_fees");
export const liveTradesCollection = db.collection("live_trades");
export const tradeSimulationsCollection = db.collection("trade_simulations");
export const tournamentsCollection = db.collection("tournaments");
