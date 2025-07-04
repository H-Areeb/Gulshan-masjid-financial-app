import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const TransactionForm = () => {
    const [formData, setFormData] = useState({
    date: '',
    description: '',
    type: 'income',
    category: '',
    amount: '',
    attachment: null,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/categories').then((res) => {
        console.log(res.data.data)
      setCategories(res.data.data || []);
    });
  }, []);

  const filteredCategories = categories.filter(
  (cat) => cat.type === formData.type
);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  Object.entries(formData).forEach(([key, val]) => {
    data.append(key, val);
  });

  try {
    await axios.post('/transactions', data);
    toast.success('Transaction submitted successfully ✅');
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
    toast.error('Failed to submit transaction ❌');
  }
};



  return (
    <Layout> 
        <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">🧾 Add New Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            placeholder="e.g. Friday Donation"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Transaction Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
          <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
  required
>
  <option value="">Select Category</option>
  {filteredCategories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>

        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Amount (PKR)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g. 1000"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Attachment */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Attachment (optional)</label>
          <input
            type="file"
            name="attachment"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Submit Transaction
          </button>
        </div>
      </form>
    </div>
    </Layout>
  );
};

export default TransactionForm;
