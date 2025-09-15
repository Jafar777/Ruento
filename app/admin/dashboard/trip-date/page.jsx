// app/admin/dashboard/trip-date/page.jsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import Navbar from '../../../components/Navbar';

const TripDateEditor = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tripDate, setTripDate] = useState({
    date: '',
    places: '',
    images: [],
    description: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { translations } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchTripDate();
    }
  }, [router]);

  const fetchTripDate = async () => {
    try {
      const response = await fetch('/api/trip-date');
      const data = await response.json();
      
      if (data) {
        setTripDate({
          date: data.date || '',
          places: Array.isArray(data.places) ? data.places.join(', ') : data.places || '',
          images: data.images || [],
          description: data.description || ''
        });
      }
    } catch (error) {
      console.error('Error fetching trip date:', error);
      setMessage('Error loading trip date data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
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
        return data.secure_url;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      let imageUrls = [...tripDate.images];
      
      // Upload new image if selected
      if (newImage) {
        const imageUrl = await uploadImageToCloudinary(newImage);
        if (imageUrl) {
          imageUrls.push(imageUrl);
        }
      }

      const response = await fetch('/api/trip-date', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: tripDate.date,
          places: tripDate.places.split(',').map(place => place.trim()).filter(place => place),
          images: imageUrls,
          description: tripDate.description
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Trip date updated successfully!');
        setNewImage(null);
        setImagePreview(null);
        // Refresh data to show updated images
        fetchTripDate();
      } else {
        setMessage(data.message || 'Error updating trip date');
      }
    } catch (error) {
      console.error('Error updating trip date:', error);
      setMessage('Error updating trip date');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripDate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const removeImage = (index) => {
    const updatedImages = [...tripDate.images];
    updatedImages.splice(index, 1);
    setTripDate(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 text-white ">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Edit Next Trip Date
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
              >
                {translations.logout}
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-md ${message.includes('success') ? 'bg-green-800' : 'bg-red-800'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 text-gray-800 mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Trip Date</label>
              <input
                type="date"
                name="date"
                value={tripDate.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Places (comma separated)</label>
              <textarea
                name="places"
                value={tripDate.places}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                required
                placeholder="Moscow, Saint Petersburg, Sochi"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={tripDate.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={5}
                required
                placeholder="Describe the trip details, activities, etc."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Upload New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Image Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-40 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Trip Date'}
            </button>
          </form>

          {/* Existing Images Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Current Images</h2>
            {tripDate.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tripDate.images.map((image, index) => (
                  <div key={index} className="border rounded-md overflow-hidden relative">
                    <img 
                      src={image} 
                      alt={`Trip image ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No images uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDateEditor;