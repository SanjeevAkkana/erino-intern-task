import { create } from "zustand";

const useExpenseStore = create((set) => {
  const handleUnauthorized = (res) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return true;
    }
    return false;
  };

  return {
    expenses: [],
    totalPages: 1,
    currentPage: 1,
    totalExpenses: 0,
    filters: { category: "", startDate: "", endDate: "" },

    fetchExpenses: async (page = 1, filters = {}) => {
      try {
        const queryParams = new URLSearchParams({ page, ...filters }).toString();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses?${queryParams}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (handleUnauthorized(res)) return;
        const data = await res.json();
        if (res.ok) {
          set({
            expenses: data.expenses,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            totalExpenses: data.totalExpenses,
            filters,
          });
        }
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      }
    },

    addExpense: async (expense) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(expense),
        });
        if (handleUnauthorized(res)) return;
        if (res.ok) {
          useExpenseStore.getState().fetchExpenses();
        }
      } catch (error) {
        console.error("Failed to add expense", error);
      }
    },

    updateExpense: async (id, updatedExpense) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedExpense),
        });
        if (handleUnauthorized(res)) return;
        if (res.ok) {
          useExpenseStore.getState().fetchExpenses();
        }
      } catch (error) {
        console.error("Failed to update expense", error);
      }
    },

    deleteExpense: async (id) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (handleUnauthorized(res)) return;
        if (res.ok) {
          useExpenseStore.getState().fetchExpenses();
        }
      } catch (error) {
        console.error("Failed to delete expense", error);
      }
    },
  };
});

export default useExpenseStore;