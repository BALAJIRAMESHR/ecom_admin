import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronDown, X, Clock, ArrowLeft, Calendar } from "lucide-react";

// API configuration
const API_BASE_URL = "https://ecom-2-osny.onrender.com";

// Utility functions
const generateCouponId = () => {
  return `#UPA${Math.floor(1000 + Math.random() * 9000)}`;
};

const getCurrentDateTime = () => {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "short" });
  const day = now.getDate();
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${month} ${day}, ${time}`;
};

// API service functions
const fetchCoupons = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons`);
    if (!response.ok) {
      throw new Error("Failed to fetch coupons");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

const fetchCouponById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/coupons/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch coupon");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching coupon:", error);
    throw error;
  }
};

const createNewCoupon = async (couponData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(couponData),
    });
    if (!response.ok) {
      throw new Error("Failed to create coupon");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

const updateExistingCoupon = async (id, couponData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(couponData),
    });
    if (!response.ok) {
      throw new Error("Failed to update coupon");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

const deleteCouponById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete coupon");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

// Fetch products and categories from API
const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleString("default", { 
      month: "short", 
      day: "numeric",
      year: "numeric"
    });
  } catch (e) {
    console.error("Date formatting error:", e);
    return dateString;
  }
};


// Product Selection Popup Component
const ProductSelectionPopup = ({ onClose, onSelect }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Apply to Specific products</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Category</label>
          <div className="relative">
            <select 
              className="w-full p-2 border rounded-lg appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-3 text-gray-500"
              size={16}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Search by Product</label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-2 border rounded-lg pl-10"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center text-sm mb-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            Select All
          </label>

          <div className="max-h-64 overflow-y-auto border rounded-lg">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading products...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No products found</div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className="flex items-center p-2 border-b">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => {
                      setSelectedProducts((prev) =>
                        prev.includes(product._id)
                          ? prev.filter((id) => id !== product._id)
                          : [...prev, product._id]
                      );
                    }}
                    className="mr-4"
                  />
                  <img
                    src={product.images?.[0] || "/api/placeholder/100/100"}
                    alt={product.productName}
                    className="w-12 h-12 object-cover rounded mr-4"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/100/100";
                    }}
                  />
                  <div>
                    <div className="text-sm font-medium">{product.productName}</div>
                    <div className="text-sm text-gray-600">
                      MRP ₹{product.actualPrice} ₹{product.sellingPrice}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSelect(selectedProducts);
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            disabled={loading || selectedProducts.length === 0}
          >
            Create coupon
          </button>
        </div>
      </div>
    </div>
  );
};

