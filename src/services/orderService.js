import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const orderService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/${orderId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order details' };
    }
  },

  // Update order delivery status
  updateOrderStatus: async (orderId, isDelivered) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/orders/${orderId}/deliver`,
        { isDelivered },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  },

  // Update shipping status
  updateShippingStatus: async (orderId, shippingStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/orders/${orderId}/shipping-status`,
        { shippingStatus },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update shipping status' };
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/orders/${orderId}/pay`,
        {},
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update payment status' };
    }
  },

  // Delete order
  deleteOrder: async (orderId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/orders/${orderId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete order' };
    }
  },

  // Process refund
  processRefund: async (refundData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/${refundData.orderId}/refund`,
        refundData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to process refund' };
    }
  }
};

export default orderService; 