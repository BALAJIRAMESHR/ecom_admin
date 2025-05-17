import React, { useState } from 'react';
import { X } from 'lucide-react';
import orderService from '../../../services/orderService';
import { toast } from 'react-toastify';

const Refund = ({ order, onClose, onRefundComplete }) => {
  const [refundAmount, setRefundAmount] = useState(order.totalPrice.toString());
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const refundData = {
        orderId: order._id,
        amount: parseFloat(refundAmount),
        reason
      };
      await orderService.processRefund(refundData);
      toast.success('Refund processed successfully');
      onRefundComplete();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Process Refund</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Details
            </label>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm">
                <span className="text-gray-600">Order ID:</span> #{order._id.slice(-6)}
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Customer:</span>{' '}
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Total Amount:</span>{' '}
                ₹{order.totalPrice}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Amount (₹)
            </label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
              min="0"
              max={order.totalPrice}
              step="0.01"
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum refund amount: ₹{order.totalPrice}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Refund
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows="3"
              required
              placeholder="Please provide a reason for the refund..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Process Refund'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Refund;
