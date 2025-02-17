import { CirclePlus, Edit2, Trash2 } from "lucide-react";
import React from "react";
import { handleImageError, getImageUrl } from '../../../utils/imageUtils';

const CategoryList = ({ categories, onEdit, onDelete, setIsAdding }) => {
  const handleEdit = async (category) => {
    try {
      onEdit(category);
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const handleDelete = async (category) => {
    try {
      if (window.confirm("Are you sure you want to delete this category?")) {
        onDelete(category);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="rounded-lg shadow">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-semibold">Category Management</h1>
        <div
          className="bg-purple-500 px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-600"
          onClick={() => setIsAdding(true)}
        >
          <button className="text-md text-white flex font-medium gap-2 rounded-lg">
            <CirclePlus /> Add Category
          </button>
        </div>
      </div>

      <table className="bg-white w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr className="border-b">
            <th className="px-6 py-4 text-gray-600 font-medium text-left">
              No
            </th>
            <th className="px-6 py-4 text-gray-600 font-medium text-left">
              Category
            </th>
            <th className="px-6 py-4 text-gray-600 font-medium text-left">
              Type
            </th>
            <th className="px-6 py-4 text-gray-600 font-medium text-left">
              Image
            </th>
            <th className="px-6 py-4 text-gray-600 font-medium text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr
              key={category._id}
              className="border-b hover:bg-gray-100"
            >
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">{category.categoryName}</td>
              <td className="px-6 py-4 capitalize">{category.categoryType}</td>
              <td className="px-6 py-4">
                <img
                  src={getImageUrl(category.categotyImage)}
                  alt={category.categoryName}
                  onError={handleImageError}
                  className="w-20 h-20 object-cover rounded"
                />
              </td>
              <td className="px-6 py-4 flex items-center gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
