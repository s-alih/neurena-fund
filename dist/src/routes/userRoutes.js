"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// Create a new user
router.post("/", userController_1.createUser);
// Get user by ID (wallet address)
router.get("/:userId", userController_1.getUserById);
exports.default = router;
