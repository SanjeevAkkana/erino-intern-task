import Expense from "../models/expense.model.js";
// ✅ Create a new expense
export const createExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;
  const userId = req.user.id; // Get user ID from middleware

  try {
    const newExpense = new Expense({
      userId,
      amount,
      category,
      date,
      description,
    });

    await newExpense.save();
    res.status(201).json({ message: "Expense created successfully", expense: newExpense });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// backend/controllers/expense.controller.js
export const getAllExpenses = async (req, res) => {
  const userId = req.user.id;
  let { page = 1, limit = 5, category, startDate, endDate } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const filter = { userId };
  if (category) filter.category = category;
  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  try {
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    const totalExpenses = await Expense.countDocuments(filter);

    res.status(200).json({
      expenses,
      totalPages: Math.ceil(totalExpenses / limit),
      currentPage: page,
      totalExpenses
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// ✅ Update an expense
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, category, date, description } = req.body;
  const userId = req.user.id;

  try {
    const expense = await Expense.findOne({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    expense.description = description || expense.description;

    await expense.save();
    res.status(200).json({ message: "Expense updated successfully", expense });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// ✅ Delete an expense
export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get user ID from middleware

  try {
    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};