import { User } from "../models/User";
import { usersCollection } from "../config";

export class UserService {
  async createUser(user: User): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await usersCollection.doc(user.userId).get();
      if (existingUser.exists) {
        throw new Error("User with this wallet address already exists");
      }

      // Create new user
      await usersCollection.doc(user.userId).set(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await usersCollection.doc(userId).get();
      if (!userDoc.exists) {
        return null;
      }
      return userDoc.data() as User;
    } catch (error) {
      throw error;
    }
  }
}
