import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import connectDb from "./config/connectDB.js";
import expenseRouter from "./routes/expense.route.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
    origin: true, // Allow requests from any origin
    credentials: true, // Allow credentials (cookies, authorization headers)
}));
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/expenses", expenseRouter);

// Default route
app.get("/", (req, res) => {
    res.send("Expense Tracker API is running!");
});

// ✅ Connect to MongoDB and Start Server Only If Successful
connectDb()
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database Connection Error:", err);
        process.exit(1); // Exit process if DB connection fails
    });