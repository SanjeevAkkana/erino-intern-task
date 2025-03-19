import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyUser = async (req, res, next) => {
    try {
        // Check for token in Authorization header (Bearer token)
        let token = req.headers.authorization?.startsWith("Bearer")
            ? req.headers.authorization.split(" ")[1]
            : null;

        // If no token in header, check for HTTP-only cookie
        if (!token && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided." });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database, excluding the password
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found." });
        }

        if (user.disabled) {
            return res.status(403).json({ message: "Access denied. Your account is disabled." });
        }

        req.user = user; // Attach user info to request object
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid or expired token.", error: error.message });
    }
};