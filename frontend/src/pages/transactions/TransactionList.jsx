import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { FaEye, FaTable, FaHome, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const TransactionList = () => {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const navigate = useNavigate();
  const [viewModalData, setViewModalData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get('/transactions');
      setData(res.data.data);
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: (
          <span className="flex items-center gap-1">
            <FaTable className="text-green-400" /> Transaction #
          </span>
        ),
        accessorKey: "transaction_id",
      },
      {
        header: (
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="text-purple-400" /> Date
          </span>
        ),
        accessorKey: "date",
        cell: (info) => format(new Date(info.getValue()), "dd MMM yyyy"),
      },
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => {
          const value = info.getValue();
          return (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                value === "income"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {value}
            </span>
          );
        },
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (info) => `Rs ${info.getValue().toLocaleString()}`,
      },
      {
        header: "Category",
        accessorFn: (row) => row.category?.name || "-",
        id: "category",
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2 text-green-600 text-sm">
            <button onClick={() => setViewModalData(row.original)} title="View">
              <FaEye />
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const exportToCSV = () => {
    const csv = Papa.unparse(data.map(txn => ({
      TransactionNo : txn.transaction_id,
      Date: format(new Date(txn.date), 'dd-MM-yyyy'),
      Description: txn.description,
      Type: txn.type,
      Amount: txn.amount,
      Category: txn.category?.name || '-',
      CreatedBy: txn.created_by?.name || '-',
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'transactions.csv');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Transaction Report', 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Transaction #','Date', 'Description', 'Type', 'Amount', 'Category', 'CreatedBy']],
      body: data.map(txn => [
        txn.transaction_id,
        format(new Date(txn.date), 'dd-MM-yyyy'),
        txn.description,
        txn.type,
        `Rs ${txn.amount}`,
        txn.category?.name || '-',
        txn.created_by?.name || '-'
      ])
    });
    doc.save('transactions.pdf');
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <Layout>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <FaHome className="text-green-400" />
        <FaChevronRight />
        <span className="hover:underline cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
        <FaChevronRight />
        <span className="text-gray-700 font-semibold">Transactions</span>
      </nav>

      <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-2xl shadow-lg border border-gray-100">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
            <FaTable className="text-green-400" /> Transactions List
          </h2>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="text-sm px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-semibold shadow"
            >
              📄 Export CSV
            </button>
            <button
              onClick={exportToPDF}
              className="text-sm px-4 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold shadow"
            >
              📊 Export PDF
            </button>
          </div>
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search transactions..."
            className="border border-gray-300 px-4 py-2 rounded-lg w-full md:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 font-semibold text-gray-600">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-green-50"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center text-sm">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-green-50 text-gray-700 font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 font-semibold">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-green-50 text-gray-700 font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {viewModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-gray-100">
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-green-700 text-2xl"
              onClick={() => setViewModalData(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center gap-2">
              <FaEye className="text-green-400" /> Transaction Details
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Transaction #:</strong> {viewModalData.transaction_id}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {format(new Date(viewModalData.date), "dd MMM yyyy")}
              </div>
              <div>
                <strong>Description:</strong> {viewModalData.description}
              </div>
              <div>
                <strong>Type:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    viewModalData.type === "income"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {viewModalData.type}
                </span>
              </div>
              <div>
                <strong>Amount:</strong> Rs{" "}
                {viewModalData.amount.toLocaleString()}
              </div>
              <div>
                <strong>Category:</strong> {viewModalData.category?.name || "-"}
              </div>
              <div>
                <strong>Created By:</strong> {viewModalData.created_by?.name || "-"}
              </div>
              {viewModalData.image && (
                <div>
                  <strong>Receipt:</strong>
                  <img
                    src={viewModalData.image}
                    alt="receipt"
                    className="w-full h-auto rounded mt-2 border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TransactionList;