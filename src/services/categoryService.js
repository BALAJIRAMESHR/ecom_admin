import { API_BASE_URL } from "../config/api";

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/allcategory`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Category service error:", error);
      throw error;
    }
  },
};
