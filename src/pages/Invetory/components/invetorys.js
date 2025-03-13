import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Download,
  X,
  Filter,
  ChevronDown,
} from "lucide-react";
import { API_BASE_URL } from "../../../config/api";

// Add Product Modal
// const AddProductModal = ({ onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     quantity: 0,
//     status: "In Stock",
//     category: "Saree",
//     vendor: ""
//   });
//   const [isSaving, setIsSaving] = useState(false);

//   const handleSubmit = async () => {
//     setIsSaving(true);
//     try {
//       await onSave(formData);
//       onClose();
//     } catch (error) {
//       console.error("Failed to save:", error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-[450px] max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Add New Product</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
//               placeholder="Enter product name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
//             <div className="flex border rounded">
//               <button
//                 onClick={() => setFormData({...formData, quantity: Math.max(0, formData.quantity - 1)})}
//                 className="px-4 py-2 hover:bg-gray-100"
//               >
//                 -
//               </button>
//               <input
//                 type="text"
//                 value={formData.quantity}
//                 onChange={(e) => {
//                   const value = parseInt(e.target.value) || 0;
//                   setFormData({...formData, quantity: value});
//                 }}
//                 className="flex-1 text-center focus:outline-none p-2"
//               />
//               <button
//                 onClick={() => setFormData({...formData, quantity: formData.quantity + 1})}
//                 className="px-4 py-2 hover:bg-gray-100"
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               value={formData.status}
//               onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//               className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
//             >
//               <option value="In Stock">In Stock</option>
//               <option value="Out of Stock">Out of Stock</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//             <select
//               value={formData.category}
//               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//               className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
//             >
//               <option value="Saree">Saree</option>
//               <option value="Dress">Dress</option>
//               <option value="Accessories">Accessories</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
//             <input
//               type="text"
//               value={formData.vendor}
//               onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
//               className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
//               placeholder="Enter vendor name"
//             />
//           </div>
//         </div>

