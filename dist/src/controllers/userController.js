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
exports.getUserById = exports.createUser = void 0;
const userService_1 = require("../services/userService");
const userService = new userService_1.UserService();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (!userId) {
            res
                .status(400)
                .json({ error: "userId (wallet address) and role are required" });
            return;
        }
        const newUser = {
            userId,
            walletAddress: userId,
            role: "Trader",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const createdUser = yield userService.createUser(newUser);
        res.status(201).json(createdUser);
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: error.message || "Error creating user" });
    }
});
exports.createUser = createUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userService.getUserById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ error: error.message || "Error getting user" });
    }
});
exports.getUserById = getUserById;
