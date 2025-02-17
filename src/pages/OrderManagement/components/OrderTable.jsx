import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import orderService from '../../../services/orderService';
import { toast } from 'react-toastify';
import { handleImageError, getImageUrl } from '../../../utils/imageUtils';

const OrderTable = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('All orders');
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

  const handleView = (order) => {
    onSelectOrder(order);
  };

  // Filter tabs
  const filterTabs = ['All orders', 'Shipped', 'Completed', 'Cancel/Refund'];

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  console.log(orders);

  return (
    <div className="w-full">
      {/* Filter Tabs */}
      <div className="flex gap-6 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 ${
              filter === tab
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500'
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
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-4 text-gray-600 font-medium">Order Detail</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Customer Detail</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Status</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Total Amount</th>
              <th className="px-6 py-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium">ORDER#{order._id.slice(-6)}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</span>
                    <br />
                    <span className="text-gray-500">{order.shippingAddress.phoneNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={order.isPaid ? 'text-green-500' : 'text-red-500'}>
                      {order.isPaid ? 'Paid' : 'Cash on Delivery'}
                    </span>
                    <span className="text-blue-500">
                      {order.isDelivered ? 'Delivered' : 'Processing'}
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
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Pencil className="w-4 h-4 text-green-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
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
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;