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
exports.AgentService = void 0;
const config_1 = require("../config");
class AgentService {
    createAgent(agent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if owner already has an agent
                const existingAgent = yield this.getAgentByOwnerId(agent.ownerId);
                if (existingAgent) {
                    throw new Error("Owner already has an agent");
                }
                yield config_1.agentsCollection.doc(agent.agentId).set(agent);
                return agent;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAgentByOwnerId(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const querySnapshot = yield config_1.agentsCollection
                    .where("ownerId", "==", ownerId)
                    .limit(1)
                    .get();
                if (querySnapshot.empty) {
                    return null;
                }
                const doc = querySnapshot.docs[0];
                return Object.assign(Object.assign({}, doc.data()), { agentId: doc.id });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AgentService = AgentService;
