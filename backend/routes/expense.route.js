import express from "express";
import {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const expenseRouter = express.Router();

// ✅ Protected Routes (require authentication)
expenseRouter.post("/", verifyUser, createExpense); // Create a new expense
expenseRouter.get("/", verifyUser, getAllExpenses); // Get all expenses (paginated and filterable)
expenseRouter.put("/:id", verifyUser, updateExpense); // Update an expense
expenseRouter.delete("/:id", verifyUser, deleteExpense); // Delete an expense

export default expenseRouter;