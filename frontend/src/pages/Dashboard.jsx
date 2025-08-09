import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import Layout from '../components/Layout';
import axios from '../api/axios';

const COLORS = ['#10B981', '#F59E42', '#6366F1', '#EF4444', '#FBBF24', '#6EE7B7', '#A7F3D0', '#F472B6'];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [categoryIncome, setCategoryIncome] = useState([]);
  const [categoryExpense, setCategoryExpense] = useState([]);
  const [topExpenseCategories, setTopExpenseCategories] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [yearlyTrends, setYearlyTrends] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [donorTrends, setDonorTrends] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("/transactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = res.data.data || [];
        setTransactions(data);

        // Calculate stats
        let totalIncome = 0;
        let totalExpense = 0;
        data.forEach((txn) => {
          if (txn.type === "income") totalIncome += Number(txn.amount);
          if (txn.type === "expense") totalExpense += Number(txn.amount);
        });
        setStats({
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          transactionCount: data.length,
        });

        // Prepare monthly chart data
        const monthly = {};
        data.forEach((txn) => {
          const date = new Date(txn.date);
          const month = date.toLocaleString("default", { month: "short" });
          const year = date.getFullYear();
          const key = `${month} ${year}`;
          if (!monthly[key])
            monthly[key] = { name: key, income: 0, expense: 0 };
          if (txn.type === "income") monthly[key].income += Number(txn.amount);
          if (txn.type === "expense")
            monthly[key].expense += Number(txn.amount);
        });
        const sortedChartData = Object.values(monthly).sort((a, b) => {
          const [aMonth, aYear] = a.name.split(" ");
          const [bMonth, bYear] = b.name.split(" ");
          return (
            new Date(`${aMonth} 1, ${aYear}`) -
            new Date(`${bMonth} 1, ${bYear}`)
          );
        });
        setChartData(sortedChartData);

        // Category-wise Breakdown
        const incomeCat = {};
        const expenseCat = {};
        data.forEach((txn) => {
          const cat = txn.category?.name || "Other";
          if (txn.type === "income")
            incomeCat[cat] = (incomeCat[cat] || 0) + Number(txn.amount);
          if (txn.type === "expense")
            expenseCat[cat] = (expenseCat[cat] || 0) + Number(txn.amount);
        });
        setCategoryIncome(
          Object.entries(incomeCat).map(([name, value]) => ({ name, value }))
        );
        setCategoryExpense(
          Object.entries(expenseCat).map(([name, value]) => ({ name, value }))
        );
        setTopExpenseCategories(
          Object.entries(expenseCat)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
        );

        // Recent Transactions
        setRecentTransactions(
          [...data]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 8)
        );

        // Yearly Trends (last 12 months)
        const yearly = {};
        data.forEach((txn) => {
          const date = new Date(txn.date);
          const month = date.toLocaleString("default", { month: "short" });
          const year = date.getFullYear();
          const key = `${month} ${year}`;
          if (!yearly[key]) yearly[key] = { name: key, income: 0, expense: 0 };
          if (txn.type === "income") yearly[key].income += Number(txn.amount);
          if (txn.type === "expense") yearly[key].expense += Number(txn.amount);
        });
        const sortedYearly = Object.values(yearly)
          .sort((a, b) => {
            const [aMonth, aYear] = a.name.split(" ");
            const [bMonth, bYear] = b.name.split(" ");
            return (
              new Date(`${aMonth} 1, ${aYear}`) -
              new Date(`${bMonth} 1, ${bYear}`)
            );
          })
          .slice(-12);
        setYearlyTrends(sortedYearly);

        // Donor Contributions (from description, category = Donation Book)
        const donorMap = {};
        data.forEach((txn) => {
          if (
            txn.type === "income" &&
            txn.category?.name === "Donation Book" &&
            txn.description
          ) {
            const donor = txn.description.trim();
            donorMap[donor] = (donorMap[donor] || 0) + Number(txn.amount);
          }
        });
        setTopDonors(
          Object.entries(donorMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
        );

        // Donor Trends (monthly donations from Donation Book)
        const donorMonthly = {};
        data.forEach((txn) => {
          if (txn.type === "income" && txn.category?.name === "Donation Book") {
            const date = new Date(txn.date);
            const month = date.toLocaleString("default", { month: "short" });
            const year = date.getFullYear();
            const key = `${month} ${year}`;
            donorMonthly[key] = (donorMonthly[key] || 0) + Number(txn.amount);
          }
        });
        const sortedDonorTrends = Object.entries(donorMonthly)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => {
            const [aMonth, aYear] = a.name.split(" ");
            const [bMonth, bYear] = b.name.split(" ");
            return (
              new Date(`${aMonth} 1, ${aYear}`) -
              new Date(`${bMonth} 1, ${bYear}`)
            );
          });
        setDonorTrends(sortedDonorTrends);
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Total Income</p>
            <p className="text-xl font-bold text-green-600">Rs {stats.totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Total Expense</p>
            <p className="text-xl font-bold text-red-600">Rs {stats.totalExpense.toLocaleString()}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Balance</p>
            <p className="text-xl font-bold text-blue-600">Rs {stats.balance.toLocaleString()}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Transactions</p>
            <p className="text-xl font-bold text-gray-800">{stats.transactionCount}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Income vs Expense Bar Chart */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Income vs Expense (Monthly)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10B981" />
                <Bar dataKey="expense" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Yearly Trends Line Chart */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Yearly Trends (Last 12 Months)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={yearlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Income Category Pie Chart */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Income by Category</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryIncome}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryIncome.map((entry, index) => (
                    <Cell key={`cell-income-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Expense Category Pie Chart */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Expense by Category</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryExpense}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryExpense.map((entry, index) => (
                    <Cell key={`cell-expense-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Expense Categories Bar Chart */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Top Expense Categories</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topExpenseCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donor Contributions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Top Donors List */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Top Donors</h2>
            <ul className="divide-y">
              {topDonors.map((donor, idx) => (
                <li key={donor.name} className="py-2 flex justify-between items-center">
                  <span className="font-medium text-gray-700">{idx + 1}. {donor.name}</span>
                  <span className="text-green-600 font-bold">Rs {donor.value.toLocaleString()}</span>
                </li>
              ))}
              {topDonors.length === 0 && <li className="py-2 text-gray-400">No donor data</li>}
            </ul>
          </div>
          {/* Donor Trends Chart */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Donor Trends (Monthly Donations)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={donorTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 font-semibold">Date</th>
                  <th className="px-4 py-2 font-semibold">Description</th>
                  <th className="px-4 py-2 font-semibold">Type</th>
                  <th className="px-4 py-2 font-semibold">Amount</th>
                  <th className="px-4 py-2 font-semibold">Category</th>
                  <th className="px-4 py-2 font-semibold">Donor</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(txn => (
                  <tr key={txn._id} className="border-b">
                    <td className="px-4 py-2">{new Date(txn.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{txn.description}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        txn.type === 'income'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-2">Rs {Number(txn.amount).toLocaleString()}</td>
                    <td className="px-4 py-2">{txn.category?.name || '-'}</td>
                    <td className="px-4 py-2">{txn.created_by?.name || '-'}</td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">No recent transactions</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;