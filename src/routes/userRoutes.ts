import { Router } from "express";
import { createUser, getUserById } from "../controllers/userController";

const router = Router();

// Create a new user
router.post("/", createUser);

// Get user by ID (wallet address)
router.get("/:userId", getUserById);

export default router;
