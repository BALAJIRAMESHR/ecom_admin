import React, { useState, useEffect } from "react";

const AddCategoryModal = ({ onClose, onAdd, initialData, isEditing }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData && isEditing) {
      setCategoryName(initialData.categoryName || "");
      setCategoryType(initialData.categoryType || "");
      
      if (initialData.categoryImage) {
        setPreviewImage(initialData.categoryImage);
      }
      
      if (initialData.subcategories) {
        setSubcategories(initialData.subcategories);
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

  const handleSubmit = () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (!isEditing && !selectedImage && !previewImage) {
      alert("Please select an image");
      return;
    }

    // Use the selected image or the existing one if editing
    const imageToUse = selectedImage || (isEditing ? previewImage : null);

    onAdd(categoryName, imageToUse, categoryType, subcategories);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
              <div className="w-16 h-16 flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
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

        {/* Description Input */}
        <input
          type="text"
          placeholder="Description"
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4"
        />

        {/* Category Name Input */}
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4"
        />

        {/* Subcategory Section */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Subcategory Name"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-2"
          />
          
          <button
            onClick={addSubcategory}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 w-full mb-2"
          >
            Add Subcategory
          </button>
          
          {/* Subcategory List */}
          {subcategories.length > 0 && (
            <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
              {subcategories.map((subcat, index) => (
                <div key={index} className="flex justify-between items-center py-1 px-2 hover:bg-gray-100 rounded">
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            {isEditing ? "Save Changes" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;