// src/components/Topbar.jsx
import { FaBars, FaUserCircle } from 'react-icons/fa';

const Topbar = ({ setSidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md h-16 px-4 flex items-center justify-between md:ml-64">
      <button onClick={() => setSidebarOpen(true)} className="md:hidden text-xl text-gray-700">
        <FaBars />
      </button>
      <div className="flex items-center space-x-4 ml-auto">
        <button className="text-gray-600 hover:text-blue-600">
          <FaUserCircle className="text-2xl" />
        </button>
        <button className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
