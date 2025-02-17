import React, { useState } from 'react';
import Sidebar from '../../components/SideBar';
import Header from '../../components/Header';
import OrderTable from './components/OrderTable';
import OrderDetails from './components/OrderDetails';
import { handleImageError, getImageUrl } from '../../utils/imageUtils';

const OrderManagement = () => {
  const [activePage, setActivePage] = useState('Order Management');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleNavigate = (page) => {
    setActivePage(page);
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleBack = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F4F4]">
      <div className='max-sm:hidden flex'>
        <Sidebar active={activePage} onNavigate={handleNavigate} />
      </div>
      <div className="flex-1 py-6 px-8 max-h-screen min-h-screen overflow-scroll">
        <Header />
        {selectedOrder ? (
          <OrderDetails 
            orderDetails={selectedOrder} 
            onBack={handleBack}
          />
        ) : (
          <OrderTable onSelectOrder={handleOrderSelect} />
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
