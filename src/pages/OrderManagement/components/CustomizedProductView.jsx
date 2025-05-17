import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Default t-shirt images
const defaultImages = {
  front: '/assets/one.png',
  back: '/assets/two.png',
  rightSleeve: '/assets/three.png',
  leftSleeve: '/assets/four.png'
};

// Placement zones (must match the customizer)
const placementZones = {
  front: {
    leftChest: { x: 60, y: 40, width: 100, height: 100 },
    center: { x: 50, y: 60, width: 175, height: 200 }
  },
  back: {
    center: { x: 50, y: 50, width: 160, height: 160 }
  },
  rightSleeve: {
    text: { x: 42, y: 50, width: 110, height: 50 }
  },
  leftSleeve: {
    text: { x: 62, y: 50, width: 110, height: 50 }
  }
};

const CustomizedProductView = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('front');

  // Safely get product images with defaults for now use default images
  const productViews = {
    'front': defaultImages.front,
    'back': defaultImages.back,
    'rightSleeve': defaultImages.rightSleeve,
    'leftSleeve': defaultImages.leftSleeve
  };

  // Safely get product designs
  const getDesigns = () => {
    if (!product?.customizationDetails?.designs) return {};
    return product.customizationDetails.designs;
  };

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 p-5">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose || (() => navigate(-1))}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Customized Product View</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600">No product data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onClose || (() => navigate(-1))}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Customized Product View</h1>
      </div>

      <div className="flex bg-gray-200">
        {/* Left sidebar thumbnails */}
        <div className="w-24 bg-white border-r">
          {Object.entries(productViews).map(([view, url]) => (
            <div 
              key={view} 
              className={`cursor-pointer p-2 relative group ${
                selectedView === view 
                  ? 'border-2 border-purple-500 bg-purple-50' 
                  : 'border border-gray-200 hover:border-purple-300'
              } m-2 rounded-md transition-all duration-200`}
              onClick={() => setSelectedView(view)}
            >
              <img 
                src={url} 
                alt={`${view} view`} 
                className="w-full transition-transform duration-200 group-hover:scale-105"
                style={{
                  filter: product?.customizationDetails?.color === 'white' ? 'none' : 
                          product?.customizationDetails?.color === 'black' ? 'brightness(0) saturate(100%)' :
                          product?.customizationDetails?.color === 'red' ? 'hue-rotate(0deg) saturate(200%) brightness(0.8)' :
                          product?.customizationDetails?.color === 'blue' ? 'hue-rotate(200deg) saturate(150%)' :
                          'hue-rotate(100deg) saturate(150%)'
                }}
              />
              <div className="text-xs text-center mt-1 capitalize font-medium">
                {view}
              </div>
            </div>
          ))}
        </div>

        {/* Main product view */}
        <div className="flex-1 flex items-center justify-center p-4 relative bg-white">
          {/* Fixed size t-shirt preview area */}
          <div
            className="relative mx-auto"
            style={{ width: 350, height: 450 }}
          >
            <img 
              src={productViews[selectedView]} 
              alt="T-shirt preview" 
              className="w-full h-full object-contain transition-all duration-300"
              style={{
                filter: product?.customizationDetails?.color === 'white' ? 'none' : 
                        product?.customizationDetails?.color === 'black' ? 'brightness(0) saturate(100%)' :
                        product?.customizationDetails?.color === 'red' ? 'hue-rotate(0deg) saturate(200%) brightness(0.8)' :
                        product?.customizationDetails?.color === 'blue' ? 'hue-rotate(200deg) saturate(150%)' :
                        'hue-rotate(100deg) saturate(150%)'
              }}
            />
            {/* Render designs for the selected view using placementZones */}
            {Object.entries(getDesigns()[selectedView] || {}).map(([zone, design]) => {
              if (!design) return null;
              const zoneDef = placementZones[selectedView]?.[zone];
              if (!zoneDef) return null;
              const { x, y, width, height } = zoneDef;
              if (design.type === 'text') {
                return (
                  <div
                    key={zone}
                    style={{
                      ...design.style,
                      position: 'absolute',
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${width}px`,
                      height: `${height}px`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    {design.content}
                  </div>
                );
              }
              if (design.type === 'image') {
                return (
                  <div
                    key={zone}
                    style={{
                      position: 'absolute',
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${width}px`,
                      height: `${height}px`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                      pointerEvents: 'none',
                    }}
                  >
                    <img
                      src={design.content}
                      alt="Design"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>
                );
              }
              return null;
            })}
            {/* View indicator */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} View
            </div>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="bg-white p-4 mt-4 rounded-lg">
        <h2 className="text-xl font-medium mb-4">Customized T-shirt Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Color</p>
            <p className="font-medium capitalize">{product?.customizationDetails?.color || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Price</p>
            <p className="font-medium">₹{product?.price || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizedProductView; 