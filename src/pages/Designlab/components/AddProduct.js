import React, { useState, useRef,useEffect } from 'react';
import { Image, X, Upload, Plus, Camera, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import axios, { all } from "axios";

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Image Upload Modal Component
const ImageUploadModal = ({ isOpen, onClose, onUpload }) => {
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
          <h2 className="text-lg font-semibold">Upload Image</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={handleFileSelect}
            >
              <Upload className="w-16 h-16 text-gray-400" />
              <p className="mt-4 text-center text-gray-500">Drop your Files here or Browse</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
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
                Browse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductForm = () => {
  // Initial form state
  const initialFormData = {
    productName: '',
    productcode: '',
    category: "",
    categoryName: "",
    variantId: "",
    variant: '-select-',
    description: '',
    actualPrice: '',
    sellingPrice: '',
    isPriceSame: true,
    tax: '',
    couponCode: '',
    couponMethod: '-select-',
    displayStock: '-select-',
    colorCodes: '',
    letterCodes: ''
  };

  // Size options
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '1X', '2X', '3X', '4X', '5X'];

  // Initial sizes state as arrays
  const initialSizesState = {
    kids: [],
    adult: [],
    youth: [],
    women: []
  };

  // Form data state
  const [formData, setFormData] = useState(initialFormData);

  // State for selected sizes
  const [selectedSizes, setSelectedSizes] = useState(initialSizesState);
  
  // Initial tags
  const initialTags = ['Jersey', 'Shirt', 'T-Shirt', 'Formal'];
  
  // Tags state
  const [tags, setTags] = useState(initialTags);
  const [newTag, setNewTag] = useState('');
  
  // Modal states
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [newVariant, setNewVariant] = useState('');

  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [variants, setVariants] = useState([]);

  // Color-image set state
  const [colorImageSets, setColorImageSets] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSet, setNewSet] = useState({
    color: '',
    images: [null, null, null, null], // [front, back, rightSleeve, leftSleeve]
  });
  const [editIndex, setEditIndex] = useState(null);

  // Reset form function
  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedSizes(initialSizesState);
    setTags(initialTags);
  };
  
  // Input change handler
