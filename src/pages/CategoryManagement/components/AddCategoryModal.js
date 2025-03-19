import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../config/api";
import axios from "axios";

const AddCategoryModal = ({ onClose, onAdd, initialData, isEditing }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [categoryFallsOn, setCategoryFallsOn] = useState("");
  const [description, setdescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData && isEditing) {
      setCategoryName(initialData.categoryName || "");
      setCategoryType(initialData.categoryType || "");
      setCategoryFallsOn(initialData.categoryFallsOn || "");
      setdescription(initialData.categoryDescription || "");

      if (initialData.categoryImage) {
        setPreviewImage(initialData.categoryImage);
      }

      if (initialData.subCategories) {
        setSubcategories(initialData.subCategories);
      }
    }
  }, [initialData, isEditing]);

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

  const addSubcategory = () => {
    if (!subcategoryName.trim()) return;
    setSubcategories([...subcategories, subcategoryName.trim()]);
    setSubcategoryName("");
  };

  const removeSubcategory = (index) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories.splice(index, 1);
    setSubcategories(updatedSubcategories);
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (!isEditing && !selectedImage && !previewImage) {
      alert("Please select an image");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let imageUploadResponse = null;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        imageUploadResponse = await axios({
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
      }

      const endpoint = isEditing
        ? `${API_BASE_URL}/categories/editcategory/${initialData._id}`
        : `${API_BASE_URL}/categories/addcategory`;

      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName,
          categoryType: categoryType,
          categoryFallsOn: categoryFallsOn,
          categoryDescription: description,
          categoryImage: selectedImage
            ? imageUploadResponse.data.filePath
            : initialData.categoryImage,
          subCategories: subcategories,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save category");
      }

      const result = await response.json();
      onAdd(result);
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred while saving the category");
      console.error("Error saving category:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Image Upload Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                  <div className="w-16 h-16 flex justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
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
          </div>

          {/* Form Fields */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="" className="block mb-2 font-medium">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />

            <label className="block mb-2 font-medium">Category Type</label>
            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            >
              <option value="" disabled>
                Select Category Type
              </option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Youth">Youth</option>
              <option value="Kids">Kids</option>
              <option value="Babies">Babies</option>
              <option value="Sale">Sale</option>
            </select>

            <label className="block mb-2 font-medium">Category Falls On</label>
            <select
              value={categoryFallsOn}
              onChange={(e) => setCategoryFallsOn(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            >
              <option value="" disabled>
                Select Category Falls On
              </option>
              <option value="Main">Main Model</option>
              <option value="Sub Model">Sub Model</option>
            </select>

            <label htmlFor="" className="block mb-2 font-medium">
              Description
            </label>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
          </div>
        </div>

        {/* Subcategory Section */}
        <div className="mt-6">
          <label className="block mb-2 font-medium">Subcategories</label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Subcategory Name"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
              onKeyPress={(e) => e.key === "Enter" && addSubcategory()}
            />
            <button
              onClick={addSubcategory}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add
            </button>
          </div>

          {/* Subcategory List */}
          {subcategories.length > 0 && (
            <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
              {subcategories.map((subcat, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-1 px-2 hover:bg-gray-100 rounded"
                >
                  <span>{subcat}</span>
                  <button
                    onClick={() => removeSubcategory(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 ${
              isLoading
                ? "bg-purple-400"
                : "bg-purple-600 hover:bg-purple-700"
            } text-white rounded-md flex items-center justify-center`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditing ? "Saving..." : "Adding..."}
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;