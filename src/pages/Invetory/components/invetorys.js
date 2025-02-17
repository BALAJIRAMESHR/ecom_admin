import React, { useState, useEffect } from "react";
import { Search, MoreVertical, Plus, Edit, Trash2 } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";

const EditModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    count: product.count,
    status: product.status
  });
  const [isSaving, setIsSaving] = useState(false);

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
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Edit Inventory</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <p className="text-gray-900">{product.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <p className="text-gray-900">{product.category}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Count</label>
            <input
              type="number"
              value={formData.count}
              onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="In stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
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

const InventoryManagement = () => {
  const [view, setView] = useState("list");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 0,
    status: "In Stock",
    category: "Saree",
    vendor: ""
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/getallproducts`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      const transformedProducts = data.map(product => ({
        id: product._id,
        name: product.productName,
        category: product.categoryName,
        status: product.stock > 0 ? "In stock" : "Out of Stock",
        count: product.stock,
        vendor: product.vendor || "-------"
      }));
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    const newProductEntry = {
      id: `#${Math.floor(100000 + Math.random() * 900000)}`,
      name: newProduct.name,
      category: newProduct.category,
      status: newProduct.status,
      count: newProduct.quantity,
      vendor: newProduct.vendor
    };

    setProducts([...products, newProductEntry]);
    setView("list");
    
    // Reset new product form
    setNewProduct({
      name: "",
      quantity: 0,
      status: "In Stock",
      category: "Saree",
      vendor: ""
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowActionMenu(null);
  };

  const handleSave = async (updatedData) => {
    try {
      // Prepare the data for the API
      const productUpdateData = {
        stock: updatedData.count,
        // If status is "In stock", set availability to true, otherwise false
        availability: updatedData.status === "In stock"
      };

      // Make API call to update the product
      const response = await fetch(`${API_BASE_URL}/products/editproduct/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productUpdateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Update local state only after successful API update
      const updatedProducts = products.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...updatedData }
          : product
      );
      
      setProducts(updatedProducts);
      setEditingProduct(null);

      // Optionally, refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error("Failed to update product:", error);
      // You might want to show an error message to the user
      alert("Failed to update product. Please try again.");
    }
  };

  const ListViewComponent = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <div className="flex-1 relative mr-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700">
              Export as CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-y">
                <tr>
                  <th className="w-8 p-4">
                    <input type="checkbox" />
                  </th>
                  <th className="p-4 text-left">Product ID</th>
                  <th className="p-4 text-left">Product Name</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Count</th>
                  <th className="w-8 p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">
                      <input type="checkbox" />
                    </td>
                    <td className="p-4">{item.id}</td>
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded ${
                          item.status === "In stock"
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
                          item.count > 0 ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {item.count}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === item.id ? null : item.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {showActionMenu === item.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                            <div className="py-1">
                              <button
                                onClick={() => handleEdit(item)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit size={16} className="mr-2" /> Edit
                              </button>
                              <button
                                onClick={() => {/* Add delete handler */}}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash2 size={16} className="mr-2" /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 flex items-center justify-between">
          <div>Showing 1 to {products.length} of {products.length} entries</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border rounded bg-purple-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );

  const ManageInventoryComponent = () => (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-start">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Manage Inventory
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1">Enter Product Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block mb-1">Enter quantity to add</label>
            <div className="flex border rounded">
              <button 
                onClick={() => setNewProduct({...newProduct, quantity: Math.max(0, newProduct.quantity - 1)})}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="text"
                value={newProduct.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setNewProduct({...newProduct, quantity: value});
                }}
                className="flex-1 text-center focus:outline-none"
              />
              <button 
                onClick={() => setNewProduct({...newProduct, quantity: newProduct.quantity + 1})}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">Select Status</label>
            <select 
              value={newProduct.status}
              onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Select product Category</label>
            <select 
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>Saree</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Enter vendor name</label>
            <input
              type="text"
              value={newProduct.vendor}
              onChange={(e) => setNewProduct({...newProduct, vendor: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button 
            onClick={handleAddProduct}
            className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}
      {view === "list" ? <ListViewComponent /> : <ManageInventoryComponent />}
    </div>
  );
};

export default InventoryManagement;