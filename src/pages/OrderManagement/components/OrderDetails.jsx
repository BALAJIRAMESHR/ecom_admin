import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Package,
  Truck,
  IndianRupee,
  Building2,
  User,
  Map,
  ArrowLeft,
  Printer,
  Pencil,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import orderService from "../../../services/orderService";
import { toast } from "react-toastify";
import placeholderImage from "../../../assets/images/placeholder-image.jpg";

// Mock RefundModal component
const RefundModal = ({ onRequestClose, id, totalAmt, onRefund }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2>Process Refund</h2>
        <p>Total Amount: ₹{totalAmt / 100}</p>
        <button
          onClick={() => {
            onRefund(totalAmt);
            onRequestClose();
          }}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Process Refund
        </button>
      </div>
    </div>
  );
};

const OrderDetails = ({ orderDetails, onBack }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(orderDetails);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    phoneNumber: "",
  });

  const [amountDetails, setAmountDetails] = useState({
    totalAmount: 0,
    taxPrice: 0,
    shippingPrice: 0,
    itemsPrice: 0,
  });

  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [shippingStatus, setShippingStatus] = useState("");
  const [orderedItems, setOrderedItems] = useState([]);

  const handleBack = () => {
    onBack();
  };

  const handleStatusChange = async (event) => {
    setLoading(true);
    try {
      await orderService.updateOrderStatus(
        orderData._id,
        event.target.value === "Delivered"
      );
      setShippingStatus(event.target.value);
      setOrderData((prev) => ({
        ...prev,
        isDelivered: event.target.value === "Delivered",
      }));
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update status");
      setShippingStatus(orderData.isDelivered ? "Delivered" : "Processing");
    }
    setLoading(false);
  };

  const handleRefund = async (amount) => {
    setLoading(true);
    try {
      await orderService.processRefund(orderData._id, amount);
      toast.success("Refund processed successfully");
      // Refresh order details
      const updatedOrder = await orderService.getOrderById(orderData._id);
      setOrderData(updatedOrder);
    } catch (error) {
      toast.error(error.message || "Failed to process refund");
    }
    setLoading(false);
    setOpenRefundModal(false);
  };

  useEffect(() => {
    if (orderDetails) {
      // Update shipping address from order details
      const { shippingAddress } = orderDetails;
      setShippingAddress(shippingAddress);

      // Update amount details from order details
      setAmountDetails({
        totalAmount: orderDetails.totalPrice || 0,
        taxPrice: orderDetails.taxPrice || 0,
        shippingPrice: orderDetails.shippingPrice || 0,
        itemsPrice: orderDetails.itemsPrice || 0,
      });

      // Update shipping status
      setShippingStatus(orderDetails.isDelivered ? "Delivered" : "Processing");

      // Update ordered items
      setOrderedItems(orderDetails.orderItems || []);
    }
  }, [orderDetails]);

  const formatPrice = (price) => {
    if (!price) return "0.00";
    return Number(price).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.onerror = null;
  };

  if (!orderDetails) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          ORDER #{orderDetails._id.slice(-6)}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2.5 text-purple-600 bg-white border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Back
          </button>
          <button className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Send Bill
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {/* Customer Details Card */}
        <div className="bg-white rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white mb-4">
                {shippingAddress.firstName?.charAt()}
                {shippingAddress.lastName?.charAt(0)}
              </div>
              <h3 className="text-purple-600 font-medium text-lg">
                Customer Details
              </h3>
            </div>
          </div>
          <div className="space-y-6 text-center">
            <div>
              <p className="font-medium text-gray-900 text-lg mb-1">
                {orderDetails.user.username}
              </p>
              <p className="text-gray-500">{orderDetails.user.email}</p>
            </div>
            <div>
              <h4 className="text-purple-600 font-medium mb-2">
                Delivery Address
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {orderDetails.shippingAddress.addressLine1 && (
                  <>
                    <br />
                    {orderDetails.shippingAddress.addressLine2}
                  </>
                )}
                {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} - ${orderDetails.shippingAddress.pincode}`}
                <br />
                India
                <br />
                {orderDetails.shippingAddress.phoneNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Amount Details Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-purple-600 font-medium text-lg mb-6 text-center">
            Amount Details
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Payment Method</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {orderDetails.paymentMethod}
                </span>
                <span>💳</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Items Total</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  ₹{formatPrice(amountDetails.itemsPrice)}
                </span>
                <span>💰</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Tax</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  ₹{formatPrice(amountDetails.taxPrice)}
                </span>
                <span>💵</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600">Shipping</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  ₹{formatPrice(amountDetails.shippingPrice)}
                </span>
                <span>🚚</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-1 border-t">
              <span className="text-gray-900 font-medium">Grand Total</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  ₹{formatPrice(amountDetails.totalAmount)}
                </span>
                <span>💸</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-purple-600 font-medium text-lg mb-6 text-center">
            Order Status
          </h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Ordered Location</p>
                  <p className="text-gray-900 font-medium">
                    {shippingAddress.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Order Date</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(orderDetails.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Payment Status
                </h4>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    orderDetails.isPaid
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {orderDetails.isPaid ? "PAID" : "PENDING"}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Fulfillment Status
                </h4>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    orderDetails.isDelivered
                      ? "bg-green-50 text-green-600"
                      : "bg-purple-50 text-purple-600"
                  }`}
                >
                  {orderDetails.isDelivered ? "DELIVERED" : "PROCESSING"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Ordered Products Table */}
        <div className="col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-purple-600 font-medium">Ordered Products</h3>
            <span className="text-sm text-gray-500">
              Number of ordered products: {orderedItems.length}
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3 font-medium">Image</th>
                <th className="py-3 font-medium">Product Details</th>
                <th className="py-3 font-medium">Quantity</th>
                <th className="py-3 font-medium">Amount</th>
                <th className="py-3 font-medium">Total</th>
                <th className="py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orderedItems.map((item) => (
                <tr key={item._id} className="text-gray-700">
                  <td className="py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={handleImageError}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-4">{item.name}</td>
                  <td className="py-4">{item.qty}</td>
                  <td className="py-4">₹{formatPrice(item.price)}</td>
                  <td className="py-4">₹{formatPrice(item.price * item.qty)}</td>
                  <td className="py-4">
                    {orderDetails.isPaid ? (
                      <button
                        onClick={() => setOpenRefundModal(true)}
                        className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
                      >
                        Refund
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                      >
                        Payment Pending
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Invoice */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-purple-600 font-medium">Order Invoice</h3>
              <button className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <Printer size={16} />
                Print
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Subtotal</span>
                <span>₹{formatPrice(orderDetails.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Charges</span>
                <span>₹{formatPrice(orderDetails.shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹{formatPrice(orderDetails.taxPrice)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Order Amount</span>
                <span>₹{formatPrice(orderDetails.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span
                  className={
                    orderDetails.isPaid ? "text-green-600" : "text-red-600"
                  }
                >
                  {orderDetails.isPaid
                    ? `Paid on ${new Date(
                        orderDetails.paidAt
                      ).toLocaleDateString()}`
                    : "Pending"}
                </span>
              </div>
              {orderDetails.isPaid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span>{orderDetails.paymentMethod}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {openRefundModal && (
        <RefundModal
          id={orderDetails._id}
          totalAmt={orderDetails.totalPrice}
          onRequestClose={() => setOpenRefundModal(false)}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
};

export default OrderDetails;
