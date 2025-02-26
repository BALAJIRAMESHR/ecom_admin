import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import Header from '../../components/Header';
// Import any Designlab-specific components you need

const Designlab = () => {
  const [activePage, setActivePage] = useState('Designlab');

  const handleNavigate = (page) => {
    setActivePage(page);
    console.log(`Navigated to: ${page}`);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F4F4]">
      <div className='max-sm:hidden flex'>
        <Sidebar active={activePage} onNavigate={handleNavigate} />
      </div>
      <div className="flex-1 py-6 px-8 max-h-screen min-h-screen overflow-scroll">
        <Header />
        {/* Your Designlab specific content here */}
        <div className="mt-6">
          <h1 className="text-2xl font-bold">Design Lab</h1>
          {/* Add your Designlab components and functionality here */}
        </div>
      </div>
    </div>
  );
};

export default Designlab;