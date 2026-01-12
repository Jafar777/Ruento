// app/admin/dashboard/get-to-know-russia/page.jsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import Navbar from '../../../components/Navbar';
import { FaArrowLeft, FaPlus, FaTrash, FaSave, FaImage, FaUpload, FaBed, FaStar, FaMapMarkerAlt, FaPhone, FaWhatsapp, FaDollarSign } from 'react-icons/fa';

const RussiaCategoriesManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState({
    restaurants: { items: [] },
    touristAttractions: { items: [] },
    events: { items: [] },
    shopping: { items: [] },
    museums: { items: [] },
    naturalPlaces: { items: [] },
    hotels: { items: [] }
  });
  const [activeCategory, setActiveCategory] = useState('hotels');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { translations } = useLanguage();
  const router = useRouter();

  // Common hotel amenities with icons
  const commonAmenities = [
    { value: 'free-wifi', label: 'Free WiFi', icon: '📶' },
    { value: 'swimming-pool', label: 'Swimming Pool', icon: '🏊' },
    { value: 'spa', label: 'Spa', icon: '💆' },
    { value: 'fitness-center', label: 'Fitness Center', icon: '💪' },
    { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
    { value: 'parking', label: 'Free Parking', icon: '🅿️' },
    { value: 'pet-friendly', label: 'Pet Friendly', icon: '🐕' },
    { value: 'air-conditioning', label: 'Air Conditioning', icon: '❄️' },
    { value: 'tv', label: 'TV', icon: '📺' },
    { value: 'breakfast', label: 'Free Breakfast', icon: '🍳' },
    { value: 'concierge', label: '24/7 Concierge', icon: '🛎️' },
    { value: 'room-service', label: 'Room Service', icon: '🚪' },
    { value: 'bar', label: 'Bar/Lounge', icon: '🍸' },
    { value: 'business-center', label: 'Business Center', icon: '💼' },
    { value: 'laundry', label: 'Laundry Service', icon: '👕' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchCategories();
    }
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/get-to-know-russia');
      const data = await response.json();
      
      if (data && data.length > 0) {
        const categoriesData = {};
        data.forEach(category => {
          categoriesData[category.type] = {
            items: category.items || []
          };
        });
        setCategories(prev => ({ ...prev, ...categoriesData }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('Error loading categories data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, category) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/get-to-know-russia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: category,
          items: categories[category].items
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`${translations[category] || category} updated successfully!`);
      } else {
        setMessage(data.message || `Error updating ${category}`);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setMessage(`Error updating ${category}`);
    } finally {
      setSaving(false);
    }
  };

const addItem = (category) => {
  setCategories(prev => ({
    ...prev,
    [category]: {
      items: [
        ...prev[category].items,
        {
          id: `${category}-${prev[category].items.length}-${Date.now()}`,
          title: '',
          description: '',
          ...(category === 'hotels' ? {
            address: '',
            phone: '',
            whatsapp: '', // Changed from website to whatsapp
            priceStartsFrom: '',
            rating: '',
            amenities: [],
          } : {}),
          images: [],
          features: []
        }
      ]
    }
  }));
};

  const removeItem = (category, index) => {
    setCategories(prev => ({
      ...prev,
      [category]: {
        items: prev[category].items.filter((_, i) => i !== index)
      }
    }));
  };

  const updateItem = (category, index, field, value) => {
    setCategories(prev => {
      const newItems = [...prev[category].items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      
      return {
        ...prev,
        [category]: {
          items: newItems
        }
      };
    });
  };

  const toggleHotelAmenity = (category, itemIndex, amenity) => {
    if (category !== 'hotels') return;
    
    setCategories(prev => {
      const newItems = [...prev[category].items];
      const currentAmenities = newItems[itemIndex].amenities || [];
      
      if (currentAmenities.includes(amenity)) {
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          amenities: currentAmenities.filter(a => a !== amenity)
        };
      } else {
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          amenities: [...currentAmenities, amenity]
        };
      }
      
      return {
        ...prev,
        [category]: {
          items: newItems
        }
      };
    });
  };

  const addCustomAmenity = (category, itemIndex, value) => {
    if (category !== 'hotels' || !value.trim()) return;
    
    setCategories(prev => {
      const newItems = [...prev[category].items];
      const currentAmenities = newItems[itemIndex].amenities || [];
      
      if (!currentAmenities.includes(value.trim())) {
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          amenities: [...currentAmenities, value.trim()]
        };
      }
      
      return {
        ...prev,
        [category]: {
          items: newItems
        }
      };
    });
  };

  const addImage = async (category, itemIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      if (data.secure_url) {
        setCategories(prev => {
          const newItems = [...prev[category].items];
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            images: [
              ...(newItems[itemIndex].images || []),
              {
                url: data.secure_url,
                title: '',
                description: ''
              }
            ]
          };
          
          return {
            ...prev,
            [category]: {
              items: newItems
            }
          };
        });
        setMessage('Image uploaded successfully!');
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    }
  };

  const removeImage = (category, itemIndex, imageIndex) => {
    setCategories(prev => {
      const newItems = [...prev[category].items];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        images: newItems[itemIndex].images.filter((_, i) => i !== imageIndex)
      };
      
      return {
        ...prev,
        [category]: {
          items: newItems
        }
      };
    });
  };

  const updateImage = (category, itemIndex, imageIndex, field, value) => {
    setCategories(prev => {
      const newItems = [...prev[category].items];
      const newImages = [...newItems[itemIndex].images];
      newImages[imageIndex] = {
        ...newImages[imageIndex],
        [field]: value
      };
      
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        images: newImages
      };
      
      return {
        ...prev,
        [category]: {
          items: newItems
        }
      };
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

const categoryTypes = [
  { key: 'restaurants', title: translations.restaurants || 'Restaurants', icon: '🍽️' },
  { key: 'touristAttractions', title: translations.touristAttractions || 'Tourist Attractions', icon: '🏛️' },
  { key: 'events', title: translations.events || 'Events', icon: '🎪' },
  { key: 'shopping', title: translations.shopping || 'Shopping', icon: '🛍️' },
  { key: 'museums', title: translations.museums || 'Museums', icon: '🏛️' },
  { key: 'naturalPlaces', title: translations.naturalPlaces || 'Natural Places', icon: '🏞️' },
  { key: 'hotels', title: translations.hotels || 'Hotels', icon: '🏨' }
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 text-white ">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 transition duration-200 mr-4"
              >
                <FaArrowLeft />
              </button>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {translations.getToKnowRussia || 'Get to Know Russia'}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
            >
              {translations.logout}
            </button>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-md ${message.includes('success') ? 'bg-green-800' : 'bg-red-800'}`}>
              {message}
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categoryTypes.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category.key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.title}
              </button>
            ))}
          </div>

          {/* Category Content */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {categoryTypes.find(c => c.key === activeCategory)?.title}
              </h2>
              <button
                onClick={() => addItem(activeCategory)}
                className="bg-green-600 text-white py-2 px-4 rounded-md flex items-center hover:bg-green-700 transition"
              >
                <FaPlus className="mr-2" />
                {translations.addItem || 'Add Item'}
              </button>
            </div>

            {categories[activeCategory].items.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                {translations.noItems || 'No items added yet. Click "Add Item" to get started.'}
              </p>
            ) : (
              <div className="space-y-8">
                {categories[activeCategory].items.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">
                        {translations.item || 'Item'} {itemIndex + 1}
                      </h3>
                      <button
                        onClick={() => removeItem(activeCategory, itemIndex)}
                        className="text-red-500 hover:text-red-600 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Special form for hotels */}
                    {activeCategory === 'hotels' ? (
                      <div className="space-y-6">
                        {/* Hotel Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className=" text-sm font-medium mb-2 flex items-center">
                              <FaBed className="mr-2" />
                              {translations.hotelName || 'Hotel Name'}
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateItem(activeCategory, itemIndex, 'title', e.target.value)}
                              className="w-full p-3 bg-gray-700 rounded-md text-white"
                              placeholder="Enter hotel name"
                            />
                          </div>

                          <div>
                            <label className=" text-sm font-medium mb-2 flex items-center">
                              <FaStar className="mr-2" />
                              {translations.rating || 'Rating'}
                            </label>
                            <select
                              value={item.rating}
                              onChange={(e) => updateItem(activeCategory, itemIndex, 'rating', e.target.value)}
                              className="w-full p-3 bg-gray-700 rounded-md text-white"
                            >
                              <option value="">Select rating</option>
                              <option value="5">★★★★★ (5 Stars)</option>
                              <option value="4">★★★★ (4 Stars)</option>
                              <option value="3">★★★ (3 Stars)</option>
                              <option value="2">★★ (2 Stars)</option>
                              <option value="1">★ (1 Star)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className=" text-sm font-medium mb-2 flex items-center">
                              <FaMapMarkerAlt className="mr-2" />
                              {translations.address || 'Address'}
                            </label>
                            <input
                              type="text"
                              value={item.address}
                              onChange={(e) => updateItem(activeCategory, itemIndex, 'address', e.target.value)}
                              className="w-full p-3 bg-gray-700 rounded-md text-white"
                              placeholder="Enter hotel address"
                            />
                          </div>

                          <div>
                            <label className=" text-sm font-medium mb-2 flex items-center">
                              <FaPhone className="mr-2" />
                              {translations.phone || 'Phone'}
                            </label>
                            <input
                              type="text"
                              value={item.phone}
                              onChange={(e) => updateItem(activeCategory, itemIndex, 'phone', e.target.value)}
                              className="w-full p-3 bg-gray-700 rounded-md text-white"
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className=" text-sm font-medium mb-2 flex items-center">
                              <FaWhatsapp className="mr-2" />
                              {translations.whatsapp || 'WhatsApp'}
                            </label>
                            <input
                              type="text"
                              value={item.whatsapp}
                              onChange={(e) => updateItem(activeCategory, itemIndex, 'whatsapp', e.target.value)}
                              className="w-full p-3 bg-gray-700 rounded-md text-white"
                              placeholder="+1234567890"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              {translations.whatsappDesc || 'Enter WhatsApp number with country code (e.g., +1234567890)'}
                            </p>
                          </div>

                          <div>
                            <label className=" text-sm font-medium mb-2 flex items-center">
                              <FaDollarSign className="mr-2" />
                              {translations.priceStartsFrom || 'Price Starts From'}
                            </label>
                            <div className="flex">
                              <span className="p-3 bg-gray-600 rounded-l-md border-r border-gray-500 flex items-center">
                                $
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={item.priceStartsFrom || ''}
                                onChange={(e) => updateItem(activeCategory, itemIndex, 'priceStartsFrom', e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded-r-md text-white"
                                placeholder="299"
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {translations.priceStartsFromDesc || 'Enter the starting price per night (in USD)'}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {translations.description || 'Description'}
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) => updateItem(activeCategory, itemIndex, 'description', e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-md text-white"
                            rows={4}
                            placeholder="Enter hotel description, facilities, and special features"
                          />
                        </div>

                        {/* Hotel Amenities */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium">
                              {translations.amenities || 'Amenities'}
                            </label>
                            <span className="text-xs text-gray-400">
                              {(item.amenities || []).length} selected
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                            {commonAmenities.map((amenity) => (
                              <label key={amenity.value} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded">
                                <input
                                  type="checkbox"
                                  checked={(item.amenities || []).includes(amenity.value)}
                                  onChange={() => toggleHotelAmenity(activeCategory, itemIndex, amenity.value)}
                                  className="rounded bg-gray-700 border-gray-600"
                                />
                                <span className="flex items-center text-sm">
                                  <span className="mr-2 text-lg">{amenity.icon}</span>
                                  {amenity.label}
                                </span>
                              </label>
                            ))}
                          </div>

                          {/* Custom Amenities */}
                          <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">
                              Add Custom Amenity
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                id={`custom-amenity-${itemIndex}`}
                                className="flex-1 p-2 bg-gray-700 rounded-md text-white"
                                placeholder="e.g., Rooftop Bar, Conference Room, etc."
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById(`custom-amenity-${itemIndex}`);
                                  addCustomAmenity(activeCategory, itemIndex, input.value);
                                  input.value = '';
                                }}
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                              >
                                Add
                              </button>
                            </div>
                          </div>

                          {/* Selected Amenities Display */}
                          {(item.amenities || []).length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-2">Selected Amenities:</p>
                              <div className="flex flex-wrap gap-2">
                                {(item.amenities || []).map((amenity, index) => {
                                  const commonAmenity = commonAmenities.find(a => a.value === amenity);
                                  return (
                                    <span
                                      key={index}
                                      className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
                                    >
                                      {commonAmenity ? (
                                        <>
                                          <span className="mr-1">{commonAmenity.icon}</span>
                                          {commonAmenity.label}
                                        </>
                                      ) : (
                                        amenity
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => toggleHotelAmenity(activeCategory, itemIndex, amenity)}
                                        className="ml-2 hover:text-red-300"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Standard form for other categories */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {translations.title || 'Title'}
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateItem(activeCategory, itemIndex, 'title', e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-md text-white"
                            placeholder="Enter title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {translations.description || 'Description'}
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) => updateItem(activeCategory, itemIndex, 'description', e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-md text-white"
                            rows={3}
                            placeholder="Enter description"
                          />
                        </div>
                      </div>
                    )}

                    {/* Images Section - Common for all categories */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        {translations.images || 'Images'}
                      </label>
                      
                      <label className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700 transition w-fit mb-4">
                        <FaUpload className="mr-2" />
                        {translations.uploadImage || 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => addImage(activeCategory, itemIndex, e)}
                          className="hidden"
                        />
                      </label>

                      {item.images && item.images.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {item.images.map((image, imageIndex) => (
                            <div key={imageIndex} className="bg-gray-700 rounded-lg p-4 relative">
                              <button
                                onClick={() => removeImage(activeCategory, itemIndex, imageIndex)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                              >
                                <FaTrash size={14} />
                              </button>
                              
                              <img 
                                src={image.url} 
                                alt="Preview" 
                                className="w-full h-40 object-cover rounded-md mb-3"
                              />
                              
                              <input
                                type="text"
                                value={image.title}
                                onChange={(e) => updateImage(activeCategory, itemIndex, imageIndex, 'title', e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded-md text-white mb-2"
                                placeholder="Image title"
                              />
                              
                              <textarea
                                value={image.description}
                                onChange={(e) => updateImage(activeCategory, itemIndex, imageIndex, 'description', e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded-md text-white"
                                rows={2}
                                placeholder="Image description"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={(e) => handleSubmit(e, activeCategory)}
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-md font-semibold flex items-center hover:from-blue-600 hover:to-purple-700 transition duration-300 disabled:opacity-50 mt-6"
            >
              <FaSave className="mr-2" />
              {saving ? translations.saving || 'Saving...' : translations.save || 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RussiaCategoriesManager;