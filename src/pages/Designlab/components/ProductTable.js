import React, { useState, useEffect } from "react";
import { CirclePlus, MoreVertical, X } from "lucide-react";
import { productService } from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import { variantService } from "../../../services/variantService";
import { API_BASE_URL } from "../../../config/api";
import EditModal from "./EditModal";

const EditProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    _id: product._id,
    productName: product.productName || "",
    productCode: product.productCode || "",
    categoryId: product.categoryId?._id || "",
    categoryName: product.categoryName || "",
    variantName: product.variantName || "",
    description: product.description || "",
    actualPrice: product.actualPrice || product.costPrice || "",
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

  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [tags, setTags] = useState(product.tags || []);
  const [materialCare, setMaterialCare] = useState(
    (product.materialAndCare || "").split(", ").filter(Boolean)
  );
  const [isPriceSame, setIsPriceSame] = useState(
    product.actualPrice === product.sellingPrice
  );

  useEffect(() => {
    fetchCategories();
    fetchVariants();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchVariants = async () => {
    try {
      const data = await variantService.getAllVariants();
      setVariants(data);
    } catch (error) {
      console.error("Failed to fetch variants:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Code
                  </label>
                  <input
                    type="text"
                    name="productCode"
                    value={formData.productCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select Variant</option>
                    {variants.map((variant) => (
                      <option key={variant._id} value={variant.variantName}>
                        {variant.variantName}
                      </option>
                    ))}
                  </select>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Pricing */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saree Size (meters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="sareeSize"
                    value={formData.sareeSize}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blouse Size (meters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="blouseSize"
                    value={formData.blouseSize}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Delete Product</h2>
        <p className="text-gray-600 mb-6">Do you want to delete this order? This action Can't be undone</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewProductDetails = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Images */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
            <div className="grid grid-cols-3 gap-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-8 bg-gray-50 rounded-lg">
                  No images available
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product Name</label>
                    <p className="mt-1 text-gray-900">{product.productName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product Code</label>
                    <p className="mt-1 text-gray-900">{product.productCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="mt-1 text-gray-900">{product.categoryName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Variant</label>
                    <p className="mt-1 text-gray-900">{product.variantName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="mt-1 text-gray-900">{product.description || 'No description available'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cost Price</label>
                    <p className="mt-1 text-gray-900">₹{product.actualPrice || product.costPrice}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Selling Price</label>
                    <p className="mt-1 text-gray-900">₹{product.sellingPrice}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tax</label>
                    <p className="mt-1 text-gray-900">{product.tax}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Stock Quantity</label>
                    <p className="mt-1 text-gray-900">{product.stock} units</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Availability</label>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.availability
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.availability ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Specifications</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Saree Size</label>
                    <p className="mt-1 text-gray-900">{product.sareeSize} meters</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Blouse Size</label>
                    <p className="mt-1 text-gray-900">{product.blouseSize} meters</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Color</label>
                    <p className="mt-1 text-gray-900">{product.color || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tags</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {product.tags && product.tags.length > 0 ? (
                        product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No tags</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Material & Care</label>
                    <p className="mt-1 text-gray-900">{product.materialAndCare || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductTable = ({ setAddForm }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/getallproducts/design`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    if (categoryId) {
      console.log('Selected Category ID:', categoryId);
      console.log('Products:', products);
      
      const filtered = products.filter((product) => {
        return product.categoryId?._id === categoryId || product.categoryId === categoryId;
      });
      
      console.log('Filtered Products:', filtered);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleMenuClick = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
  };

  const handleDelete = async (id) => {
    setProductToDelete(id);
    setActiveMenu(null);
  };

  const confirmDelete = async () => {
    try {
      const updatedProducts = products.filter((product) => product._id !== productToDelete);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      // Update the products list with the new data
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
      
      // Optionally refresh the product list from the server
      await fetchProducts();
      
      setSelectedProduct(null); // Close the edit modal
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.message || "Failed to update product");
    }
  };

  const handleViewDetails = (product) => {
    setViewProduct(product);
    setActiveMenu(null);
  };

  if (selectedProduct) {
    return (
      <EditModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSave={handleUpdate}
      />
    );
  }

  if (isLoading) {
    return <div className="w-full text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden p-4">
      <div className="w-full flex max-sm:flex-col items-center justify-between py-4">
        <div className="flex items-center justify-center gap-10">
          <h1 className="text-2xl font-semibold">Design Lab</h1>

          <div className="flex items-center mt-2 space-y-2 gap-6 text-sm">
            
          </div>
        </div>

        <div
          className="bg-purple-500 px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-600"
          onClick={() => setAddForm(true)}
        >
          <button className="text-md text-white flex font-medium gap-2 rounded-lg">
            <CirclePlus /> Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-8 py-4 text-gray-600 font-medium">No</th>
              <th className="px-6 py-4 text-gray-600 font-medium">
                Product ID
              </th>
              <th className="px-6 py-4 text-gray-600 font-medium">
                Product Name
              </th>
              <th className="px-6 py-4 text-gray-600 font-medium">
               Price
              </th>
             
              <th className="px-6 py-4 text-gray-600 font-medium">GST</th>
            
              <th className="px-6 py-4 text-gray-600 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product._id || product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 text-gray-500">
                  {product.productName}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {product.categoryName}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {product.actualPrice || product.costPrice}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {product.sellingPrice}
                </td>
                {/* <td className="px-6 py-4 text-gray-500">{product.tax} %</td> */}
                {/* <td className="px-6 py-4 text-gray-500">{product.stock}</td> */}
                <td className="px-6 py-4 text-gray-500">
                  <div className="relative">
                    <button
                      onClick={() => handleMenuClick(product._id)}
                      className="hover:bg-gray-100 p-1 rounded-full"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>

                    {activeMenu === product._id && (
                      <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-48 z-50">
                        <button
                          onClick={() => handleEdit(product)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => handleViewDetails(product)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productToDelete && (
        <DeleteConfirmationModal
          onClose={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {viewProduct && (
        <ViewProductDetails
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductTable;
