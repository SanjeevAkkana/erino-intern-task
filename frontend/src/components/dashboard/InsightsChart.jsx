import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import useExpenseStore from '../../store/useExpenseStore';

ChartJS.register(ArcElement, Tooltip, Legend);

const InsightsChart = ({ refresh }) => {
    const { expenses } = useExpenseStore();
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState([]);

    useEffect(() => {
        if (expenses.length > 0) {
            const categoryTotals = expenses.reduce((acc, expense) => {
                acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                return acc;
            }, {});

            const formattedInsights = Object.keys(categoryTotals).map((category) => ({
                category,
                totalAmount: categoryTotals[category],
                percentage: ((categoryTotals[category] / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100).toFixed(2),
            }));

            setInsights(formattedInsights);
        } else {
            setInsights([]);
        }
        setLoading(false);
    }, [expenses, refresh]);

    const chartData = {
        labels: insights.map((item) => item.category),
        datasets: [
            {
                data: insights.map((item) => item.totalAmount),
                backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'],
                hoverBackgroundColor: ['#2563EB', '#7C3AED', '#DB2777', '#059669', '#D97706', '#DC2626'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 14 },
                    color: '#374151',
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const percentage = insights[context.dataIndex]?.percentage || 0;
                        return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-xl w-full">
            <div className="w-full">
                <div className="flex items-center gap-x-2 mb-3">
                    <h2 className="text-xl tracking-wide text-gray-800">
                        Spending Insights
                    </h2>
                </div>
                <div className="border border-gray-200 rounded-2xl bg-white py-3">
                    {loading ? (
                        <p className="text-gray-500 text-center">Loading insights...</p>
                    ) : insights.length === 0 ? (
                        <p className="text-gray-500 py-3 text-center">No insights available yet.</p>
                    ) : (
                        <div className="h-96 mx-auto">
                            <Pie data={chartData} options={options} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InsightsChart;