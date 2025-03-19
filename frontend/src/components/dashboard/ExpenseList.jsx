import { useEffect, useState } from "react";
import { Trash2, Edit, Loader2, X, IndianRupee, ChevronLeft, ChevronRight } from "lucide-react";
import useExpenseStore from "../../store/useExpenseStore";
import ExpenseForm from "./ExpenseForm";
import { motion } from "framer-motion";

const ExpenseList = ({ onExpenseDeleted, refresh }) => {
  const { expenses, fetchExpenses, deleteExpense, totalPages } = useExpenseStore();
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchExpenses(currentPage);
      setLoading(false);
    };
    fetchData();
  }, [refresh, currentPage]);

  const handleDelete = async (id) => {
    setDeletedId(id);
    setTimeout(async () => {
      try {
        await deleteExpense(id);
        if (onExpenseDeleted) onExpenseDeleted();
        await fetchExpenses(currentPage);
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
      setDeletedId(null);
    }, 300);
  };

  return (
    <div className="bg-white rounded-lg">
         <div className="flex items-center gap-x-2 mb-3">
          <h2 className="text-xl tracking-wide text-gray-800">
          Your Expenses
          </h2>
        </div>
      {loading ? (
        <div className="flex justify-center border border-gray-200 rounded-2xl items-center py-3">
          <Loader2 className="animate-spin text-blue-700 w-8 h-8" />
        </div>
      ) : expenses.length === 0 ? (
        <p className="border border-gray-200 rounded-2xl text-gray-500 py-6 text-center">No expenses added yet.</p>
      ) : (
        <>
          <ul className="space-y-4 border border-gray-200 p-3 rounded-2xl">
            {expenses.map((expense) => (
              <motion.li
                key={expense._id}
                initial={{ opacity: 1 }}
                animate={{ opacity: deletedId === expense._id ? 0 : 1, scale: deletedId === expense._id ? 0.9 : 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center bg-white py-2 transition-all"
              >
                <div className="flex items-start gap-x-3">
                  <div className="p-2 rounded-full">
                    <IndianRupee size={18} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="text-base text-gray-800">{expense.category}</p>
                    <p className="text-gray-600 font-semibold text-sm">₹{expense.amount} - <span className="font-light">{new Date(expense.date).toLocaleDateString()}</span></p>
                    {expense.description && (
                      <p className="text-gray-500 text-thin font-serif">{expense.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingExpense(expense); setSidebarOpen(true); }}
                    className="p-2 cursor-pointer text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="p-2 cursor-pointer text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <ChevronLeft size={18} /> Prev
            </button>
            <span className="text-blue-700 text-base">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
      {sidebarOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed inset-y-0 right-0 w-full md:w-1/2 bg-white shadow-lg border-l border-gray-200 p-6 z-50 flex flex-col"
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
          <ExpenseForm expenseToEdit={editingExpense} onClose={() => setSidebarOpen(false)} />
        </motion.div>
      )}
    </div>
  );
};

export default ExpenseList;