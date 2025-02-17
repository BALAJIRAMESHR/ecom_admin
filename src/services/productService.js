import { API_BASE_URL } from '../config/api';

export const productService = {
  getAllProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products/getallproducts`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  addProduct: async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/addproduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }

      return response.json();
    } catch (error) {
      console.error('Product service error details:', error);
      throw error;
    }
  },

  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/getproduct/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  updateProduct: async (id, productData) => {
    console.log("Updating product:", { id, productData });
    
    if (!id) {
      throw new Error("Product ID is required");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/editproduct/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      return response.json();
    } catch (error) {
      console.error('Product service error details:', error);
      throw new Error('Failed to update product');
    }
  },

  getAllCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories/getallcategories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },
};

// Helper function to convert base64 to blob
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
} 