//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             disabled={isSaving}
//             className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={isSaving}
//             className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
//           >
//             {isSaving ? "Saving..." : "Add Product"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// Edit Modal with enhanced functionality
const EditModal = ({ product, onClose, onSave }) => {
  console.log(product);
  const [formData, setFormData] = useState({
    name: product.name,
    count: product.count,
    status: product.status,
    category: product.category,
    categoryId: product.categoryId,
    vendor: product.vendor || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  // Add this near the top of your component where other state variables are defined
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {

    const response = await fetch(`${API_BASE_URL}/categories/allcategory`);
    const data = await response.json();
    setCategories(data);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[450px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                const selectedCategory = e.target.value;
                setFormData({ 
                  ...formData, 
                  category: selectedCategory,
                  categoryId: categories.find(cat => cat.categoryName === selectedCategory)._id
                });
                const categoryObj = categories.find(cat => cat.categoryName === selectedCategory);
              }}
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={category._id || index} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Count
            </label>
            <input
              type="number"
              value={formData.count}
              onChange={(e) =>
                setFormData({ ...formData, count: parseInt(e.target.value) })
              }
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <input
              type="text"
              value={formData.vendor}
              onChange={(e) =>
                setFormData({ ...formData, vendor: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Filter Modal Component
const FilterModal = ({ onClose, categories, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    vendor: "",
  });

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      category: "",
      status: "",
      vendor: "",
    });
    onApplyFilters({
      category: "",
      status: "",
      vendor: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter Products</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <input
              type="text"
              value={filters.vendor}
              onChange={(e) =>
                setFilters({ ...filters, vendor: e.target.value })
              }
              placeholder="Filter by vendor"
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirm Delete Modal
const DeleteConfirmModal = ({ product, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Delete Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-6">
          Are you sure you want to delete "{product.name}"? This action cannot
          be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: "",
    status: "",
    vendor: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reference for CSV download link
  const csvLinkRef = useRef(null);

  // Filter products based on search term and active filters - MOVED HERE TO FIX THE REFERENCE ERROR
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory =
      !activeFilters.category || product.category === activeFilters.category;

    // Status filter
    const matchesStatus =
      !activeFilters.status || product.status === activeFilters.status;

    // Vendor filter
    const matchesVendor =
      !activeFilters.vendor ||
      product.vendor.toLowerCase().includes(activeFilters.vendor.toLowerCase());

    return matchesSearch && matchesCategory && matchesStatus && matchesVendor;
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedProducts(filteredProducts.map((product) => product._id));
    } else if (
      selectedProducts.length === filteredProducts.length &&
      filteredProducts.length > 0
    ) {
      // This condition prevents clearing selections when user manually selects all items
      if (!filteredProducts.some((p) => !selectedProducts.includes(p._id))) {
        setSelectedProducts([]);
      }
    }
  }, [selectAll, filteredProducts]);

  // Update selectAll state when individual selections change
  useEffect(() => {
    if (
      filteredProducts.length > 0 &&
      selectedProducts.length === filteredProducts.length
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedProducts, filteredProducts]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/getallproducts`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      const transformedProducts = data.map((product) => ({
        id: product._id,
        name: product.productName,
        category: product.categoryName,
        categoryId: product.categoryId,
        status: product.status,
        count: product.stock,
        vendor: product.vendor || "-------",
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleAddProduct = async (formData) => {
  //   try {
  //     // Create API request
  //     const productData = {
  //       productName: formData.name,
  //       categoryName: formData.category,
  //       stock: formData.quantity,
  //       availability: formData.status === "In Stock",
  //       vendor: formData.vendor
  //     };

  //     const response = await fetch(`${API_BASE_URL}/products/addproduct`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(productData)
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to add product');
  //     }

  //     // Refresh products list after adding
  //     await fetchProducts();
  //   } catch (error) {
  //     console.error("Failed to add product:", error);
  //     alert("Failed to add product. Please try again.");
  //     throw error;
  //   }
  // };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowActionMenu(null);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowActionMenu(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      // API call to delete the product
      const response = await fetch(
        `${API_BASE_URL}/products/editproduct/${productToDelete.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isDeleted: true })
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Update local state after successful API deletion
      const updatedProducts = products.filter(
        (product) => product.id !== productToDelete.id
      );
      setProducts(updatedProducts);

      // Clear selection if the deleted product was selected
      if (selectedProducts.includes(productToDelete.id)) {
        setSelectedProducts(
          selectedProducts.filter((id) => id !== productToDelete.id)
        );
      }

      // Optionally, refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleSave = async (updatedData) => {
    try {
      const productUpdateData = {
        productName: updatedData.name,
        categoryName: updatedData.category,
        categoryId: updatedData.categoryId,
        stock: updatedData.count,
        availability: updatedData.status === "In Stock",
        status: updatedData.status,
        vendor: updatedData.vendor,
      };

      // Make API call to update the product
      const response = await fetch(
        `${API_BASE_URL}/products/editproduct/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productUpdateData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      // Update local state only after successful API update
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id
          ? { ...product, ...updatedData }
          : product
      );

      setProducts(updatedProducts);
      setEditingProduct(null);

      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  // Handle selection of a single product
  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  // Export selected products to CSV
  const exportToCSV = () => {
    const productsToExport =
      selectedProducts.length > 0
        ? filteredProducts.filter((product) =>
            selectedProducts.includes(product.id)
          )
        : filteredProducts;

    // Create CSV content
    const headers = [
      "Product ID",
      "Product Name",
      "Category",
      "Status",
      "Count",
      "Vendor",
    ];
    let csvContent = headers.join(",") + "\n";

    productsToExport.forEach((product) => {
      const row = [
        product.id,
        `"${product.name.replace(/"/g, '""')}"`, // Escape quotes in CSV
        `"${product.category.replace(/"/g, '""')}"`,
        product.status,
        product.count,
        `"${product.vendor.replace(/"/g, '""')}"`,
      ];
      csvContent += row.join(",") + "\n";
    });

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create link and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Apply filters
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map((product) => product.category))];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-6  min-h-screen">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search products, categories, vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              <Filter size={16} />
              Filter
              {(activeFilters.category ||
                activeFilters.status ||
                activeFilters.vendor) && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-purple-800">
                  {Object.values(activeFilters).filter(Boolean).length}
                </span>
              )}
            </button>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              <Download size={16} />
              Export as CSV
            </button>

            {/* <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              <Plus size={16} />
              Add Product
            </button> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-purple-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading inventory data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p className="text-xl font-semibold">{error}</p>
              <p className="mt-2">Please try refreshing the page</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-y">
                <tr>
                  <th className="w-8 p-4">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="p-4 text-left">Product ID</th>
                  <th className="p-4 text-left">Product Name</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Count</th>
                  <th className="p-4 text-left">Vendor</th>
                  <th className="w-8 p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">
                      {searchTerm ||
                      activeFilters.category ||
                      activeFilters.status ||
                      activeFilters.vendor
                        ? "No products match your search or filters"
                        : "No products found in the inventory"}
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(item.id)}
                          onChange={() => handleSelectProduct(item.id)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="p-4 text-gray-600">{item.id}</td>
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4">{item.category}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            item.status === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded ${
                            item.count > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.count}
                        </span>
                      </td>
                      <td className="p-4">{item.vendor}</td>
                      <td className="p-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowActionMenu(
                                showActionMenu === item.id ? null : item.id
                              )
                            }
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <MoreVertical size={16} />
                          </button>
                          {showActionMenu === item.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 border">
                              <button
                                onClick={() => handleEdit(item)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Edit size={16} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && filteredProducts.length > 0 && (
          <div className="p-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
              {filteredProducts.length} items
              {selectedProducts.length > 0 &&
                ` (${selectedProducts.length} selected)`}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-purple-600 text-white"
                      : "border hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* {showAddModal && (
        <AddProductModal 
          onClose={() => setShowAddModal(false)} 
          onSave={handleAddProduct} 
        />
      )} */}

      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}

      {productToDelete && (
        <DeleteConfirmModal
          product={productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          categories={categories}
          onApplyFilters={handleApplyFilters}
        />
      )}
    </div>
  );
};

export default InventoryManagement;
