// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Transactions', path: '/transactions', icon: '💰' },
    { name: 'Reports', path: '/reports', icon: '📑' },
    { name: 'Categories', path: '/categories', icon: '🏷️' },
    { name: 'Users', path: '/users', icon: '👥' },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 h-screen bg-white shadow-md fixed left-0 top-0 z-40">
        <div className="p-4 border-b text-center">
          <h1 className="text-xl font-bold text-blue-600">Gulshan Masjid</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md font-medium ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden transition-opacity ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-md z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-lg font-bold text-blue-600">Gulshan Masjid</h1>
          <button onClick={() => setIsOpen(false)} className="text-gray-600 text-xl">&times;</button>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md font-medium ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
