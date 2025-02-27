import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import Header from '../../components/Header';
import AddProduct from './components/AddProduct';
import ProductTable from './components/ProductTable';

const ProductManagement = () => {
  const [activePage, setActivePage] = useState('Design Lab');
  const [AddForm, setAddForm] = useState(false);

  const handleNavigate = (page) => {
    setActivePage(page);
    console.log(`Navigated to: ${page}`);
  };

  const handleAddProductSubmit = (productData) => {
    console.log('Product added:', productData);
    setAddForm(false); // Close the form and return to product table
  };

  const handleAddProductCancel = () => {
    setAddForm(false); // Close the form and return to product table
  };

  return (
    <div className="flex min-h-screen bg-[#F8F4F4]">
      <div className='max-sm:hidden flex'>
        <Sidebar active={activePage} onNavigate={handleNavigate} />
      </div>
      <div className="flex-1 py-6 px-8 max-h-screen min-h-screen overflow-scroll">
        <Header />
        {AddForm ? (
          <AddProduct 
            onSubmit={handleAddProductSubmit}
            onCancel={handleAddProductCancel}
          />
        ) : (
          <ProductTable setAddForm={setAddForm} />
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
