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
exports.UserService = void 0;
const config_1 = require("../config");
class UserService {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if user already exists
                const existingUser = yield config_1.usersCollection.doc(user.userId).get();
                if (existingUser.exists) {
                    throw new Error("User with this wallet address already exists");
                }
                // Create new user
                yield config_1.usersCollection.doc(user.userId).set(user);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDoc = yield config_1.usersCollection.doc(userId).get();
                if (!userDoc.exists) {
                    return null;
                }
                return userDoc.data();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserService = UserService;
