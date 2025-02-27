import React, { useState, useEffect } from 'react';
import { Trash2, Pencil, Eye } from 'lucide-react';
import orderService from '../../../services/orderService';
import { toast } from 'react-toastify';

// Delete Confirmation Dialog component remains the same
const DeleteConfirmationDialog = ({ isOpen, onClose, orderId, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Delete Order</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            No
          </button>
          <button 
            onClick={() => {
              onDelete(orderId);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Fixed Edit Order Dialog component - hooks called unconditionally
const EditOrderDialog = ({ isOpen, onClose, order, onUpdate }) => {
  // Always initialize hooks at the top level
  const [status, setStatus] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  
  // Status options
  const statusOptions = ['Processing', 'Hold', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
  
  // Update local state when order changes
  useEffect(() => {
    if (order) {
      const orderStatus = order.status || (order.isDelivered ? 'Delivered' : 'Processing');
      setStatus(orderStatus);
      setCurrentStatus(orderStatus);
    }
  }, [order]);
  
  if (!isOpen || !order) return null;

  const handleUpdate = () => {
    const updatedOrder = {
      ...order,
      status,
      isDelivered: status === 'Delivered'
    };
    
    onUpdate(updatedOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Quick Edit</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current fulfillment Status
          </label>
          <input 
            type="text" 
            value={currentStatus} 
            readOnly 
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Change fulfillment Status
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdate}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated OrderTable component with edit functionality
const OrderTable = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All orders');
  const [orderTypeFilter, setOrderTypeFilter] = useState('All');
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  
  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await orderService.deleteOrder(id);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.message || 'Failed to delete order');
    }
  };
  
  const handleUpdateOrder = async (updatedOrder) => {
    try {
      await orderService.updateOrder(updatedOrder._id, updatedOrder);
      toast.success('Order updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.message || 'Failed to update order');
    }
  };
  
  const openDeleteDialog = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };
  
  const openEditDialog = (order) => {
    setOrderToEdit(order);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setOrderToEdit(null);
  };

  const handleView = (order) => {
    onSelectOrder(order);
  };

  // Order type tabs - removed "General"
  const orderTypeTabs = ['All', 'Alteration', 'Customization'];

  // Status filter tabs
  const statusTabs = ['All orders', 'Shipped', 'Completed', 'Cancel/Refund'];

  // Handle toggle all orders selection
  const handleToggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    const newSelectedOrders = {};
    if (newSelectAll) {
      // Select all current visible orders
      currentOrders.forEach(order => {
        newSelectedOrders[order._id] = true;
      });
    }
    
    setSelectedOrders(newSelectedOrders);
  };

  // Handle individual order selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
    
    // Update selectAll state based on selection
    if (selectedOrders[orderId]) {
      setSelectAll(false);
    } else {
      const allSelected = currentOrders.every(order => 
        order._id === orderId ? true : selectedOrders[order._id]
      );
      setSelectAll(allSelected);
    }
  };

  // Filter orders based on selected filters
  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    // Apply order type filter
    if (orderTypeFilter !== 'All') {
      filtered = filtered.filter(order => order.orderType === orderTypeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'All orders') {
      switch (statusFilter) {
        case 'Shipped':
          filtered = filtered.filter(order => 
            !order.isDelivered && order.status !== 'Cancelled');
          break;
        case 'Completed':
          filtered = filtered.filter(order => order.isDelivered);
          break;
        case 'Cancel/Refund':
          filtered = filtered.filter(order => 
            order.status === 'Cancelled' || order.status === 'Refunded');
          break;
        default:
          break;
      }
    }
    
    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-500';
      case 'Processing':
        return 'text-blue-500';
      case 'Cancelled':
      case 'Refunded':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="w-full">
      {/* Order Type Tabs */}
      <div className="flex gap-4 mb-6">
        {orderTypeTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setOrderTypeFilter(tab);
              setCurrentPage(1);
            }}
            className={`px-8 py-3 rounded-lg ${
              orderTypeFilter === tab
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-6 mb-6">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setStatusFilter(tab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 ${
              statusFilter === tab
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-4 text-gray-600 font-medium">
                <input 
                  type="checkbox" 
                  className="rounded" 
                  checked={selectAll}
                  onChange={handleToggleSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-gray-600 font-medium">Order Detail</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Customer Detail</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Status</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Total Amount</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      checked={!!selectedOrders[order._id]}
                      onChange={() => handleSelectOrder(order._id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">ORDER#{order._id.slice(-6)}</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                      {order.orderType && order.orderType !== 'General' && (
                        <span className="text-xs px-2 py-1 mt-1 rounded-full bg-purple-100 text-purple-600 inline-block w-fit">
                          {order.orderType}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span>{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</span>
                      <span className="text-gray-500">{order.shippingAddress.phoneNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={order.isPaid ? 'text-green-500' : 'text-orange-500'}>
                        {order.isPaid ? 'Paid' : 'Cash on Delivery'}
                      </span>
                      <span className={getStatusClass(order.status || (order.isDelivered ? 'Delivered' : 'Processing'))}>
                        {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">₹{order.totalPrice}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(order)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => openEditDialog(order)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 text-green-500" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(order._id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No orders found matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <div>
            Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {totalPages <= 5 ? (
              [...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? 'bg-purple-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 ? 'bg-purple-600 text-white' : 'border hover:bg-gray-50'
                  }`}
                >
                  1
                </button>
                {currentPage > 3 && <span className="px-2">...</span>}
                {currentPage > 2 && currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage)}
                    className="px-3 py-1 rounded bg-purple-600 text-white"
                  >
                    {currentPage}
                  </button>
                )}
                {currentPage < totalPages - 2 && <span className="px-2">...</span>}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages ? 'bg-purple-600 text-white' : 'border hover:bg-gray-50'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        orderId={orderToDelete}
        onDelete={handleDelete}
      />
      
      {/* Edit Order Dialog */}
      <EditOrderDialog
        isOpen={editDialogOpen}
        onClose={closeEditDialog}
        order={orderToEdit}
        onUpdate={handleUpdateOrder}
      />
    </div>
  );
};

export default OrderTable;