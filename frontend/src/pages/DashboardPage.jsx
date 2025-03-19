import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import ExpenseForm from "../components/dashboard/ExpenseForm";
import InsightsChart from "../components/dashboard/InsightsChart";
import useExpenseStore from "../store/useExpenseStore";
import ExpenseList from "../components/dashboard/ExpenseList";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const DashboardPage = () => {
    const { fetchExpenses } = useExpenseStore();
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return navigate("/login");

                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/current-user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchUser();
        fetchExpenses();
    }, [fetchExpenses, navigate]);

    return (
        <div className="font-sans flex flex-col overflow-hidden">
            {/* Navbar */}
            <nav className="flex fixed top-0 border-b border-gray-200 z-50 bg-white w-full justify-between items-center px-4 py-3">
                <Link href="/dashboard" className="flex items-center gap-x-2">
                    <p className="w-5 h-5 bg-blue-700 rounded-full"></p>
                    <h2 className="text-xl font-semibold tracking-wide text-gray-800">Expense Tracker</h2>
                </Link>
                {user && (
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/login");
                        }}
                        className="bg-red-600 cursor-pointer text-sm text-white px-3 py-2 rounded-2xl hover:bg-red-700 transition-all"
                    >
                        Logout
                    </button>
                )}
            </nav>

            {/* Main Layout */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-14 md:mt-16 gap-4">
                <div className="">
                    <ExpenseList />
                </div>
                <div className="w-full">
                    <InsightsChart />
                </div>
            </div>

            {/* Floating Add Expense Button */}
            <button
                className="bg-blue-700 cursor-pointer text-white p-4 rounded-full hover:bg-blue-600 transition-all fixed bottom-6 right-6 shadow-lg"
                onClick={() => setShowForm(true)}
            >
                <Plus size={24} />
            </button>
            {/* Animated Expense Form */}
            {showForm && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="fixed inset-y-0 right-0 w-full md:w-1/3 bg-white shadow-lg p-4 z-50 flex flex-col"
                >
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowForm(false)}
                    >
                        <X size={24} />
                    </button>
                    <ExpenseForm onClose={() => setShowForm(false)} />
                </motion.div>
            )}
        </div>
    );
};

export default DashboardPage;