import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { FaCalendarAlt, FaRegFileAlt, FaMoneyBillWave, FaListUl, FaFileUpload, FaHome, FaChevronRight } from 'react-icons/fa';
import { showThemedToast } from '../../utils/showThemedToasts';

const TransactionForm = () => {

 const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: '',
    description: '',
    type: 'income',
    category: '',
    amount: '',
    attachment: null,
  });

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get('/categories').then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

  const categoryOptions = filteredCategories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCategoryChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      category: option ? option.value : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val);
    });

    try {
      await axios.post('/transactions', data);
     showThemedToast('success', 'Transaction submitted successfully.');
      setFormData({
        date: '',
        description: '',
        type: 'income',
        category: '',
        amount: '',
        attachment: null,
      });
    } catch (err) {
      console.error(err);
      showThemedToast('error', 'Failed to submit transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <FaHome className="text-green-400" />
        <FaChevronRight />
        <span
          className="hover:underline cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </span>
        <FaChevronRight />
        <span className="text-gray-700 font-semibold">Add Transaction</span>
      </nav>

      <div className="max-w-xl mx-auto mt-10 p-8 bg-gray-50 rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 flex items-center justify-center gap-2">
          <FaRegFileAlt className="text-green-400" /> Add New Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <FaCalendarAlt className="text-green-400" /> Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
              required
            />
          </div>

          {/* Description */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <FaListUl className="text-green-400" /> Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="e.g. Friday Donation"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
              required
            />
          </div>

          {/* Type */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-400" /> Transaction Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <FaListUl className="text-green-400" /> Category
            </label>
            <Select
              name="category"
              value={categoryOptions.find(opt => opt.value === formData.category) || null}
              onChange={handleCategoryChange}
              options={categoryOptions}
              placeholder="Search or select category"
              isClearable
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  borderColor: '#d1fae5',
                  boxShadow: 'none',
                  minHeight: '40px',
                  backgroundColor: '#fff',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#f0fdf4' : '#fff',
                  color: '#1e293b',
                }),
              }}
              required
            />
          </div>

          {/* Amount */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-400" /> Amount (PKR)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. 1000"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
              required
            />
          </div>

          {/* Attachment */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
              <FaFileUpload className="text-green-400" /> Attachment (optional)
            </label>
            <input
              type="file"
              name="attachment"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>Submit Transaction</>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default TransactionForm;