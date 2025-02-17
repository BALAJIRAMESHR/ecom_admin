import placeholderImage from '../assets/images/placeholder-image.jpg';

export const handleImageError = (e) => {
  e.target.src = placeholderImage;
  e.target.onerror = null; // Prevent infinite loop
};

export const getImageUrl = (url) => {
  return url || placeholderImage;
}; 