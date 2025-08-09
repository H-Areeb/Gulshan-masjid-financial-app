import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  FaChartBar,
  FaMoneyCheckAlt,
  FaFileAlt,
  FaTags,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaMosque,
  FaUpload,
  FaPlus,
  FaListUl
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openMenu, setOpenMenu] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaChartBar /> },
    {
      name: 'Transactions',
      icon: <FaMoneyCheckAlt />,
      subItems: [
        { name: 'View Transactions', path: '/transactions', icon: <FaListUl /> },
        ...(user?.role === 'admin' || user?.role === 'accountant'
          ? [
              { name: 'Add Transaction', path: '/transactions/add', icon: <FaPlus /> },
              { name: 'Upload Data', path: '/transactions/uploadData', icon: <FaUpload /> }
            ]
          : []),
      ],
    },
    { name: 'Reports', path: '/reports', icon: <FaFileAlt /> },
    { name: 'Categories', path: '/categories', icon: <FaTags /> },
    { name: 'Users', path: '/users', icon: <FaUsers /> },
  ];

  const renderNavItems = () =>
    navItems.map((item) => (
      <div key={item.name}>
        {item.subItems ? (
          <div>
            <button
              onClick={() =>
                setOpenMenu(openMenu === item.name ? "" : item.name)
              }
              className="w-full flex justify-between items-center px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-green-50 transition"
            >
              <span className="flex items-center gap-2">
                <span className="text-green-500">{item.icon}</span>
                {item.name}
              </span>
              <span className="text-gray-400">
                {openMenu === item.name ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            {openMenu === item.name && (
              <div className="ml-4 mt-2 bg-green-50 rounded-xl shadow-lg border border-green-100 py-2 px-2 transition-all duration-200 space-y-2">
                {item.subItems.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        isActive
                          ? "bg-green-200 text-green-800 shadow"
                          : "text-gray-700 hover:bg-green-100 hover:text-green-700"
                      }`
                    }
                    onClick={() => setIsOpen?.(false)}
                  >
                    <span className="text-green-400">{sub.icon}</span>
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md font-medium transition ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "text-gray-700 hover:bg-green-50"
              }`
            }
            onClick={() => setIsOpen?.(false)}
          >
            <span className="text-green-500">{item.icon}</span>
            {item.name}
          </NavLink>
        )}
      </div>
    ));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen bg-white shadow-md fixed left-0 top-0 z-40 border-r border-gray-100">
        <div className="p-6 border-b flex flex-col items-center bg-green-50">
          <FaMosque className="text-green-500 text-3xl mb-2" />
          <h1 className="text-xl font-bold text-gray-700">Gulshan Masjid</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
        <nav className="mt-4 px-4 space-y-2">{renderNavItems()}</nav>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-30 md:hidden transition-opacity ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-md z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden border-r border-gray-100`}
      >
        <div className="p-6 border-b flex justify-between items-center bg-green-50">
          <div className="flex items-center gap-2">
            <FaMosque className="text-green-500 text-2xl" />
            <h1 className="text-lg font-bold text-gray-700">Gulshan Masjid</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-600 text-xl">
            &times;
          </button>
        </div>
        <nav className="mt-4 px-4 space-y-2">{renderNavItems()}</nav>
      </aside>
    </>
  );
};

export default Sidebar;