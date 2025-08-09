import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from '../../api/axios';
import Layout from "../../components/Layout";
import Select from "react-select";
import { showThemedToast } from '../../utils/showThemedToasts';
import { FaEye, FaTable, FaHome, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UploadData = () => {
  
  const [csvData, setCsvData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [submitError, setSubmitError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this state

 const navigate = useNavigate();

  const requiredHeaders = ["Date", "Description", "Type", "Amount", "Category"];
  const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD


  
  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        console.log(res.data.data);
        setCategories(Array.isArray(res.data.data) ? res.data.data : []);

      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);


    // Helper to get category_id by name
  const getCategoryId = (name) => {
    const cat = categories.find(c => c.name.toLowerCase() === name?.toLowerCase());
    return cat ? cat.id : "";
  };

  // Handle category change in preview table
    const handleCategoryChange = (idx, newCategoryName) => {
    const updatedData = csvData.map((row, i) =>
        i === idx ? { ...row, Category: newCategoryName } : row
    );
    validateData(updatedData);
    };

  const validateData = (data) => {
    const validationErrors = [];

    const validatedRows = data
    .filter(row =>
      // Only include rows that have at least one non-empty required field
      requiredHeaders.some(header => row[header] && row[header].trim() !== "")
    )
    .map((row, index) => {
      let rowError = "";

      for (let header of requiredHeaders) {
        if (!row[header] || row[header].trim() === "") {
          rowError = `Missing value for "${header}"`;
          break;
        }
      }
      

      if (!rowError && !DATE_REGEX.test(row.Date)) {
        rowError = `Invalid Date: "${row.Date}" (use YYYY-MM-DD)`;
      }

      if (!rowError && !["income", "expense"].includes(row.Type)) {
        rowError = `Invalid Type: "${row.Type}" (use income/expense)`;
      }

      if (!rowError && isNaN(parseFloat(row.Amount))) {
        rowError = `Invalid Amount: "${row.Amount}"`;
      }

      if (!rowError && !row.Category) {
        rowError = `Missing Category`;
      }

       // Check if category exists in categories array
    if (
      !rowError &&
      !categories.some(
        (cat) => cat.name.toLowerCase() === row.Category?.toLowerCase()
      )
    ) {
      rowError = `Category "${row.Category}" not found`;
    }

      if (rowError) {
        validationErrors.push({ row: index + 2, message: rowError });
      }

      return { ...row, error: rowError };
    });

    console.log("Validation Errors:", validationErrors);

    setCsvData(validatedRows);
    setErrors(validationErrors);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

  // Reset previous data and errors before processing new file
    setCsvData([]);
    setErrors([]);
    setSubmitError(null);
    setSubmitMessage("");

    setFile(selectedFile);




    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => validateData(results.data),
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        validateData(jsonData);
      };
      reader.readAsBinaryString(selectedFile);
    } else {
      alert("❌ Please upload a .csv, .xls, or .xlsx file");
    }
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
  e.preventDefault();
  setDragActive(false); // remove highlight
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    processFile(e.dataTransfer.files[0]); // process & preview instantly
    e.dataTransfer.clearData();
  }
};

const handleDragOver = (e) => {
  e.preventDefault();
  if (!dragActive) setDragActive(true);
};

const handleDragLeave = (e) => {
  e.preventDefault();
  // Delay the highlight removal slightly for smoother UX
  setTimeout(() => setDragActive(false), 100);
};


