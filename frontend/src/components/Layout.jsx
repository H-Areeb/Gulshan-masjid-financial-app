// src/components/Layout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Topbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 bg-gray-50 p-4 mt-16 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
