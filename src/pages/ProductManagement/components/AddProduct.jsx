import React, { useState, useEffect } from "react";
import { Upload, X, GripVertical } from "lucide-react";
import { productService } from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import { API_BASE_URL } from "../../../config/api";
import { variantService } from "../../../services/variantService";
import VariantPopup from "./VariantPopup";
import PropTypes from "prop-types";
import axios from "axios";

const AddProduct = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    categoryId: "",
    categoryName: "",
    variantName: "",
    description: "",
    actualPrice: "",
    sellingPrice: "",
    tax: "",
    couponCode: "",
    couponMethod: "",
    color: "",
    images: [],
    tags: [],
    stock: "",
    availability: true,
    sareeSize: 5.5,
    blouseSize: 0.8,
    materialAndCare: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [isPriceSame, setIsPriceSame] = useState(false);
  const [materialCare, setMaterialCare] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Add new state for categories
  const [categories, setCategories] = useState([]);

  // Add new state for variants and popup
  const [variants, setVariants] = useState([]);
  const [showVariantPopup, setShowVariantPopup] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Optionally show an error message to the user
    }
  };

  // Add useEffect to fetch variants
  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      const data = await variantService.getAllVariants();
      setVariants(data);
    } catch (error) {
      console.error("Failed to fetch variants:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "category") {
        // When category changes, update both categoryId and categoryName
        const selectedCategory = categories.find((cat) => cat._id === value);
        return {
          ...prev,
          categoryId: value,
          categoryName: selectedCategory ? selectedCategory.categoryName : "",
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });

    if (isPriceSame && name === "actualPrice") {
      setFormData((prev) => ({
        ...prev,
        sellingPrice: value,
      }));
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && formData.images.length < 6) {
      files.slice(0, 6 - formData.images.length).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, reader.result].slice(0, 6),
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    e.target.classList.add("opacity-50");
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("opacity-50");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.target.closest(".image-container")?.classList.add("border-purple-500");
  };

  const handleDragLeave = (e) => {
    e.target.closest(".image-container")?.classList.remove("border-purple-500");
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && formData.images.length < 6) {
      handleImageSelect({ target: { files } });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    if (formData.images.length === 1) {
      setSelectedImage(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (dragIndex === dropIndex) return;

    setFormData((prev) => {
      const newImages = [...prev.images];
      const draggedImage = newImages[dragIndex];
      newImages.splice(dragIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);
      return {
        ...prev,
        images: newImages,
      };
    });

    e.target.closest(".image-container")?.classList.remove("border-purple-500");
  };

  const handleAddTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddMaterialCare = (care) => {
    if (!materialCare.includes(care)) {
      const updatedMaterialCare = [...materialCare, care];
      setMaterialCare(updatedMaterialCare);
      setFormData((prev) => ({
        ...prev,
        materialAndCare: updatedMaterialCare.join(", "),
      }));
    }
  };

  const handleRemoveMaterialCare = (careToRemove) => {
    const updatedMaterialCare = materialCare.filter(
      (care) => care !== careToRemove
    );
    setMaterialCare(updatedMaterialCare);
    setFormData((prev) => ({
      ...prev,
      materialAndCare: updatedMaterialCare.join(", "),
    }));
  };

  const handleAddVariant = async (variantData) => {
    try {
      const newVariant = await variantService.addVariant(variantData);
      setVariants([...variants, newVariant]);
    } catch (error) {
      console.error("Failed to add variant:", error);
      throw error;
    }
  };

  const base64ToFile = (base64String, fileName) => {
    const byteString = atob(base64String.split(',')[1]);
    const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], fileName, { type: mimeString });
  };
  
  const uploadImage = async (base64String, fileName) => {
    const file = base64ToFile(base64String, fileName);
  
    const data = new FormData();
    data.append('file', file);
  
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/upload', 
      headers: {
        'Authorization': 'QuindlTokPATFileUpload2025#$$TerOiu$',
        'Content-Type': 'multipart/form-data'
      },
      data: data
    };
  
    try {
      const response = await axios.request(config);
      console.log(response.data);
      return response.data.filePath;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  const uploadImagesAndGetUrls = async (images) => {
    const urls = [];
    for (const image of images) {
      const fileName = `image-${Date.now()}.png`;
      const url = await uploadImage(image, fileName);
      if (url) {
        urls.push(url);
      }
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { images, ...productDataToSubmit } = formData;

      const imageUrls = await uploadImagesAndGetUrls(images);
      console.log(imageUrls);

      // Convert any empty strings to appropriate types
      const dataToSubmit = {
        ...productDataToSubmit,
        tax: productDataToSubmit.tax ? Number(productDataToSubmit.tax) : 0,
        stock: productDataToSubmit.stock ? Number(productDataToSubmit.stock) : 0,
        actualPrice: productDataToSubmit.actualPrice ? Number(productDataToSubmit.actualPrice) : 0,
        sellingPrice: productDataToSubmit.sellingPrice ? Number(productDataToSubmit.sellingPrice) : 0,
        sareeSize: productDataToSubmit.sareeSize ? Number(productDataToSubmit.sareeSize) : 5.5,
        blouseSize: productDataToSubmit.blouseSize ? Number(productDataToSubmit.blouseSize) : 0.8,
        availability: Boolean(productDataToSubmit.availability),
        materialAndCare: Array.isArray(productDataToSubmit.materialAndCare)
          ? productDataToSubmit.materialAndCare.join(", ")
          : "",
        tags: Array.isArray(productDataToSubmit.tags) ? productDataToSubmit.tags : [],
        images: imageUrls
      };

      console.log("Submitting product data:", dataToSubmit);

      const response = await productService.addProduct(dataToSubmit);
      console.log("Server response:", response);
      
      if (typeof onSubmit === 'function') {
        onSubmit(response);
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      alert(error.message || "Failed to add product. Please try again.");
    }
  };

  const handleCancel = () => {
    // Call the onCancel prop function to return to product management page
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Add Product</h1>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Product Code
              </label>
              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
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
              <label className="block text-sm font-medium mb-1">Variant</label>
              <div className="flex gap-2">
                <select
                  name="variantName"
                  value={formData.variantName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Variant</option>
                  {variants.map((variant) => (
                    <option key={variant._id} value={variant.variantName}>
                      {variant.variantName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowVariantPopup(true)}
                  className="px-3 py-2 border rounded-md hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Availability
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Saree Size (meters)
              </label>
              <input
                type="number"
                step="0.1"
                name="sareeSize"
                value={formData.sareeSize}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Blouse Size (meters)
              </label>
              <input
                type="number"
                step="0.01"
                name="blouseSize"
                value={formData.blouseSize}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Actual Price
              </label>
              <input
                type="number"
                name="actualPrice"
                value={formData.actualPrice}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Selling Price
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                disabled={isPriceSame}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPriceSame}
                onChange={(e) => {
                  setIsPriceSame(e.target.checked);
                  if (e.target.checked) {
                    setFormData((prev) => ({
                      ...prev,
                      sellingPrice: prev.actualPrice,
                    }));
                  }
                }}
                className="rounded"
              />
              <label className="text-sm">
                Actual Price same as Selling Price
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-lg p-6"
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-purple-50 bg-opacity-90 flex items-center justify-center rounded-lg z-10">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-purple-600 stroke-1" />
                    <p className="text-purple-600 font-medium">
                      Drop your images here
                    </p>
                    <p className="text-sm text-purple-500">Release to upload</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-6">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="image-container relative bg-gray-50 p-2 rounded-lg group transition-all hover:shadow-md border-2 border-transparent"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <div className="absolute top-1 left-1 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                      <GripVertical className="w-4 h-4 text-gray-600" />
                    </div>
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-40 object-contain rounded-lg"
                      draggable={false}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-gray-50 transition-all"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
                {formData.images.length < 6 && (
                  <label
                    className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-2 cursor-pointer hover:bg-gray-100 transition-all hover:shadow-md ${
                      formData.images.length === 0 ? "col-span-3 h-40" : "h-50"
                    }`}
                  >
                    <div className="text-center">
                      <Upload
                        className={`mx-auto mb-2 stroke-1 ${
                          formData.images.length === 0
                            ? "w-10 h-10 text-gray-400"
                            : "w-10 h-10 text-gray-400"
                        }`}
                      />
                      <p
                        className={`font-medium text-gray-600 ${
                          formData.images.length === 0 ? "text-sm" : "text-sm"
                        }`}
                      >
                        Upload Product Images
                      </p>
                      <p className="text-xs text-gray-500">
                        Drag & drop or click to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ({6 - formData.images.length} of 6 remaining) • PNG, JPG
                        • 800x1200px
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tax (in percentage)
              </label>
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Coupon / Code
              </label>
              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleInputChange}
                placeholder="Use Code PARTY 56689"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Coupons Method
              </label>
              <select
                name="couponMethod"
                value={formData.couponMethod}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-select-</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Type Color Code"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 rounded-md text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add tags"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Material & Care
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {materialCare.map((care, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 rounded-md text-sm flex items-center gap-1"
                  >
                    {care}
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterialCare(care)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add material & care instructions"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMaterialCare(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Add Product
          </button>
        </div>
      </form>

      {showVariantPopup && (
        <VariantPopup
          onClose={() => setShowVariantPopup(false)}
          onAdd={handleAddVariant}
        />
      )}
    </div>
  );
};

AddProduct.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default AddProduct;
