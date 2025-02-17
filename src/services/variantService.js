import { API_BASE_URL } from '../config/api';

export const variantService = {
  getAllVariants: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/variants/getallvariants`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Variant service error:', error);
      throw error;
    }
  },

  addVariant: async (variantData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/variants/addvariant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variantData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add variant');
      }
      return response.json();
    } catch (error) {
      console.error('Variant service error:', error);
      throw error;
    }
  },
}; 