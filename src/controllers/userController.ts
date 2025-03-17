import { Request, Response, RequestHandler } from "express";
import { UserService } from "../services/userService";
import { User } from "../models/User";

const userService = new UserService();

export const createUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res
        .status(400)
        .json({ error: "userId (wallet address) and role are required" });
      return;
    }

    const newUser: User = {
      userId,
      walletAddress: userId,
      role: "Trader",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdUser = await userService.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message || "Error creating user" });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: error.message || "Error getting user" });
  }
};