// New Coupon Form Component
const CreateCouponForm = ({ onSave, onBack }) => {
  const [showProductSelection, setShowProductSelection] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "FixedAmount", // Default to fixed amount as shown in mockup
    discountAmount: "",
    duration: "Forever",
    limitDateRange: false,
    limitTotalRedemptions: false,
    totalRedemptions: "",
    startDate: "",
    endDate: "",
    useCustomerFacingCodes: false,
    code: "",
    currency: "INR",
    products: []
  });
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [currencies, setCurrencies] = useState(["INR", "USD", "EUR", "GBP"]);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [additionalCurrencies, setAdditionalCurrencies] = useState([]);

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setFormData({ ...formData, currency });
    setShowCurrencyDropdown(false);
  };

  const handleAddAdditionalCurrency = () => {
    // Add additional currency fields only for fixed amount discount
    if (formData.type === "FixedAmount") {
      setAdditionalCurrencies([...additionalCurrencies, { currency: "USD", amount: "" }]);
    }
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
    // Reset additional currencies when switching to percentage
    if (type === "Percentage") {
      setAdditionalCurrencies([]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare data for API
      const couponData = {
        name: formData.name,
        type: formData.type,
        discount: formData.type === "Percentage" ? formData.discountAmount + "%" : formData.discountAmount,
        currency: formData.currency,
        duration: formData.duration,
        startDate: formData.limitDateRange ? formData.startDate : null,
        endDate: formData.limitDateRange ? formData.endDate : null,
        maxRedemptions: formData.limitTotalRedemptions ? parseInt(formData.totalRedemptions) : null,
        code: formData.useCustomerFacingCodes ? formData.code : generateCouponId(),
        products: selectedProducts,
        additionalCurrencies: additionalCurrencies
      };
      
      const result = await createNewCoupon(couponData);
      setLoading(false);
      
      if (onSave) {
        onSave(result);
      }
      
      // Navigate back to the coupons list
      if (onBack) {
        onBack();
      } else {
        window.history.back();
      }
      
    } catch (err) {
      setLoading(false);
      setError("Failed to create coupon. Please try again.");
      console.error("Error creating coupon:", err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack || (() => window.history.back())} 
          className="flex items-center text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold ml-4">Create Coupons</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Create a coupon</h2>
          <p className="text-gray-600">Coupons can be used to discount invoices, subscriptions, or entire customer accounts.</p>
        </div>
        
        <form onSubmit={handleFormSubmit}>
          {/* Name Field */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              id="name"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="First purchase discount"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          {/* Discount Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="discountType"
                  className="mr-2"
                  checked={formData.type === "Percentage"}
                  onChange={() => handleTypeChange("Percentage")}
                />
                <span>Percentage discount</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="discountType"
                  className="mr-2"
                  checked={formData.type === "FixedAmount"}
                  onChange={() => handleTypeChange("FixedAmount")}
                />
                <span>Fixed amount discount</span>
              </label>
            </div>
          </div>
          
          {/* Discount Amount */}
          <div className="mb-6">
            <label htmlFor="discountAmount" className="block text-sm font-medium mb-2">Discount amount</label>
            <div className="flex">
              <div className="relative w-56">
                {formData.type === "Percentage" ? (
                  <div className="flex">
                    <input
                      type="text"
                      id="discountAmount"
                      className="w-full p-3 border border-gray-300 rounded-l-lg"
                      placeholder="0"
                      value={formData.discountAmount}
                      onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                      required
                    />
                    <div className="flex items-center px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg">
                      <span>%</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <input
                      type="text"
                      id="discountAmount"
                      className="w-full p-3 border border-gray-300 rounded-l-lg"
                      placeholder="0.00"
                      value={formData.discountAmount}
                      onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="flex items-center justify-between px-3 py-2 bg-white border border-l-0 border-gray-300 rounded-r-lg"
                      onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                    >
                      <span>{selectedCurrency}</span>
                      <ChevronDown size={16} className="ml-2" />
                    </button>
                  </div>
                )}
                
                {/* Currency Dropdown - only for Fixed Amount */}
                {showCurrencyDropdown && formData.type === "FixedAmount" && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    {currencies.map((currency) => (
                      <button
                        key={currency}
                        type="button"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleCurrencySelect(currency)}
                      >
                        {currency}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Add Additional Currencies Button - only for Fixed Amount */}
            {formData.type === "FixedAmount" && (
              <button
                type="button"
                className="flex items-center text-purple-600 mt-2"
                onClick={handleAddAdditionalCurrency}
              >
                <Plus size={16} className="mr-1" />
                Add additional currencies
              </button>
            )}
            
            {/* Additional Currency Fields - only for Fixed Amount */}
            {formData.type === "FixedAmount" && additionalCurrencies.map((curr, index) => (
              <div key={index} className="flex mt-3 w-56">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-l-lg"
                  placeholder="0.00"
                  value={curr.amount}
                  onChange={(e) => {
                    const updatedCurrencies = [...additionalCurrencies];
                    updatedCurrencies[index].amount = e.target.value;
                    setAdditionalCurrencies(updatedCurrencies);
                  }}
                />
                <button
                  type="button"
                  className="flex items-center justify-between px-3 py-2 bg-white border border-l-0 border-gray-300 rounded-r-lg"
                >
                  <span>{curr.currency}</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Apply to Specific Products Toggle */}
          <div className="mb-6">
            <label className="flex items-center">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle"
                  className="sr-only"
                  checked={selectedProducts.length > 0}
                  onChange={() => selectedProducts.length > 0 ? setSelectedProducts([]) : setShowProductSelection(true)}
                />
                <div className={`block w-10 h-6 rounded-full ${selectedProducts.length > 0 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${selectedProducts.length > 0 ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="text-sm font-medium">Apply to specific products</span>
            </label>
            {selectedProducts.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {selectedProducts.length} products selected
                <button
                  type="button"
                  className="ml-2 text-purple-600"
                  onClick={() => setShowProductSelection(true)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          
          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Duration</label>
            <div className="relative w-56">
              <button
                type="button"
                className="flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
                onClick={() => setShowDurationDropdown(!showDurationDropdown)}
              >
                <span>{formData.duration}</span>
                <ChevronDown size={16} />
              </button>
              
              {/* Duration Dropdown */}
              {showDurationDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                  {["Forever", "Once", "Repeating", "X times"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setFormData({ ...formData, duration: option });
                        setShowDurationDropdown(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <p className="mt-2 text-sm text-gray-600">
              For subscription on customers, this determines how long this coupons will apply once apply once redeemed. One-off invoices accept both "once" and "forever" coupons. 
              <a href="#" className="text-purple-600 ml-1">Learn more</a>
            </p>
          </div>
          
          {/* Redemption Limits */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Redemption limits</h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.limitDateRange}
                  onChange={() => setFormData({ ...formData, limitDateRange: !formData.limitDateRange })}
                />
                <span>Limit the date range when customers can redeem this coupon</span>
              </label>
              
              {formData.limitDateRange && (
                <div className="pl-6 mt-2 space-y-3">
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm mb-1">Start Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full p-2 border rounded-lg"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          required={formData.limitDateRange}
                        />
                        <Calendar className="absolute right-3 top-3 text-gray-400" size={16} />
                      </div>
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm mb-1">End Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full p-2 border rounded-lg"
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          required={formData.limitDateRange}
                        />
                        <Calendar className="absolute right-3 top-3 text-gray-400" size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.limitTotalRedemptions}
                  onChange={() => setFormData({ ...formData, limitTotalRedemptions: !formData.limitTotalRedemptions })}
                />
                <span>Limit the total number of times this coupon can be redeemed</span>
              </label>
              
              {formData.limitTotalRedemptions && (
                <div className="pl-6 mt-2">
                  <input
                    type="number"
                    className="w-56 p-2 border rounded-lg"
                    placeholder="Maximum redemptions"
                    min="1"
                    value={formData.totalRedemptions}
                    onChange={(e) => setFormData({...formData, totalRedemptions: e.target.value})}
                    required={formData.limitTotalRedemptions}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Codes Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Codes</h3>
            <label className="flex items-center">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.useCustomerFacingCodes}
                  onChange={() => setFormData({ ...formData, useCustomerFacingCodes: !formData.useCustomerFacingCodes })}
                />
                <div className={`block w-10 h-6 rounded-full ${formData.useCustomerFacingCodes ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.useCustomerFacingCodes ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="text-sm font-medium">Use customer-facing coupon codes</span>
            </label>
            
            {formData.useCustomerFacingCodes && (
              <div className="pl-6 mt-3">
                <input
                  type="text"
                  className="w-56 p-2 border rounded-lg"
                  placeholder="WELCOME10"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  required={formData.useCustomerFacingCodes}
                />
                <p className="mt-1 text-sm text-gray-500">Customers will need to enter this code at checkout</p>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end mt-8 gap-4">
            <button
              type="button"
              onClick={onBack || (() => window.history.back())}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create coupon"}
            </button>
          </div>
        </form>
      </div>
      
      {/* Product Selection Popup */}
      {showProductSelection && (
        <ProductSelectionPopup
          onClose={() => setShowProductSelection(false)}
          onSelect={(products) => {
            setSelectedProducts(products);
            setShowProductSelection(false);
          }}
        />
      )}
    </div>
  );
};
// Continuing from where the code left off - completing the CouponCard component

const CouponCard = ({
  _id,
  name,
  discount,
  products,
  startDate,
  endDate,
  code,
  createdAt,
  onClick,
}) => {
  // Format dates if they are full ISO date strings
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleString("default", { 
        month: "short", 
        day: "numeric" 
      });
    } catch (e) {
      return dateString;
    }
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  
  return (
    <div className="relative cursor-pointer group" onClick={() => onClick(_id)}>
      <div className="bg-purple-500 rounded-xl p-4 text-white relative overflow-hidden hover:bg-purple-600 transition-colors">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-12 bg-purple-300 rounded-r-full"></div>
        
        <div className="ml-4">
          <div className="text-lg font-semibold mb-1">{name || "Unnamed Coupon"}</div>
          <div className="text-2xl font-bold mb-3">{discount || "0% off"}</div>
          
          <div className="flex items-center text-sm opacity-80 mb-1">
            <Clock size={14} className="mr-1" />
            <span className="mr-1">Created</span>
            <span>{getCurrentDateTime()}</span>
          </div>
          
          {(formattedStartDate && formattedEndDate) && (
            <div className="text-sm opacity-80 mb-1">
              Valid: {formattedStartDate} - {formattedEndDate}
            </div>
          )}
          
          {products?.length > 0 && (
            <div className="text-sm opacity-80 mb-1">
              Applies to {products.length} product{products.length !== 1 ? 's' : ''}
            </div>
          )}
          
          {code && (
            <div className="mt-2 inline-block bg-purple-400 rounded px-2 py-1 text-xs font-mono">
              {code}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// CouponDetail Component for viewing a single coupon
const CouponDetail = ({ couponId, onBack, onEdit, onDelete }) => {
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchCouponDetails = async () => {
      try {
        setLoading(true);
        const couponData = await fetchCouponById(couponId);
        setCoupon(couponData);
        
        // If the coupon has product IDs, fetch the product details
        if (couponData.products && couponData.products.length > 0) {
          const productsData = await fetchProducts();
          const filteredProducts = productsData.filter(p => 
            couponData.products.includes(p._id)
          );
          setProducts(filteredProducts);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching coupon details:", err);
        setError("Failed to load coupon details");
        setLoading(false);
      }
    };

    if (couponId) {
      fetchCouponDetails();
    }
  }, [couponId]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteCouponById(couponId);
      setLoading(false);
      setDeleteModalOpen(false);
      
      if (onBack) {
        onBack();
      }
    } catch (err) {
      console.error("Error deleting coupon:", err);
      setError("Failed to delete coupon");
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading coupon details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button 
          onClick={onBack} 
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Coupon not found</p>
        <button 
          onClick={onBack} 
          className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to coupons
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{coupon.name}</h1>
            <div className="text-gray-600">
              {coupon.code && (
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-mono">
                  {coupon.code}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onEdit(couponId)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Coupon Details</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Discount</div>
                <div className="font-medium">{coupon.discount}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-medium">{coupon.duration || "Forever"}</div>
              </div>
              
              {(coupon.startDate || coupon.endDate) && (
                <div>
                  <div className="text-sm text-gray-500">Valid Period</div>
                  <div className="font-medium">
                    {coupon.startDate ? formatDate(coupon.startDate) : "Anytime"} - {coupon.endDate ? formatDate(coupon.endDate) : "Forever"}
                  </div>
                </div>
              )}
              
              {coupon.maxRedemptions && (
                <div>
                  <div className="text-sm text-gray-500">Maximum Redemptions</div>
                  <div className="font-medium">{coupon.maxRedemptions}</div>
                </div>
              )}
              
              <div>
                <div className="text-sm text-gray-500">Created At</div>
                <div className="font-medium">{formatDate(coupon.createdAt)}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Applied Products</h2>
            
            {products.length === 0 ? (
              <div className="text-gray-500">
                Applied to all products
              </div>
            ) : (
              <div className="border rounded-lg divide-y max-h-80 overflow-y-auto">
                {products.map(product => (
                  <div key={product._id} className="flex items-center p-3">
                    <img
                      src={product.images?.[0] || "/api/placeholder/60/60"}
                      alt={product.productName}
                      className="w-12 h-12 object-cover rounded mr-3"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/60/60";
                      }}
                    />
                    <div>
                      <div className="font-medium">{product.productName}</div>
                      <div className="text-sm text-gray-600">
                        MRP ₹{product.actualPrice} ₹{product.sellingPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Delete Coupon</h3>
            <p className="mb-4">
              Are you sure you want to delete the coupon "{coupon.name}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Coupons List Component
const CouponsList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editCouponId, setEditCouponId] = useState(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await fetchCoupons();
      setCoupons(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading coupons:", err);
      setError("Failed to load coupons. Please try again later.");
      setLoading(false);
    }
  };

  const filteredCoupons = coupons.filter(coupon => 
    coupon.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCouponClick = (id) => {
    setSelectedCoupon(id);
  };

  const handleCreateSuccess = () => {
    loadCoupons();
    setShowCreateForm(false);
  };

  const handleEditCoupon = (id) => {
    setEditCouponId(id);
    setSelectedCoupon(null);
  };

  if (showCreateForm) {
    return (
      <CreateCouponForm 
        onSave={handleCreateSuccess}
        onBack={() => setShowCreateForm(false)}
      />
    );
  }

  if (editCouponId) {
    // This would ideally be an EditCouponForm component
    // For simplicity, we're reusing the CreateCouponForm
    return (
      <CreateCouponForm 
        couponId={editCouponId}
        onSave={handleCreateSuccess}
        onBack={() => {
          setEditCouponId(null);
          loadCoupons();
        }}
      />
    );
  }

  if (selectedCoupon) {
    return (
      <CouponDetail 
        couponId={selectedCoupon}
        onBack={() => {
          setSelectedCoupon(null);
          loadCoupons();
        }}
        onEdit={handleEditCoupon}
        onDelete={() => {
          setSelectedCoupon(null);
          loadCoupons();
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus size={20} className="mr-2" />
          Create coupon
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search coupons..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={loadCoupons}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-3"></div>
            <p className="text-gray-500">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <Search size={48} className="mx-auto opacity-50" />
            </div>
            {searchTerm ? (
              <p className="text-gray-500">No coupons found matching "{searchTerm}"</p>
            ) : (
              <div>
                <p className="text-gray-500 mb-3">No coupons created yet</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create your first coupon
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon._id}
                {...coupon}
                onClick={handleCouponClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const CouponManagement = () => {
  return (
    <div className="min-h-screen ">
      <CouponsList />
    </div>
  );
};

export default CouponManagement;