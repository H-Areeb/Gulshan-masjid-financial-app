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
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
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
        header: "Transaction #",
        accessorKey: "transactionId",
      },  
      {
        header: "Date",
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
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
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
          <div className="flex gap-2 text-blue-600 text-sm">
            {/* <button
              onClick={() => navigate(`/transactions/view/${row.original._id}`)}
              title="View"
            >
              <FaEye />
            </button> */}
            <button onClick={() => setViewModalData(row.original)} title="View">
              <FaEye />
            </button>

            {/* <button
              onClick={() => navigate(`/transactions/edit/${row.original._id}`)}
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="text-red-600"
              title="Delete"
            >
              <FaTrash />
            </button> */}
          </div>
        ),
      },
    ],
    [navigate]
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this transaction?')) return;
    try {
      await axios.delete(`/transactions/${id}`);
      fetchData();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };


  const exportToCSV = () => {
  const csv = Papa.unparse(data.map(txn => ({
    TransactionNo : txn.transactionId,
    Date: format(new Date(txn.date), 'dd-MM-yyyy'),
    Description: txn.description,
    Type: txn.type,
    Amount: txn.amount,
    Category: txn.category?.name || '-',
    CreatedBy: txn.createdBy?.name || '-',
    
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
      txn.transactionId,
      format(new Date(txn.date), 'dd-MM-yyyy'),
      txn.description,
      txn.type,
      `Rs ${txn.amount}`,
      txn.category?.name || '-',
      txn.createdBy?.name || '-'
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
      <div className="p-4 bg-white rounded shadow-sm">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-xl font-semibold mb-2 md:mb-0">Transactions</h2>
          <div className="flex gap-2 my-2">
            <button
              onClick={exportToCSV}
              className="text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
            >
              📄 Export CSV
            </button>
            <button
              onClick={exportToPDF}
              className="text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
            >
              📊 Export PDF
            </button>
          </div>

          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-64 text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase font-medium">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-2">
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center text-sm">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      {viewModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setViewModalData(null)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Transaction Details</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Transaction #:</strong> {viewModalData.transactionId}
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
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
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
                <strong>Created By:</strong> {viewModalData.createdBy?.name || "-"}
              </div>
              {viewModalData.image && (
                <div>
                  <strong>Receipt:</strong>
                  <img
                    src={viewModalData.image}
                    alt="receipt"
                    className="w-full h-auto rounded mt-2"
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
