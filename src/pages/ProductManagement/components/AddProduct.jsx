import React, { useState, useRef, useEffect } from "react";
import { Image, X, Upload, Plus, Camera } from "lucide-react";
// Import API config
import { API_BASE_URL } from "../../../config/api";
import axios, { all } from "axios";

// Modal Component for adding new variants and customization types
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Image Upload Modal Component
const ImageUploadModal = ({ isOpen, onClose, onUpload, title }) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      console.log("Selected files:", filesArray);
      onUpload(filesArray);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{title || "Upload Image"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={handleFileSelect}
            >
              <Camera className="w-16 h-16 text-gray-400" />
              <p className="mt-4 text-center text-gray-500">
                Click to select an image from your device
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFileSelect}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Choose File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomizationTypeModal = ({ isOpen, onClose, onAdd }) => {
  const [typeName, setTypeName] = useState("");
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  // Image 1 state
  const [image1, setImage1] = useState(null);
  const fileInput1Ref = useRef(null);

  // Image 2 state
  const [image2, setImage2] = useState(null);
  const fileInput2Ref = useRef(null);

  // Options management
  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleKeyDownOption = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    }
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  // Image 1 management
  const handleFileSelect1 = () => {
    fileInput1Ref.current?.click();
  };

  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage1({ file, url: imageUrl });
    }
  };

  const handleRemoveImage1 = () => {
    setImage1(null);
  };

  // Image 2 management
  const handleFileSelect2 = () => {
    fileInput2Ref.current?.click();
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage2({ file, url: imageUrl });
    }
  };

  const handleRemoveImage2 = () => {
    setImage2(null);
  };

  // Image upload function
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          Authorization: "QuindlTokPATFileUpload2025#$$TerOiu$",
          "Content-Type": "multipart/form-data",
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      return response.data.filePath;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Form submission
  const handleSubmit = async () => {
    if (typeName.trim()) {
      const images = [];

      if (image1) {
        const imageUrl = await uploadImage(image1.file);
        images.push(imageUrl);
      }

      if (image2) {
        const imageUrl = await uploadImage(image2.file);
        images.push(imageUrl);
      }

      onAdd({
        id: Date.now(),
        name: typeName,
        options: options,
        images: images,
      });

      // Reset form
      setTypeName("");
      setOptions([]);
      setNewOption("");
      setImage1(null);
      setImage2(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">Add New Customization Type</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Type Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Type Name
            </label>
            <input
              type="text"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              placeholder="Enter type name (e.g. Sleeve, Neckline)"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Others</label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={handleKeyDownOption}
                placeholder="Add option (e.g. V-neck, Round neck)"
                className="flex-1 p-2 border rounded-md"
              />
              <button
                onClick={handleAddOption}
                className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Options Display */}
            {options.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {options.map((option, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm text-gray-700 mr-1">{option}</span>
                    <button
                      onClick={() => handleRemoveOption(idx)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Images</h3>

            {/* Image 1 */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Image 1</h4>

              {/* Image 1 Upload */}
              {!image1 ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={handleFileSelect1}
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="mt-2 text-center text-gray-500 text-sm">
                    Click to upload image
                  </p>
                  <input
                    type="file"
                    ref={fileInput1Ref}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange1}
                  />
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={image1.url}
                    alt="Image 1"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage1}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Image 2 */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Image 2</h4>

              {/* Image 2 Upload */}
              {!image2 ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={handleFileSelect2}
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="mt-2 text-center text-gray-500 text-sm">
                    Click to upload image
                  </p>
                  <input
                    type="file"
                    ref={fileInput2Ref}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange2}
                  />
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={image2.url}
                    alt="Image 2"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage2}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              disabled={!typeName.trim()}
            >
              Add Customization Type
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductForm = () => {
  // Toggle state for customization
  const [showCustomization, setShowCustomization] = useState(false);

  // Modal states
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showCustomTypeModal, setShowCustomTypeModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [activeCustomTypeId, setActiveCustomTypeId] = useState(null);

  // Product data
  const [tags, setTags] = useState([]);
  const [mainImages, setMainImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState("");
  const [newTag, setNewTag] = useState("");

  // Category data
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  // Customization states
  const measurements = [
    "Shoulder",
    "Chest",
    "Bust",
    "Under Bust",
    "Waist",
    "Hip",
    "Under Arm",
  ];
  const [selectedInches, setSelectedInches] = useState({});
  const [customizationTypes, setCustomizationTypes] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    productName: "",
    productId: "0",
    category: "",
    categoryName: "",
    variant: "",
    variantId: "",
    description: ".",
    actualPrice: "",
    sellingPrice: "",
    isPriceSame: true,
    tax: "",
    couponCode: "",
    color: "",
    displayStock: "",
  });

  // Standard sizes
  const standardSizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "1X",
    "2X",
    "3X",
    "4X",
    "5X",
  ];
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchVariants();
  }, []);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setCategoryError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/categories/allcategory`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch categories. Status: ${response.status}`
        );
      }

      const data = await response.json();

      // Check if data exists and handle different API response structures
      if (data) {
        // Check different possible structures of the API response
        const categoriesData = Array.isArray(data)
          ? data
          : data.data && Array.isArray(data.data)
          ? data.data
          : data.categories && Array.isArray(data.categories)
          ? data.categories
          : null;

        if (categoriesData) {
          setCategories(categoriesData);
          console.log("Categories fetched successfully:", categoriesData);
        } else {
          console.error("Invalid category data format:", data);
          setCategoryError("Invalid data format received from server");
        }
      } else {
        setCategoryError("No data received from server");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryError(error.message || "Failed to load categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchVariants = async () => {
    const getVariants = axios
      .get(`${API_BASE_URL}/variants/getallvariants`)
      .then((response) => {
        console.log(response);
        setVariants(response.data);
      });
  };

  const handleBackClick = () => {
    window.history.back();
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Input changed:", name, value, type, checked);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "isPriceSame" && checked) {
      setFormData((prev) => ({
        ...prev,
        sellingPrice: prev.actualPrice,
      }));
    }
  };

  // Tag removal handler
  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Add tag handler
  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleImageUpload = (files) => {
    const imageFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setMainImages((prev) => [...prev, ...imageFiles]);
    console.log("Main Images:", [...mainImages, ...imageFiles]);
  };

  const removeImage = (index) => {
    const updatedImages = mainImages.filter((_, i) => i !== index);
    setMainImages(updatedImages);
    console.log("Images after removal:", updatedImages);
  };

  // Add variant handler
  const handleAddVariant = () => {
    if (newVariant.trim()) {
      axios
        .post(`${API_BASE_URL}/variants/addvariant`, {
          variantName: newVariant,
        })
        .then((response) => {
          console.log(response);
          const updatedVariants = [...variants, response.data];
          setVariants(updatedVariants);
          setNewVariant("");
          setShowVariantModal(false);
          console.log("Updated variants:", updatedVariants);
        });
    }
  };

  // Add customization type handler
  const handleAddCustomType = (customType) => {
    const updatedTypes = [...customizationTypes, customType];
    setCustomizationTypes(updatedTypes);
    console.log("Added new customization type:", customType);
    console.log("Updated customization types:", updatedTypes);
  };

  // Remove a customization type
  const removeCustomizationType = (typeId) => {
    const updatedTypes = customizationTypes.filter(
      (type) => type.id !== typeId
    );
    setCustomizationTypes(updatedTypes);
    console.log("Removed customization type, remaining types:", updatedTypes);
  };

  // Log all form data
  const handleUpdate = async () => {
    const allData = {
      formData,
      tags,
      variants,
      mainImages,
      selectedSizes,
      customizationEnabled: showCustomization,
      customMeasurements: selectedInches,
      customizationTypes,
    };

    console.log("Complete form data:", allData);
    addProduct(allData);
    alert("Product updated successfully!");
  };

  const addProduct = async (allData) => {
    const selectedMeasurements = {
      shoulder: [],
      chest: [],
      bust: [],
      underBust: [],
      waist: [],
      hip: [],
      underArm: [],
    };

    Object.keys(allData.customMeasurements).forEach((key) => {
      if (allData.customMeasurements[key]) {
        const [measurement, inch] = key.split("-");

        const measurementKey = measurement
          .toLowerCase()
          .replace(/\s+(\w)/g, (_, letter) => letter.toUpperCase());

        if (selectedMeasurements[measurementKey]) {
          selectedMeasurements[measurementKey].push(`${inch}' inch`);
        }
      }
    });

    let imageLinks = [];
    if (mainImages) {
      for (let i = 0; i < mainImages.length; i++) {
        const formData = new FormData();
        formData.append("file", mainImages[i].file);
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
        imageLinks.push(imageUploadResponse.data.filePath);
      }
    }
    console.log("Image Links:", imageLinks);
    const productData = {
      productName: allData.formData.productName,
      productCode: allData.formData.productId,
      categoryId: allData.formData.category,
      categoryName: categories.find(
        (cat) => cat._id === allData.formData.category
      )?.categoryName,
      variantName: allData.formData.variant,
      variantId: variants.find(
        (variant) => variant.variantName === allData.formData.variant
      )?._id,
      description: allData.formData.description,
      standardSize: Object.keys(selectedSizes),
      customization: allData.customizationEnabled,
      stock: allData.formData.displayStock,
      actualPrice: allData.formData.actualPrice,
      sellingPrice: allData.formData.sellingPrice,
      tags: allData.tags,
      tax: allData.formData.tax,
      couponCode: allData.formData.couponCode,
      color: allData.formData.color,
      availability: true,
      images: imageLinks,
      isDesignLab: false,
      customizationData: {
        selectSize: selectedMeasurements,
        customizationType: allData.customizationTypes.map((type) => ({
          typeName: type.name,
          standardImage: type.images[0] || "Image 1",
          customImage: type.images[1] || "Image 2",
          options: type.options,
        })),
      },
    };

    console.log("Product data:", productData);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/products/addproduct`,
        productData
      );
      console.log("Product added successfully:", response.data);
      alert("Product added successfully!");
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data?.message || error.message
      );
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with title and customization toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Product</h1>
          <div className="flex items-center gap-2 mt-5">
            <span>Customization</span>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={showCustomization}
                onChange={(e) => {
                  setShowCustomization(e.target.checked);
                  console.log("Customization toggled:", e.target.checked);
                }}
                className="hidden"
              />
              <div
                className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                  showCustomization ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    showCustomization ? "translate-x-6" : "translate-x-1"
                  } transform mt-0.5`}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Back button */}
        <div className="mb-4">
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Product Info - with scrollable container */}
          <div className="space-y-4 overflow-y-auto pr-4 pb-16">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Product ID
              </label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                placeholder="Enter product ID"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                disabled={isLoadingCategories}
              >
                <option value="">-Select Category-</option>
                {categories.map((category) => (
                  <option
                    key={category._id || category.id}
                    value={category._id || category.id}
                  >
                    {category.name || category.categoryName}
                  </option>
                ))}
              </select>
              {isLoadingCategories && (
                <p className="text-gray-500 text-sm mt-1">
                  Loading categories...
                </p>
              )}
              {categoryError && (
                <p className="text-red-500 text-sm mt-1">{categoryError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Variant
              </label>
              <div className="flex gap-2">
                <select
                  name="variant"
                  value={formData.variant}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">-Select Variant-</option>
                  {variants.map((variant) => (
                    <option key={variant._id} value={variant.variantName}>
                      {variant.variantName}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowVariantModal(true)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Standard Size
              </label>
              <div className="grid grid-cols-5 gap-4">
                {standardSizes.map((size) => (
                  <label key={size} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSizes[size] || false}
                      onChange={(e) => {
                        const updated = {
                          ...selectedSizes,
                          [size]: e.target.checked,
                        };
                        setSelectedSizes(updated);
                        console.log("Selected sizes:", updated);
                      }}
                      className="rounded"
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Size Options - Only shown when customization is enabled */}
            {showCustomization && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Custom Size</h2>
                {measurements.map((measurement) => (
                  <div
                    key={measurement}
                    className="grid grid-cols-5 gap-2 items-center"
                  >
                    <div className="font-medium">{measurement}</div>
                    {[1, 2, 3, 4].map((inch) => (
                      <label
                        key={`${measurement}-${inch}`}
                        className="flex items-center gap-1"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedInches[`${measurement}-${inch}`] || false
                          }
                          onChange={(e) => {
                            const updated = {
                              ...selectedInches,
                              [`${measurement}-${inch}`]: e.target.checked,
                            };
                            setSelectedInches(updated);
                            console.log("Selected inches:", updated);
                          }}
                          className="rounded"
                        />
                        <span>{inch}' inch</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Customization Types - Only shown when customization is enabled */}
            {showCustomization && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Customization Types</h2>
                {customizationTypes.length === 0 && (
                  <p className="text-gray-500">
                    No customization types added yet
                  </p>
                )}
                {customizationTypes.map((type) => (
                  <div key={type.id} className="space-y-2 border-b pb-4">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{type.name}</div>
                      <button
                        onClick={() => removeCustomizationType(type.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {type.options.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Options:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {type.options.map((option, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 rounded-full"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {type.images.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Images:
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {type.images.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img}
                                alt={`${type.name} ${idx + 1}`}
                                className="w-full aspect-square object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setShowCustomTypeModal(true)}
                  className="w-full py-2 border rounded hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Customization Type
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter product description"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Actual Price
              </label>
              <input
                type="text"
                name="actualPrice"
                value={formData.actualPrice}
                onChange={handleInputChange}
                placeholder="Enter actual price"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Selling Price
              </label>
              <input
                type="text"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                placeholder="Enter selling price"
                className="w-full p-2 border rounded-md"
              />
              <div className="mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPriceSame"
                    checked={formData.isPriceSame}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <span>Actual Price same as Selling Price</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Images and Additional Info */}
          <div className="space-y-4 pb-16">
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <div
                  onClick={() => setShowImageUploadModal(true)}
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="w-12 h-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Drop your Files here or Browse
                  </p>
                  <p className="text-xs text-gray-400">Max 4 images allowed</p>
                </div>
              </div>
              {mainImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {mainImages.map((imgObj, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={imgObj.url}
                        alt={`Product image ${idx + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Enter tags and press Enter"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Tax (%)
              </label>
              <input
                type="text"
                name="tax"
                value={formData.tax}
                onChange={handleInputChange}
                placeholder="Enter tax percentage"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleInputChange}
                placeholder="Enter coupon code"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Enter color"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Display Stock
              </label>
              <input
                type="text"
                name="displayStock"
                value={formData.displayStock}
                onChange={handleInputChange}
                placeholder="Enter display stock"
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Update Button */}
            <div className="pt-4">
              <button
                onClick={handleUpdate}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showVariantModal}
        onClose={() => setShowVariantModal(false)}
        title="Add New Variant"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newVariant}
            onChange={(e) => setNewVariant(e.target.value)}
            placeholder="Enter variant name"
            className="w-full p-2 border rounded-md"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowVariantModal(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddVariant}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              disabled={!newVariant.trim()}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        onUpload={handleImageUpload}
      />

      {/* Customization Type Modal */}
      <CustomizationTypeModal
        isOpen={showCustomTypeModal}
        onClose={() => setShowCustomTypeModal(false)}
        onAdd={handleAddCustomType}
      />
    </div>
  );
};

export default ProductForm;