// Modify your handleInputChange function to handle the category selection special case
// Modify your handleInputChange function to save variant ID
const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
  
  // Special case for category selection
  if (name === 'category' && value) {
    const selectedCategory = categories.find(cat => (cat._id || cat.id) === value);
    if (selectedCategory) {
      setFormData(prev => ({
        ...prev,
        categoryName: selectedCategory.name || selectedCategory.categoryName
      }));
    }
  }
  
  // Special case for variant selection - save both variant name and ID
  if (name === 'variant' && value) {
    const selectedVariant = variants.find(v => v.variantName === value);
    if (selectedVariant) {
      setFormData(prev => ({
        ...prev,
        variantId: selectedVariant._id // Save the variant ID
      }));
    }
  }
  
  if (name === 'isPriceSame' && checked) {
    setFormData(prev => ({
      ...prev,
      sellingPrice: prev.actualPrice
    }));
  }
};


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
  
  // Size checkbox handler - now adds/removes from array
  const handleSizeCheck = (category, size, checked) => {
    if (checked) {
      // Add the size to the array if it doesn't exist
      setSelectedSizes(prev => ({
        ...prev,
        [category]: [...prev[category], size]
      }));
    } else {
      // Remove the size from the array
      setSelectedSizes(prev => ({
        ...prev,
        [category]: prev[category].filter(s => s !== size)
      }));
    }
  };
  
  // Tag handlers
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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

  const navigate = useNavigate();
  
  // Form submission
  const handleUpdate = async () => {
    // Include all data in a single object for logging
    const completeFormData = {
      ...formData,
      selectedSizes,
      tags,
    };

    // colorImageSets should not be empty
    if (colorImageSets.length === 0) {
      alert('Please add at least one color image set.');
      return;
    }
    
    console.log('Form data:', completeFormData, colorImageSets);
    await addProduct(completeFormData);
    // alert('Product updated successfully!');
    
    // Reset the form after submission
    resetForm();
  };

  const addProduct = async (productData) => {
    let imageLinks = [];
    if (productData.mainImages) {
      let mainImages = productData.mainImages;
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
    const productData_ = {
      productName: productData.productName,
      productCode: productData.productcode,
      categoryId: productData.category,
      categoryName: productData.categoryName,
      variantName: productData.variant,
      variantId: productData.variantId,
      description: productData.description,
      actualPrice: productData.actualPrice,
      sellingPrice: productData.sellingPrice,
      tags: productData.tags,
      tax: productData.tax,
      couponCode: productData.couponCode,
      couponMethod: productData.couponMethod,
      letterPrintingColor: productData.colorCodes,
      letterPrintingText: productData.letterCodes,
      availability: true,
      images: imageLinks,
      isDesignLab: true,
      kidsSizes: productData.selectedSizes.kids,
      adultSizes: productData.selectedSizes.adult,
      youthSizes: productData.selectedSizes.youth,
      womenSizes: productData.selectedSizes.women,
      status: productData.displayStock,
      designLabProducts: colorImageSets,
    };

    console.log("Product data:", productData_);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/products/addproduct`,
        productData_
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
  }
  
  // Helper to upload a single image file or base64 string
  const uploadImageAndGetUrl = async (img) => {
    // If already a URL (starts with http or /static/), return as is
    if (typeof img === 'string' && (img.startsWith('http') || img.startsWith('/'))) return img;
    // If it's a File object or base64 string, upload
    let file;
    if (img instanceof File) {
      file = img;
    } else if (typeof img === 'string' && img.startsWith('data:')) {
      // Convert base64 to File
      const arr = img.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
      file = new File([u8arr], 'custom.png', { type: mime });
    } else {
      return img;
    }
    const formData = new FormData();
    formData.append('file', file);
    const imageUploadResponse = await axios({
      method: 'post',
      url: '/upload',
      data: formData,
      headers: {
        Authorization: 'QuindlTokPATFileUpload2025#$$TerOiu$',
        'Content-Type': 'multipart/form-data',
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return imageUploadResponse.data.filePath;
  };
  
  return (
    <div className="w-full py-4 px-6">
      {/* Back button at the top */}
      <div className="mb-4">
        <button 
         onClick={() => navigate(-1)}
          
          className="flex items-center text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back </span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Product Information */}
        <div className="space-y-6 h-screen overflow-y-auto pr-4 pb-20">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter product name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
            <input
              type="text"
              name="productcode"
              value={formData.productcode}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter product ID"
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
          
          
          
          {/* Kids Size Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kids</label>
            <div className="grid grid-cols-5 gap-4">
              {sizes.map(size => (
                <label key={`kids-${size}`} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSizes.kids.includes(size)}
                    onChange={(e) => handleSizeCheck('kids', size, e.target.checked)}
                    className="mr-2"
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Adult Size Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adult Size</label>
            <div className="grid grid-cols-5 gap-4">
              {sizes.map(size => (
                <label key={`adult-${size}`} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSizes.adult.includes(size)}
                    onChange={(e) => handleSizeCheck('adult', size, e.target.checked)}
                    className="mr-2"
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Youth Size Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Youth Size</label>
            <div className="grid grid-cols-5 gap-4">
              {sizes.map(size => (
                <label key={`youth-${size}`} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSizes.youth.includes(size)}
                    onChange={(e) => handleSizeCheck('youth', size, e.target.checked)}
                    className="mr-2"
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Women Size Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Women</label>
            <div className="grid grid-cols-5 gap-4">
              {sizes.map(size => (
                <label key={`women-${size}`} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSizes.women.includes(size)}
                    onChange={(e) => handleSizeCheck('women', size, e.target.checked)}
                    className="mr-2"
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Product Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Color</label>
            <textarea
              name="colorCodes"
              value={formData.colorCodes}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              rows="5"
              placeholder="Enter color codes (one per line)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Letter Printing Color</label>
            <textarea
              name="letterCodes"
              value={formData.letterCodes}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              rows="5"
              placeholder="Enter color codes (one per line)"
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              placeholder="Enter product description"
            />
          </div>
          
          {/* Actual Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Actual Price</label>
            <input
              type="text"
              name="actualPrice"
              value={formData.actualPrice}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter actual price"
            />
          </div>
          
         {/* Selling Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
            <input
              type="text"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter selling price"
            />
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isPriceSame"
                  checked={formData.isPriceSame}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
                <span className="ml-2">Actual Price same as Selling Price</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Right Column - Images and additional info */}
        <div className="space-y-6">
          {/* Color-Image Sets Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Color & Images Sets</span>
              <button
                onClick={() => setDialogOpen(true)}
                className="px-3 py-1 bg-purple-600 text-white rounded"
              >
                Add Set
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorImageSets.map((set, idx) => (
                <div key={idx} className="border rounded p-3 flex flex-col items-center relative">
                  <div className="mb-2 font-medium capitalize">Color: {set.color}</div>
                  <div className="flex gap-2 mb-2">
                    {set.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-12 h-12 object-cover rounded" />
                    ))}
                  </div>
                  <div className="flex gap-2 absolute top-2 right-2">
                    <button
                      onClick={() => {
                        setEditIndex(idx);
                        setNewSet(set);
                        setDialogOpen(true);
                      }}
                      className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" /></svg>
                    </button>
                    <button
                      onClick={() => {
                        setColorImageSets(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dialog for adding a new set */}
          {dialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">{editIndex !== null ? 'Edit' : 'Add'} Color & Images Set</h2>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Color</label>
                  <input
                    type="text"
                    value={newSet.color}
                    onChange={e => setNewSet({ ...newSet, color: e.target.value })}
                    className="w-full border rounded p-2"
                    placeholder="e.g. white"
                  />
                </div>
                {['Front', 'Back', 'Right Sleeve', 'Left Sleeve'].map((label, idx) => (
                  <div className="mb-3" key={label}>
                    <label className="block mb-1">{label} Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => {
                          const images = [...newSet.images];
                          images[idx] = ev.target.result;
                          setNewSet({ ...newSet, images });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    {newSet.images[idx] && (
                      <img src={newSet.images[idx]} alt={label} className="w-16 h-16 mt-1 object-cover rounded" />
                    )}
                  </div>
                ))}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setDialogOpen(false);
                      setNewSet({ color: '', images: [null, null, null, null] });
                      setEditIndex(null);
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!newSet.color || newSet.images.some(img => !img)) {
                        alert('Please select a color and all 4 images.');
                        return;
                      }
                      // Upload images if needed
                      const uploadedImages = await Promise.all(newSet.images.map(img => uploadImageAndGetUrl(img)));
                      const setToSave = { ...newSet, images: uploadedImages };
                      if (editIndex !== null) {
                        setColorImageSets(prev => prev.map((set, i) => i === editIndex ? setToSave : set));
                      } else {
                        setColorImageSets(prev => [...prev, setToSave]);
                      }
                      setNewSet({ color: '', images: [null, null, null, null] });
                      setDialogOpen(false);
                      setEditIndex(null);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded"
                  >
                    {editIndex !== null ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Tax */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax (in percentage)</label>
            <input
              type="text"
              name="tax"
              value={formData.tax}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter tax percentage"
            />
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <div key={tag} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  <span>{tag}</span>
                  <button 
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Enter tag and press Enter"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon / Code</label>
            <input
              type="text"
              name="couponCode"
              value={formData.couponCode}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter coupon code"
            />
          </div>
          
          {/* Coupons Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupons Method</label>
            <select
              name="couponMethod"
              value={formData.couponMethod}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="-select-">-select-</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          
          {/* Display Stock */}
          <div>
            <label className="">Display Stock Availability</label>
            <select
              name="displayStock"
              value={formData.displayStock}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="-select-">-select-</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          
          {/* Button Group */}
          <div className="mt-8 flex gap-4">
            
            <button
              onClick={handleUpdate}
              className="w-2/3 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add Product
            </button>
          </div>
        </div>
      
      
      {/* Variant Modal */}
      <Modal isOpen={showVariantModal} onClose={() => setShowVariantModal(false)} title="Add New Variant">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variant Name</label>
            <input
              type="text"
              value={newVariant}
              onChange={(e) => setNewVariant(e.target.value)}
              placeholder="Enter variant name"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
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
              Add Variant
            </button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
    
  );
};

export default ProductForm;