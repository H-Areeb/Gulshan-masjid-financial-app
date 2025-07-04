// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openMenu, setOpenMenu] = useState(''); // For toggling submenus
  const user = JSON.parse(localStorage.getItem('user'));

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Transactions', icon: '💰', subItems: [
      { name: 'View Transactions', path: '/transactions' },
      ...(user?.role === 'admin' || user?.role === 'accountant'
        ? [{ name: 'Add Transaction', path: '/transactions/add' }]
        : []),
    ]},
    { name: 'Reports', path: '/reports', icon: '📑' },
    { name: 'Categories', path: '/categories', icon: '🏷️' },
    { name: 'Users', path: '/users', icon: '👥' },
  ];

  const renderNavItems = () =>
    navItems.map((item) => (
      <div key={item.name}>
        {item.subItems ? (
          <div>
            <button
              onClick={() => setOpenMenu(openMenu === item.name ? '' : item.name)}
              className="w-full flex justify-between items-center px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100"
            >
              <span>
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </span>
              <span>{openMenu === item.name ? '▲' : '▼'}</span>
            </button>
            {openMenu === item.name && (
              <div className="ml-6 space-y-1">
                {item.subItems.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) =>
                      `block px-3 py-1 rounded-md text-sm ${
                        isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                    onClick={() => setIsOpen?.(false)}
                  >
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
              `block px-3 py-2 rounded-md font-medium ${
                isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
            onClick={() => setIsOpen?.(false)}
          >
            <span className="mr-2">{item.icon}</span>
            {item.name}
          </NavLink>
        )}
      </div>
    ));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen bg-white shadow-md fixed left-0 top-0 z-40">
        <div className="p-4 border-b text-center">
          <h1 className="text-xl font-bold text-blue-600">Gulshan Masjid</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
        <nav className="mt-4 px-4 space-y-2">{renderNavItems()}</nav>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden transition-opacity ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-md z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-lg font-bold text-blue-600">Gulshan Masjid</h1>
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
