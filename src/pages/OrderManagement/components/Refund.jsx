import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import { editOrderRefund } from "../../../firebase/Orders";

const RefundModal = ({ onRequestClose, id, totalAmt,  }) => {
  const [refundAmount, setRefundAmount] = useState("");

  const handleRefund = async() => {
    console.log("Refund amount:", refundAmount,totalAmt/100);
    if (refundAmount < 0 || refundAmount >= (Number(totalAmt)/100)) {
      console.log("Refund amount is valid");
      toast.warning("Refund amount is valid");
      return
    }
    const res = await editOrderRefund(id, refundAmount);
    if (res) {
        toast.success("Refund amount updated successfully");
      setTimeout(() => {
          onRequestClose();
      },1000)
      return
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Enter Your Refund Amount</h2>
          <button
            onClick={onRequestClose}
            className="text-gray-500 hover:text-black focus:outline-none"
          >
            ✕
          </button>
        </div>

        <input
          type="number"
          value={refundAmount}
          onChange={(e) => setRefundAmount(e.target.value)}
          placeholder="Enter refund amount"
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />

        <div className="flex gap-10">
            <button
            onClick={handleRefund}
            className="bg-blue-500 text-white p-2 rounded-md w-full"
            >
            Refund
            </button>

            <button
                onClick={onRequestClose}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
