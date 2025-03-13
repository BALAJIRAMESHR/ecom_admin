import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import axios from "axios";

const EditModal = ({ product, onClose, onSave }) => {
  // State Management
  const [formData, setFormData] = useState({
    _id: product._id,
    productName: product.productName || "",
    productCode: product.productCode || "",
    categoryId: product.categoryId?._id || "",
    categoryName: product.categoryName || "",
    variantName: product.variantName || "",
    description: product.description || "",
    actualPrice: product.actualPrice || "",
    sellingPrice: product.sellingPrice || "",
    tax: product.tax || "",
    couponCode: product.couponCode || "",
    couponMethod: product.couponMethod || "",
    color: product.color || "",
    images: product.images || [],
    tags: product.tags || [],
    stock: product.stock || "",
    availability: product.availability ?? true,
    sareeSize: product.sareeSize || 5.5,
    blouseSize: product.blouseSize || 0.8,
    materialAndCare: product.materialAndCare || "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImages, setPreviewImages] = useState(product.images || []);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isPriceSame, setIsPriceSame] = useState(
    product.actualPrice === product.sellingPrice
  );

  // Fetch Data
  useEffect(() => {
    fetchCategories();
    fetchVariants();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/allcategory`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchVariants = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/variants/getallvariants`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVariants(data);
    } catch (error) {
      console.error("Failed to fetch variants:", error);
    }
  };

  // Image Handling
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && previewImages.length < 6) {
      files.slice(0, 6 - previewImages.length).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const imageUrl = URL.createObjectURL(file);
          setPreviewImages(prev => [...prev, imageUrl]);
          setSelectedImage(file);
        } else {
          alert("Please select an image file");
        }
      });
    }
  };

  const handleRemoveImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && previewImages.length < 6) {
      files.slice(0, 6 - previewImages.length).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const imageUrl = URL.createObjectURL(file);
          setPreviewImages(prev => [...prev, imageUrl]);
          setSelectedImage(file);
        } else {
          alert("Please drop an image file");
        }
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/upload', formData, {
        headers: {
          'Authorization': 'QuindlTokPATFileUpload2025#$$TerOiu$',
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data || !response.data.filePath) {
        throw new Error('Invalid response from image upload');
      }

      return response.data.filePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Form Handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrls = [...formData.images];

      // Upload new image if selected
      if (selectedImage) {
        const newImageUrl = await uploadImage(selectedImage);
        imageUrls = [...imageUrls, newImageUrl];
      }

      // Prepare the updated product data
      const updatedProduct = {
        ...formData,
        images: imageUrls,
        categoryId: formData.categoryId,
        categoryName: categories.find(cat => cat._id === formData.categoryId)?.categoryName || formData.categoryName,
        variantName: formData.variantName,
        variantId: variants.find(variant => variant.variantName === formData.variantName)?._id || "",
        actualPrice: Number(formData.actualPrice),
        sellingPrice: Number(formData.sellingPrice),
        tax: Number(formData.tax),
        stock: Number(formData.stock),
        availability: Boolean(formData.availability),
        sareeSize: Number(formData.sareeSize),
        blouseSize: Number(formData.blouseSize)
      };

      // Make the API call to update the product
      const response = await fetch(`${API_BASE_URL}/products/editproduct/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      const result = await response.json();
      
      // Call the onSave callback with the updated product
      await onSave(result);
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.message || "Failed to update product");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'actualPrice' && isPriceSame) {
      setFormData(prev => ({
        ...prev,
        sellingPrice: value
      }));
    }
  };

  // Render Component
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-6xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images ({previewImages.length}/6)
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="grid grid-cols-3 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}

                  {previewImages.length < 6 && (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload Image</p>
                      <p className="text-xs text-gray-400">
                        Drop your image here or click to browse
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Variant
                    </label>
                    <select
                      name="variantName"
                      value={formData.variantName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Variant</option>
                      {variants.map((variant) => (
                        <option key={variant._id} value={variant.variantName}>
                          {variant.variantName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost Price
                    </label>
                    <input
                      type="number"
                      name="actualPrice"
                      value={formData.actualPrice}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selling Price
                    </label>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      disabled={isPriceSame}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isPriceSame}
                      onChange={(e) => {
                        setIsPriceSame(e.target.checked);
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            sellingPrice: prev.actualPrice
                          }));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <label className="text-sm text-gray-600">
                      Same as Cost Price
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Stock & Availability */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Stock & Availability</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value={true}>In Stock</option>
                      <option value={false}>Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax (%)
                    </label>
                    <input
                      type="number"
                      name="tax"
                      value={formData.tax}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
