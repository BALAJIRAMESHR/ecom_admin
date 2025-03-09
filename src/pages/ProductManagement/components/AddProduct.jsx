import React, { useState, useRef, useEffect } from 'react';
import { Image, X, Upload, Plus, Camera } from 'lucide-react';

// Modal Component for adding new variants and customization types
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
const ImageUploadModal = ({ isOpen, onClose, onUpload, title }) => {
  const fileInputRef = useRef(null);
  
  if (!isOpen) return null;
  
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, you would handle the file upload to a server
      // For this demo, we'll just use a placeholder
      onUpload(`/api/placeholder/400/300`);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{title || "Upload Image"}</h2>
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
              <Camera className="w-16 h-16 text-gray-400" />
              <p className="mt-4 text-center text-gray-500">Click to select an image from your device</p>
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
                Choose File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Customization Image Modal
const CustomizationImageModal = ({ isOpen, onClose, onUpload, title }) => {
  const fileInputRef = useRef(null);
  
  if (!isOpen) return null;
  
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, you would handle the file upload to a server
      // For this demo, we'll just use a placeholder
      onUpload(`/api/placeholder/400/300`);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{title || "Add Image"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={handleFileSelect}
            >
              <Image className="w-16 h-16 text-gray-400" />
              <p className="mt-2 text-center text-gray-500">Drop your Files here or Browse</p>
            </div>
            
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter a Name"
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            
            <div className="flex justify-between gap-2 mt-4">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpload(`/api/placeholder/400/300`);
                  onClose();
                }}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// New CustomizationType Modal Component that includes image upload
const CustomizationTypeModal = ({ isOpen, onClose, onAdd }) => {
  const [typeName, setTypeName] = useState('');
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');
  const [images, setImages] = useState([]);
  const [showCustomImageModal, setShowCustomImageModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleFileSelect = () => {
    setShowCustomImageModal(true);
  };
  
  const handleAddImage = (imagePath) => {
    setImages([...images, imagePath]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (typeName.trim()) {
      onAdd({
        id: Date.now(),
        name: typeName.trim(),
        options: options,
        images: images
      });
      
      // Reset form
      setTypeName('');
      setOptions([]);
      setImages([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">Add New Customization Type</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Type Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Type Name</label>
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
            <label className="block text-sm text-gray-700 mb-1">Options</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Enter option value"
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={handleAddOption}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 whitespace-nowrap"
              >
                Add
              </button>
            </div>
            
            {options.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {options.map((option, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1">
                    {option}
                    <button
                      onClick={() => handleRemoveOption(idx)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Images</label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 mb-2"
              onClick={handleFileSelect}
            >
              <Camera className="w-12 h-12 text-gray-400" />
              <p className="mt-2 text-center text-gray-500">Add images for this customization type</p>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Option ${idx + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
      
      {/* Custom Image Upload Modal */}
      <CustomizationImageModal
        isOpen={showCustomImageModal}
        onClose={() => setShowCustomImageModal(false)}
        onUpload={handleAddImage}
        title="Add Neck Line Image"
      />
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
  const [tags, setTags] = useState(['Bridal Silk', 'Sharee', 'Bridal', 'Women', 'Art work']);
  const [mainImages, setMainImages] = useState([]);
  const [variants, setVariants] = useState(['Kanchipuram Bridal']);
  const [newVariant, setNewVariant] = useState('');
  const [newTag, setNewTag] = useState('');
  
  // Customization states
  const measurements = ['Shoulder', 'Chest', 'Bust', 'Under Bust', 'Waist', 'Hip', 'Under Arm'];
  const [selectedInches, setSelectedInches] = useState({});
  const [customizationTypes, setCustomizationTypes] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    productName: '',
    productId: '0',
    category: '',
    variant: '',
    description: '.',
    actualPrice: '',
    sellingPrice: '',
    isPriceSame: true,
    tax: '',
    couponCode: '',
    color: '',
    displayStock: ''
  });

  // Standard sizes
  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', '1X', '2X', '3X', '4X', '5X'];
  const [selectedSizes, setSelectedSizes] = useState({});

  // Handle back button click
  const handleBackClick = () => {
    // Navigate back in history
    window.history.back();
    // If you're using a router like react-router, you can use:
    // navigate(-1);  
    
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'isPriceSame' && checked) {
      setFormData(prev => ({
        ...prev,
        sellingPrice: prev.actualPrice
      }));
    }
  };

  // Tag removal handler
  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Add tag handler
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Image upload handler
  const handleImageUpload = (imagePath) => {
    if (mainImages.length >= 4) {
      alert('Maximum 4 images allowed');
      return;
    }
    
    setMainImages(prev => [...prev, imagePath]);
    console.log('Main Images:', [...mainImages, imagePath]);
  };

  // Image removal handler
  const removeImage = (index) => {
    const updatedImages = mainImages.filter((_, i) => i !== index);
    setMainImages(updatedImages);
    console.log('Images after removal:', updatedImages);
  };

  // Add variant handler
  const handleAddVariant = () => {
    if (newVariant.trim()) {
      const updatedVariants = [...variants, newVariant.trim()];
      setVariants(updatedVariants);
      setNewVariant('');
      setShowVariantModal(false);
      console.log('Updated variants:', updatedVariants);
    }
  };

  // Add customization type handler
  const handleAddCustomType = (customType) => {
    const updatedTypes = [...customizationTypes, customType];
    setCustomizationTypes(updatedTypes);
    console.log('Added new customization type:', customType);
    console.log('Updated customization types:', updatedTypes);
  };

  // Remove a customization type
  const removeCustomizationType = (typeId) => {
    const updatedTypes = customizationTypes.filter(type => type.id !== typeId);
    setCustomizationTypes(updatedTypes);
    console.log('Removed customization type, remaining types:', updatedTypes);
  };

  // Log all form data
  const handleUpdate = () => {
    const allData = {
      formData,
      tags,
      variants,
      mainImages,
      selectedSizes,
      customizationEnabled: showCustomization,
      customMeasurements: selectedInches,
      customizationTypes
    };
    
    console.log('Complete form data:', allData);
    alert('Product updated successfully!');
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
                  console.log('Customization toggled:', e.target.checked);
                }}
                className="hidden"
              />
              <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                showCustomization ? 'bg-purple-600' : 'bg-gray-200'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  showCustomization ? 'translate-x-6' : 'translate-x-1'
                } transform mt-0.5`} />
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Product Info - with scrollable container */}
          <div className="space-y-4 overflow-y-auto pr-4 pb-16">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Product Name</label>
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
              <label className="block text-sm text-gray-700 mb-1">Product ID</label>
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
              <label className="block text-sm text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">-Select Category-</option>
                <option>Women</option>
                <option>Men</option>
                <option>Children</option>
                <option>Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Variant</label>
              <div className="flex gap-2">
                <select
                  name="variant"
                  value={formData.variant}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">-Select Variant-</option>
                  {variants.map(variant => (
                    <option key={variant} value={variant}>{variant}</option>
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
              <label className="block text-sm text-gray-700 mb-1">Standard Size</label>
              <div className="grid grid-cols-5 gap-4">
                {standardSizes.map(size => (
                  <label key={size} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSizes[size] || false}
                      onChange={(e) => {
                        const updated = {
                          ...selectedSizes,
                          [size]: e.target.checked
                        };
                        setSelectedSizes(updated);
                        console.log('Selected sizes:', updated);
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
                {measurements.map(measurement => (
                  <div key={measurement} className="grid grid-cols-5 gap-2 items-center">
                    <div className="font-medium">{measurement}</div>
                    {[1, 2, 3, 4].map(inch => (
                      <label key={`${measurement}-${inch}`} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={selectedInches[`${measurement}-${inch}`] || false}
                          onChange={(e) => {
                            const updated = {
                              ...selectedInches,
                              [`${measurement}-${inch}`]: e.target.checked
                            };
                            setSelectedInches(updated);
                            console.log('Selected inches:', updated);
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
                  <p className="text-gray-500">No customization types added yet</p>
                )}
                {customizationTypes.map(type => (
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
                        <div className="text-sm text-gray-500 mb-1">Options:</div>
                        <div className="flex flex-wrap gap-2">
                          {type.options.map((option, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {type.images.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Images:</div>
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
              <label className="block text-sm text-gray-700 mb-1">Description</label>
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
              <label className="block text-sm text-gray-700 mb-1">Actual Price</label>
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
              <label className="block text-sm text-gray-700 mb-1">Selling Price</label>
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
                  <p className="mt-2 text-sm text-gray-500">Drop your Files here or Browse</p>
                  <p className="text-xs text-gray-400">Max 4 images allowed</p>
                </div>
              </div>
              {mainImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {mainImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${idx + 1}`}
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

            <div>
              <label className="block text-sm text-gray-700 mb-1">Tax (in percentage)</label>
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
              <label className="block text-sm text-gray-700 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span
                    key={tag}
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
                placeholder="Add a tag and press Enter"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Coupon Code</label>
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
                placeholder="Enter product color"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Display Stock</label>
              <input
                type="text"
                name="displayStock"
                value={formData.displayStock}
                onChange={handleInputChange}
                placeholder="Enter stock to display"
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Update Button */}
            <div className="mt-8">
              <button
                onClick={handleUpdate}
                className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Variant Modal */}
      <Modal isOpen={showVariantModal} onClose={() => setShowVariantModal(false)} title="Add New Variant">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Variant Name</label>
            <input
              type="text"
              value={newVariant}
              onChange={(e) => setNewVariant(e.target.value)}
              placeholder="Enter variant name"
              className="w-full p-2 border rounded-md"
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