const handleSubmit = async () => {
  setSubmitError(null);
  setSubmitMessage(""); // Reset messages before submission
  setIsSubmitting(true); // Disable button and show processing
  
  try {
         const submitData = csvData
            .filter(row => !row.error)
            .map(row => ({
            date: row.Date,
            description: row.Description,
            type: row.Type,
            amount: parseFloat(row.Amount),
            category_id: getCategoryId(row.Category), // <-- Use category_id
        }));

      // Check for missing category_id
      const missingCat = submitData.find(d => !d.category_id);
      if (missingCat) {
        showThemedToast('error', `Category "${missingCat.category}" not found. Please select a valid category.`);
        setSubmitMessage("");
        setIsSubmitting(false);
        return;
      }

       showThemedToast('success', "Submission in processing...");


    const res = await axios.post('/transactions', submitData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });

    // Check for API errors
    if (res.status !== 200 || res.data?.error) {
      showThemedToast('error', res.data?.error || "❌ Submission failed.");
      return;
    }

    showThemedToast('success', "Data submitted successfully!");
    setSubmitError(null);

        // Wait 2 seconds before reset
    setTimeout(() => {
      setCsvData([]);
      setErrors([]);
      resetForm();
      setIsSubmitting(false);
      setSubmitMessage("");
    }, 2000);

  } catch (err) {
    showThemedToast('error',
      err?.response?.data?.error ||
      err?.message ||
      "❌ Submission failed. Check console."
    );
   
    console.error(err);
  }
};

  const resetForm = () => {
    setCsvData([]);
    setErrors([]);
    setFile(null);
    document.getElementById("fileInput").value = "";
  };

  const downloadSample = () => {
    const csvContent =
      "Date,Description,Type,Amount,Category\n2025-06-01,Friday Donation,Income,1500,Donations\n";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sample_transactions.csv";
    a.click();
  };




  return (
    <Layout>

     {/* Breadcrumb */}
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <FaHome className="text-green-400" />
        <FaChevronRight />
        <span className="hover:underline cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
        <FaChevronRight />
        <span className="text-gray-700 font-semibold">Upload Transactions</span>
    </nav>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Upload Transactions</h2>

        <div className="flex flex-wrap gap-6">
          <div
            className={`flex-1 min-w-[350px] bg-white shadow-lg rounded-xl p-6 border-2 transition-all duration-200 ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h3 className="text-lg font-semibold mb-4">Upload File</h3>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                id="fileInput"
                type="file"
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center">
                <span className="text-gray-500">
                  Drag & Drop file here or{" "}
                  <span className="text-blue-500 underline">Choose file</span>
                </span>
                <p className="text-sm text-gray-400 mt-2">
                  File types: <b>xls, xlsx, csv</b>
                </p>
              </div>
            </div>
          </div>

          <div className="w-[250px] bg-white shadow-lg rounded-xl p-6 border border-gray-200 flex flex-col items-center justify-center">
            <img
              src="https://img.icons8.com/color/96/microsoft-excel-2019--v1.png"
              alt="Excel Icon"
              className="w-16 h-16 mb-4"
            />
            <p className="text-center text-gray-600 mb-2">
              Download a sample file
            </p>
            <button
              onClick={downloadSample}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Download Sample
            </button>
          </div>
        </div>

        {csvData.length > 0 && (
          <div className="mt-8 overflow-auto border rounded-lg shadow-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {requiredHeaders.map((header) => (
                    <th key={header} className="border px-3 py-2 text-left">
                      {header}
                    </th>
                  ))}
                  <th className="border px-3 py-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={row.error ? "bg-red-100" : "bg-green-50"}
                  >
                    {requiredHeaders.map((header) => (
                      <td key={header} className="border px-3 py-2">
                        {header === "Category" ? (
                          <Select
                            value={
                              row.Category
                                ? { label: row.Category, value: row.Category }
                                : null
                            }
                            onChange={(option) =>
                              handleCategoryChange(
                                idx,
                                option ? option.value : ""
                              )
                            }
                            options={categories.map((cat) => ({
                              label: cat.name,
                              value: cat.name,
                            }))}
                            placeholder="Select Category"
                            isClearable
                            classNamePrefix="react-select"
                            styles={{
                              control: (base) => ({
                                ...base,
                                minHeight: "32px",
                                backgroundColor: row.error
                                  ? "#fee2e2"
                                  : "#f0fdf4", // red if error, green if valid
                              }),
                            }}
                          />
                        ) : (
                          row[header]
                        )}
                      </td>
                    ))}
                    <td className="border px-3 py-2 text-red-600">
                      {row.error || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {csvData.length > 0 && (
          <div className="mt-4 flex gap-4">
            <button
              className={`px-6 py-2 rounded-lg ${
                errors.length === 0
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={errors.length > 0}
              onClick={handleSubmit}
            >
              Submit Data
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Reset
            </button>
            <div>
              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}
              {submitMessage && (
                <p className="text-sm text-green-600">{submitMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UploadData;
