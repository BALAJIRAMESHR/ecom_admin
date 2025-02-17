import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const BannerAndOfferUpdate = () => {
  const [banners, setBanners] = useState([]);
  const [savedBanners, setSavedBanners] = useState([]);
  const [content, setContent] = useState('');
  const [contentList, setContentList] = useState([]);
  const [editingContentId, setEditingContentId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showBannerDeleteConfirm, setShowBannerDeleteConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchContent();
    fetchBanners();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/getallcontents`);
      const data = await response.json();
      setContentList(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing`);
      const data = await response.json();
      setSavedBanners(data.filter(banner => !banner.isDeleted));
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('file', file);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/upload',
      headers: {
        'Authorization': 'QuindlTokPATFileUpload2025#$$TerOiu$',
        'Content-Type': 'multipart/form-data'
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      console.log('Image uploaded:', response.data);
      return response.data.filePath; // Assuming the API response contains the file path in `data.filePath`
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const uploadedUrl = await uploadImage(file);
      
      setBanners(prevBanners => [...prevBanners, {
        id: Date.now(),
        image: previewUrl,
        url: uploadedUrl || ''
      }]);
    }
  };

  const handleRemoveBanner = (bannerId) => {
    setBanners(prevBanners => prevBanners.filter(banner => banner.id !== bannerId));
  };

  const handleAddContent = async () => {
    if (content.trim()) {
      try {
        const response = await fetch(`${API_BASE_URL}/marketing/addcontent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: content.trim() }),
        });

        if (response.ok) {
          await fetchContent(); // Refresh the content list
          setContent('');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to add content');
        }
      } catch (error) {
        console.error('Error adding content:', error);
        alert('Failed to add content');
      }
    }
  };

  const handleRemoveContent = async (indexToRemove) => {
    try {
      // Since we don't have a delete endpoint, we'll mark it as deleted using edit
      const response = await fetch(`${API_BASE_URL}/marketing/editcontent/${editingContentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDeleted: true }),
      });

      if (response.ok) {
        await fetchContent(); // Refresh the content list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove content');
      }
    } catch (error) {
      console.error('Error removing content:', error);
      alert('Failed to remove content');
    }
  };

  const handleDeleteClick = (content) => {
    setContentToDelete(content);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (contentToDelete) {
      await handleRemoveContent(contentToDelete._id);
      setShowDeleteConfirm(false);
      setContentToDelete(null);
    }
  };

  const handleBannerDeleteClick = (banner) => {
    setBannerToDelete(banner);
    setShowBannerDeleteConfirm(true);
  };

  const confirmBannerDelete = async () => {
    if (bannerToDelete) {
      await handleDeleteBanner(bannerToDelete._id);
      setShowBannerDeleteConfirm(false);
      setBannerToDelete(null);
      showToastMessage('Banner deleted successfully');
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveBanner = async (banner) => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'QuindlTokPATFileUpload2025#$$TerOiu$'
        },
        body: JSON.stringify({ imageUrls: banner.url }),
      });

      if (response.ok) {
        setBanners(prevBanners => prevBanners.filter(b => b.id !== banner.id));
        await fetchBanners();
        showToastMessage('Banner uploaded successfully!');
      } else {
        const error = await response.json();
        showToastMessage(error.error || 'Failed to save banner');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      showToastMessage('Failed to save banner');
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/${bannerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'QuindlTokPATFileUpload2025#$$TerOiu$'
        },
        body: JSON.stringify({ isDeleted: true }),
      });

      if (response.ok) {
        await fetchBanners(); // Refresh the banners list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Banner Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Banner Management</h2>
        
        {/* Upload Section */}
        <div className="mb-8">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 
                       cursor-pointer h-40 transition-all duration-300 hover:border-purple-400 hover:bg-gray-100 relative"
            onClick={() => document.getElementById('bannerUpload').click()}
          >
            <div className="flex flex-col items-center p-4">
              <svg className="w-8 h-8 text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div className="text-gray-700 font-medium text-sm mb-1">Upload Banner</div>
              <div className="text-gray-400 text-xs">JPG, PNG up to 5MB</div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              id="bannerUpload" 
              className="hidden" 
              onChange={handleBannerUpload}
            />
          </div>
        </div>

        {/* Selected Banner Preview */}
        {banners.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Selected Banners</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {banners.map((banner) => (
                <div key={banner.id} className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src={banner.image} 
                        alt="Banner Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button 
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 
                                flex items-center justify-center opacity-0 group-hover:opacity-100 
                                transition-all duration-200 hover:bg-red-600 shadow-sm"
                      onClick={() => handleRemoveBanner(banner.id)}
                    >
                      <span className="text-lg leading-none">&times;</span>
                    </button>
                  </div>
                  <div className="p-3">
                    <button 
                      className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 
                                transition-all duration-200 text-sm font-medium
                                flex items-center justify-center space-x-2"
                      onClick={() => handleSaveBanner(banner)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>Save Banner</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Banners Section */}
        {savedBanners.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Saved Banners</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {savedBanners.map((banner) => (
                <div key={banner._id} className="relative group">
                  <div className="relative overflow-hidden rounded-lg shadow-sm">
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src={banner.imageUrls}
                        alt="Saved Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button 
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 
                                 flex items-center justify-center opacity-0 group-hover:opacity-100 
                                 transition-opacity duration-200 hover:bg-red-600"
                      onClick={() => handleBannerDeleteClick(banner)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Site & Offer Update</h2>
        <div className="flex items-center space-x-4">
          <input 
            type="text" 
            placeholder="Enter content here" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500" 
          />
          <button className="bg-purple-500 text-white px-4 py-2 rounded-md" onClick={handleAddContent}>
            Add Content
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {contentList.map((item) => (
            <div key={item._id} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
              <span>{item.content}</span>
              <button 
                className="text-red-500 hover:text-red-700" 
                onClick={() => handleDeleteClick(item)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button className="bg-purple-500 text-white w-1/2 py-3 rounded-md">
            Update
          </button>
        </div>
      </div>

      {/* Add the confirmation popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this content?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setContentToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add the banner delete confirmation popup */}
      {showBannerDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Banner</h3>
            <p className="mb-6">Are you sure you want to delete this banner?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setShowBannerDeleteConfirm(false);
                  setBannerToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={confirmBannerDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50">
          <div className="flex items-center space-x-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerAndOfferUpdate;