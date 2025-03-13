import axios from "axios";
import { API_BASE_URL } from "../config/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const dashboardService = {
  // Get dashboard statistics by combining data from multiple endpoints
  getDashboardStats: async () => {
    try {
      const [orders, products] = await Promise.all([
        axios.get(`${API_BASE_URL}/orders`, getAuthHeader()),
        axios.get(`${API_BASE_URL}/products/getallproducts`)
      ]);

      // Get unique customers from orders
      const uniqueCustomers = new Set(orders.data.map(order => order.user));
      const totalRevenue = orders.data.reduce((sum, order) => sum + order.totalPrice, 0);

      return {
        customers: uniqueCustomers.size,
        products: products.data.length,
        orders: orders.data.length,
        revenue: totalRevenue,
        customerGrowth: calculateCustomerGrowth(orders.data)
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        customers: 0,
        products: 0,
        orders: 0,
        revenue: 0,
        customerGrowth: 0
      };
    }
  },

  // Get recent orders using the existing orders endpoint
  getRecentOrders: async (limit = 5) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, getAuthHeader());
      return response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)
        .map(order => ({
          _id: order._id,
          customerId: order.user,
          itemName: order.orderItems[0]?.name || 'Unknown Product',
          createdAt: order.createdAt,
          totalPrice: order.totalPrice
        }));
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch recent orders" };
    }
  },

  // Get sales analytics from orders data
  getSalesAnalytics: async (period = 'week') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, getAuthHeader());
      const orders = response.data;

      // Group orders by date and calculate daily totals
      const dailySales = orders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + order.totalPrice;
        return acc;
      }, {});

      return Object.entries(dailySales).map(([date, value]) => ({
        date,
        value
      }));
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch sales analytics" };
    }
  },

  // Get top products based on order frequency
  getTopProducts: async (limit = 1) => {
    try {
      const [orders, products] = await Promise.all([
        axios.get(`${API_BASE_URL}/orders`, getAuthHeader()),
        axios.get(`${API_BASE_URL}/products/getallproducts`)
      ]);

      // Count product occurrences in orders
      const productSales = {};
      orders.data.forEach(order => {
        order.orderItems.forEach(item => {
          if (!productSales[item.product]) {
            productSales[item.product] = {
              unitsSold: 0,
              revenue: 0
            };
          }
          productSales[item.product].unitsSold += item.quantity;
          productSales[item.product].revenue += item.price * item.quantity;
        });
      });

      // Match with product details and sort by units sold
      const topProducts = products.data
        .map(product => ({
          _id: product._id,
          name: product.productName,
          images: product.images || [],
          unitsSold: productSales[product._id]?.unitsSold || 0,
          revenue: productSales[product._id]?.revenue || 0
        }))
        .sort((a, b) => b.unitsSold - a.unitsSold)
        .slice(0, limit);

      return topProducts;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch top products" };
    }
  },

  // Get inventory alerts from products with low stock
  getInventoryAlerts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/getallproducts`);
      const lowStockThreshold = 10; // Define what constitutes "low stock"

      return response.data
        .filter(product => product.stock <= lowStockThreshold)
        .map(product => ({
          _id: product._id,
          name: product.productName,
          currentStock: product.stock,
          maxStock: 100, // This could be a product-specific value in your schema
          threshold: lowStockThreshold
        }));
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch inventory alerts" };
    }
  }
};

// Helper function to calculate customer growth
const calculateCustomerGrowth = (orders) => {
  if (!orders.length) return 0;

  const now = new Date();
  const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

  const uniqueCustomersThisMonth = new Set(
    orders
      .filter(order => new Date(order.createdAt) > lastMonth)
      .map(order => order.user)
  ).size;

  const uniqueCustomersLastMonth = new Set(
    orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate <= lastMonth && orderDate > new Date(now.setMonth(now.getMonth() - 1));
      })
      .map(order => order.user)
  ).size;

  if (uniqueCustomersLastMonth === 0) return 100;
  return Math.round(((uniqueCustomersThisMonth - uniqueCustomersLastMonth) / uniqueCustomersLastMonth) * 100);
};

export default dashboardService; 