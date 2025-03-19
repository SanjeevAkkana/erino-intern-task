import express from "express";
import { register, login, logout, getCurrentUser } from "../controllers/auth.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const authRouter = express.Router();

// Register route
authRouter.post("/register", register);

// Login route
authRouter.post("/login", login);

// Logout route
authRouter.post("/logout", logout);

// Get current user (protected route)
authRouter.get("/current-user", verifyUser, getCurrentUser);

export default authRouter;