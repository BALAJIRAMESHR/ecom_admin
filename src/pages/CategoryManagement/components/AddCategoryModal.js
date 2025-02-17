import React, { useState } from "react";
import axios from "axios";

const AddCategoryModal = ({ onClose, onAdd }) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categoryType, setCategoryType] = useState("Saree");

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
      } else {
        alert("Please select an image file");
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
      } else {
        alert("Please drop an image file");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (!selectedImage) {
      alert("Please select an image");
      return;
    }

    try {
      // First upload the image
      const formData = new FormData();
      formData.append("file", selectedImage);

      const imageUploadResponse = await axios({
        method: "post",
        url: "/upload",
        data: formData,
        headers: {
          Authorization: "QuindlTokPATFileUpload2025#$$TerOiu$",
          "Content-Type": "multipart/form-data",
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      if (!imageUploadResponse.data || !imageUploadResponse.data.filePath) {
        throw new Error("Invalid response from image upload");
      }

      const imageUrl = imageUploadResponse.data.filePath;
      console.log('Image uploaded successfully:', imageUrl);

      // Then create the category with the image URL
      await onAdd(categoryName, imageUrl, categoryType);
      onClose();
    } catch (error) {
      console.error("Error submitting category:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        alert(
          `Failed to add category: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        alert("Failed to connect to the server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        alert("Failed to process request. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Category</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Image Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg mb-4 p-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Selected category"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setPreviewImage(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-gray-400">
              <p>Drop your image here or</p>
              <label className="text-purple-600 cursor-pointer hover:text-purple-700">
                Browse
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </label>
            </div>
          )}
        </div>

        {/* Category Name Input */}
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4"
        />

        {/* Category Type Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Type
          </label>
          <select
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Saree">Saree</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!categoryName.trim() || !selectedImage}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
