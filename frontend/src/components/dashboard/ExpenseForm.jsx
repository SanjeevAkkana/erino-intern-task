import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useExpenseStore from "../../store/useExpenseStore";
import { Calendar, IndianRupee, Tag, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const categoryOptions = [
    "Food",
    "Transportation",
    "Housing",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Shopping",
    "Education",
    "Travel",
    "Other",
];

const ExpenseForm = ({ expenseToEdit, onClose }) => {
    const { addExpense, updateExpense, deleteExpense, fetchExpenses, currentPage, filters } = useExpenseStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        if (expenseToEdit) {
            setValue("amount", expenseToEdit.amount);
            setValue("category", expenseToEdit.category);
            setValue("date", expenseToEdit.date.split("T")[0]);
            setValue("description", expenseToEdit.description);
        }
    }, [expenseToEdit, setValue]);

    const onSubmit = async (data) => {
        if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
            toast.error("Amount must be a positive number.");
            return;
        }
        if (!categoryOptions.includes(data.category)) {
            toast.error("Please select a valid category.");
            return;
        }
        if (!data.date) {
            toast.error("Date is required.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (expenseToEdit) {
                await updateExpense(expenseToEdit._id, data);
                toast.success("Expense updated successfully!");
            } else {
                await addExpense(data);
                toast.success("Expense added successfully!");
            }
            fetchExpenses(currentPage, filters);
            reset();
            onClose();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
        setIsSubmitting(false);
    };

    const handleDelete = async () => {
        if (!expenseToEdit) return;
        const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
        if (!confirmDelete) return;
        try {
            await deleteExpense(expenseToEdit._id);
            toast.success("Expense deleted successfully!");
            fetchExpenses(currentPage, filters);
            onClose();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex h-fit items-center justify-center bg-white rounded-xl p-4 sm:p-8 w-full w-full md:max-w-md">
            <div className="w-full">
                <div className="flex items-center gap-x-2 mb-6">
                    <p className="w-5 h-5 bg-blue-700 rounded-full"></p>
                    <h2 className="text-xl font-semibold tracking-wide text-gray-800">
                        {expenseToEdit ? "Edit Expense" : "Add Expense"}
                    </h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Amount Field */}
                    <div className="border rounded-xl flex gap-x-2 items-center p-3">
                        <IndianRupee size={18} className="text-gray-500" />
                        <input
                            type="number"
                            placeholder="Amount"
                            {...register("amount")}
                            className="outline-none text-sm bg-transparent w-full"
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div className="border rounded-xl flex gap-x-2 items-center p-3">
                        <Tag size={18} className="text-gray-500" />
                        <select
                            {...register("category")}
                            className="outline-none text-sm bg-transparent w-full"
                        >
                            <option value="">Select Category</option>
                            {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Field */}
                    <div className="border rounded-xl flex gap-x-2 items-center p-3">
                        <Calendar size={18} className="text-gray-500" />
                        <input
                            type="date"
                            {...register("date")}
                            className="outline-none text-sm bg-transparent w-full"
                        />
                    </div>

                    {/* Description Field */}
                    <div className="border rounded-xl flex gap-x-2 items-center p-3">
                        <textarea
                            placeholder="Description (optional)"
                            {...register("description")}
                            className="outline-none text-sm bg-transparent w-full resize-none"
                        />
                    </div>

                    {/* Submit and Delete Buttons */}
                    <div className="flex justify-between gap-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full cursor-pointer bg-blue-700 text-white rounded-xl py-2.5 text-center text-sm transition hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {isSubmitting ? "Submitting..." : expenseToEdit ? "Update Expense" : "Add Expense"}
                        </button>
                        {expenseToEdit && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="w-full cursor-pointer bg-red-600 text-white rounded-xl py-2.5 text-center text-sm transition hover:bg-red-700"
                            >
                                <Trash2 size={16} className="inline-block mr-1" /> Delete
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;
