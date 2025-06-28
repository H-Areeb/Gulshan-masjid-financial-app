// src/pages/Dashboard.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import Layout from '../components/Layout';

const Dashboard = () => {
  // Sample chart data
  const chartData = [
    { name: 'Jan', income: 50000, expense: 30000 },
    { name: 'Feb', income: 65000, expense: 40000 },
    { name: 'Mar', income: 70000, expense: 45000 },
  ];

  return (
    <Layout>
      <div className="p-4 md:p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Total Income</p>
            <p className="text-xl font-bold text-green-600">Rs 150,000</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Total Expense</p>
            <p className="text-xl font-bold text-red-600">Rs 90,000</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Balance</p>
            <p className="text-xl font-bold text-blue-600">Rs 60,000</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-500 text-sm">Transactions</p>
            <p className="text-xl font-bold text-gray-800">24</p>
          </div>
        </div>

        {/* Graph Section */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">
            Income vs Expense (Monthly)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
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
      </div>
    </Layout>
  );
};

export default Dashboard;
