import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronDown, X, Clock, ArrowLeft } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { categoryService } from "../../../services/categoryService";
import { productService } from "../../../services/productService";

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
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false);
    }
  };

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
                    src={product.images?.[0] || "/placeholder-image.jpg"}
                    alt={product.productName}
                    className="w-12 h-12 object-cover rounded mr-4"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
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

const CouponForm = ({ onClose, onSubmit, onBack }) => {
  const [showProductSelection, setShowProductSelection] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "Percentage",
    typeValue: "",
    timeDuration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    productIds: [],
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.typeValue || !formData.timeDuration) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.type === "Percentage" && (formData.typeValue < 0 || formData.typeValue > 100)) {
      alert("Percentage discount must be between 0 and 100");
      return;
    }

    if (formData.type === "FixedAmount" && formData.typeValue <= 0) {
      alert("Fixed amount discount must be greater than 0");
      return;
    }

    const newCoupon = {
      name: formData.name,
      type: formData.type,
      typeValue: Number(formData.typeValue),
      timeDuration: formData.timeDuration.toISOString(),
      productIds: formData.productIds,
    };

    onSubmit(newCoupon);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Create a coupon</h2>
          <p className="text-sm text-gray-600 mb-6">
            Create discount coupons for your products
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Coupon Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., Summer Sale"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.type === "Percentage"}
                    onChange={() =>
                      setFormData({ ...formData, type: "Percentage", typeValue: "" })
                    }
                    className="mr-2"
                  />
                  Percentage discount (0-100%)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.type === "FixedAmount"}
                    onChange={() =>
                      setFormData({ ...formData, type: "FixedAmount", typeValue: "" })
                    }
                    className="mr-2"
                  />
                  Fixed amount discount (₹)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <div className="relative w-32">
                <input
                  type="number"
                  min="0"
                  max={formData.type === "Percentage" ? "100" : undefined}
                  className="w-full p-2 border rounded-lg"
                  value={formData.typeValue}
                  onChange={(e) =>
                    setFormData({ ...formData, typeValue: e.target.value })
                  }
                  placeholder={formData.type === "Percentage" ? "0-100" : "Amount"}
                />
                <span className="absolute right-3 top-2">
                  {formData.type === "Percentage" ? "%" : "₹"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded-lg"
                min={new Date().toISOString().slice(0, 16)}
                value={formData.timeDuration.toISOString().slice(0, 16)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeDuration: new Date(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Apply to Products
              </label>
              <button
                type="button"
                onClick={() => setShowProductSelection(true)}
                className="flex items-center text-sm text-purple-600 hover:text-purple-700"
              >
                <Plus size={16} className="mr-1" />
                {formData.productIds.length > 0 
                  ? `${formData.productIds.length} products selected`
                  : "Select products"}
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create coupon
              </button>
            </div>
          </div>
        </div>
      </div>

      {showProductSelection && (
        <ProductSelectionPopup
          onClose={() => setShowProductSelection(false)}
          onSelect={(products) => {
            setFormData({ ...formData, productIds: products });
            setShowProductSelection(false);
          }}
        />
      )}
    </div>
  );
};

// Coupon Ticket Component
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
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Valid only during the specified date range</li>
              <li>Cannot be combined with other offers</li>
              <li>One-time use per customer</li>
            </ul>
          </div>
        </div>
      </div>
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

// Main Coupon Management Component
const CouponManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/coupons`);
      const transformedCoupons = response.data.map((coupon) => ({
        id: coupon._id,
        name: coupon.name,
        discount: coupon.type === "Percentage" 
          ? `${Number(coupon.typeValue)}%`
          : `₹${coupon.typeValue}`,
        product: coupon.productIds?.length > 0 
          ? `${coupon.productIds.length} Selected Products`
          : "All Products",
        startDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        endDate: new Date(coupon.timeDuration).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        code: `#UPA${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date(coupon.createdAt).toLocaleString(),
      }));
      setCoupons(transformedCoupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (newCouponData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/coupons`, newCouponData);
      
      const newCoupon = {
        id: response.data._id,
        name: response.data.name,
        discount: response.data.type === 'Percentage' ? 
          `${Number(response.data.typeValue)}%`
          : `₹${response.data.typeValue}`,
        product: response.data.productIds?.length > 0 
          ? `${response.data.productIds.length} Selected Products`
          : "All Products",
        startDate: new Date().toLocaleString("default", { month: "short", day: "numeric" }),
        endDate: new Date(response.data.timeDuration).toLocaleString("default", { month: "short", day: "numeric" }),
        code: generateCouponId(),
        createdAt: getCurrentDateTime(),
      };

      setCoupons(prev => [...prev, newCoupon]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating coupon:', error.response?.data || error.message);
      alert('Failed to create coupon. Please try again.');
    }
  };

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedCoupon) {
    return (
      <CouponTicket
        coupon={selectedCoupon}
        onBack={() => setSelectedCoupon(null)}
      />
    );
  }

  console.log(coupons);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Coupons</h1>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <input
              type="text"
              className="w-full p-2 pl-8 border rounded-lg"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-3 text-gray-400" size={16} />
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <Plus size={20} />
              Create a coupon
            </button>
          )}
        </div>

        {showForm ? (
          <CouponForm
            onClose={() => setShowForm(false)}
            onSubmit={handleAddCoupon}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                {...coupon}
                onClick={() => setSelectedCoupon(coupon)}
              />
            ))}
            {filteredCoupons.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No coupons found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;
