import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronDown, X, Clock, ArrowLeft, Calendar } from "lucide-react";

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

// Product Selection Popup Component
const ProductSelectionPopup = ({ onClose, onSelect }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [categories, setCategories] = useState([
    { _id: "cat1", categoryName: "Electronics" },
    { _id: "cat2", categoryName: "Clothing" },
    { _id: "cat3", categoryName: "Home & Kitchen" }
  ]);
  const [products, setProducts] = useState([
    { _id: "p1", productName: "Smartphone", categoryId: { _id: "cat1" }, actualPrice: 15000, sellingPrice: 12999, images: ["/api/placeholder/100/100"] },
    { _id: "p2", productName: "Laptop", categoryId: { _id: "cat1" }, actualPrice: 45000, sellingPrice: 39999, images: ["/api/placeholder/100/100"] },
    { _id: "p3", productName: "T-shirt", categoryId: { _id: "cat2" }, actualPrice: 999, sellingPrice: 799, images: ["/api/placeholder/100/100"] },
    { _id: "p4", productName: "Cookware Set", categoryId: { _id: "cat3" }, actualPrice: 2500, sellingPrice: 1999, images: ["/api/placeholder/100/100"] }
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
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
          >
            Create coupon
          </button>
        </div>
      </div>
    </div>
  );
};

// New Coupon Form Component
const CreateCouponForm = () => {
  const [showProductSelection, setShowProductSelection] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "FixedAmount", // Default to fixed amount as shown in mockup
    discountAmount: "",
    duration: "Forever",
    limitDateRange: false,
    limitTotalRedemptions: false,
    startDate: "",
    endDate: "",
    useCustomerFacingCodes: false
  });
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [currencies, setCurrencies] = useState(["INR", "USD", "EUR", "GBP"]);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [additionalCurrencies, setAdditionalCurrencies] = useState([]);

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Logic to submit form data
    console.log("Form submitted:", formData);
    // Reset form or redirect to coupons list
    window.history.back();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="flex items-center mb-4">
        <button onClick={() => window.history.back()} className="flex items-center text-purple-600 hover:text-purple-700">
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold ml-4">Create Coupons</h1>
      </div>
      
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
                />
                <p className="mt-1 text-sm text-gray-500">Customers will need to enter this code at checkout</p>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end mt-8 gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create coupon
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

// Coupon Card Component
const CouponCard = ({
  name,
  discount,
  product,
  startDate,
  endDate,
  code,
  createdAt,
  onClick,
}) => (
  <div className="relative cursor-pointer group" onClick={onClick}>
    <div className="bg-purple-500 rounded-xl p-4 text-white relative overflow-hidden hover:bg-purple-600 transition-colors">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded-r-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded-l-full" />

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold">{name || "First Purchase Discount"}</h3>
          <p className="text-sm text-purple-100">{product}</p>
          <p className="text-sm text-purple-100">
            {startDate} - {endDate}
          </p>
          <p className="text-sm text-purple-100">{code}</p>
          {createdAt && (
            <div className="flex items-center text-purple-100 text-xs mt-2">
              <Clock size={14} className="mr-1" />
              {createdAt}
            </div>
          )}
        </div>
        <div className="text-6xl font-bold mr-8 mt-4">
          {discount}
          <span className="block text-base font-normal">off</span>
        </div>
      </div>
    </div>

    <div className="absolute -left-1.5 top-0 bottom-0 w-3 flex flex-col justify-around">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-3 h-3 bg-white rounded-full" />
      ))}
    </div>
    <div className="absolute -right-1.5 top-0 bottom-0 w-3 flex flex-col justify-around">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-3 h-3 bg-white rounded-full" />
      ))}
    </div>
  </div>
);

// Coupon Ticket Detail Component
const CouponTicket = ({ coupon, onBack }) => {
  const {
    name = "First Purchase Discount",
    product = "All Products",
    discount = "30%",
    startDate = "Oct 2nd",
    endDate = "Oct 24th",
    id = generateCouponId(),
    createdAt = getCurrentDateTime(),
  } = coupon || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
        </div>

        <div className="relative">
          <div className="bg-purple-500 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-r-full" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-l-full" />

            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-purple-100">{product}</p>
                <p className="text-purple-100">
                  {startDate} - {endDate}
                </p>
                <p className="text-purple-100">{id}</p>
                <div className="flex items-center text-purple-100 text-sm mt-4">
                  <Clock size={16} className="mr-2" />
                  {createdAt}
                </div>
              </div>

              <div className="text-4xl font-bold">
                {discount}
                <span className="block text-xl font-normal">off</span>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <path
                  d="M50 10 L50 90 M10 50 L90 50"
                  stroke="currentColor"
                  strokeWidth="8"
                />
              </svg>
            </div>
          </div>

          <div className="absolute -left-2 top-0 bottom-0 w-4 flex flex-col justify-around">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-white rounded-full" />
            ))}
          </div>
          <div className="absolute -right-2 top-0 bottom-0 w-4 flex flex-col justify-around">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-white rounded-full" />
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">Coupon Details</h4>
            <p className="text-gray-600">
              This coupon provides a {discount} discount on {product}. Valid
              from {startDate} to {endDate}.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">How to Use</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Copy the coupon code: {id}</li>
              <li>Apply it at checkout</li>
              <li>Enjoy your discount!</li>
            </ol>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Terms & Conditions</h4>
            // Continuation of the Terms & Conditions section in CouponTicket component
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Cannot be combined with other offers</li>
              <li>Valid for the specified date range only</li>
              <li>Limited to one use per customer</li>
              <li>Not redeemable for cash</li>
            </ul>
          </div>

          <div className="pt-4 pb-6">
            <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
              Copy Coupon Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Coupons List Component
const CouponsList = () => {
  const [coupons, setCoupons] = useState([
    {
      id: generateCouponId(),
      name: "First Purchase Discount",
      discount: "30%",
      product: "All Products",
      startDate: "Oct 2nd",
      endDate: "Oct 24th",
      code: "WELCOME30",
      createdAt: "Oct 15, 2:30 PM"
    },
    {
      id: generateCouponId(),
      name: "Holiday Special",
      discount: "₹500",
      product: "Electronics",
      startDate: "Dec 1st",
      endDate: "Dec 31st",
      code: "HOLIDAY500",
      createdAt: "Oct 12, 11:45 AM"
    },
    {
      id: generateCouponId(),
      name: "Weekend Sale",
      discount: "15%",
      product: "Clothing",
      startDate: "Every Weekend",
      endDate: "Ongoing",
      code: "WEEKEND15",
      createdAt: "Oct 10, 9:20 AM"
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredCoupons = coupons.filter(coupon => 
    coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedCoupon) {
    return <CouponTicket coupon={selectedCoupon} onBack={() => setSelectedCoupon(null)} />;
  }

  if (showCreateForm) {
    return <CreateCouponForm onBack={() => setShowCreateForm(false)} />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Coupons</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus size={20} className="mr-2" />
            Create coupon
          </button>
        </div>

        <div className="mb-6 relative">
          <input
            type="text"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                {...coupon}
                onClick={() => setSelectedCoupon(coupon)}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              No coupons found. Create your first coupon to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const CouponManagementApp = () => {
  const [view, setView] = useState("list"); // list, detail, create
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const renderView = () => {
    switch (view) {
      case "detail":
        return (
          <CouponTicket
            coupon={selectedCoupon}
            onBack={() => setView("list")}
          />
        );
      case "create":
        return <CreateCouponForm onBack={() => setView("list")} />;
      default:
        return (
          <CouponsList
            onSelectCoupon={(coupon) => {
              setSelectedCoupon(coupon);
              setView("detail");
            }}
            onCreateCoupon={() => setView("create")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderView()}
    </div>
  );
};

export default CouponManagementApp;