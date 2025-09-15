// app/admin/dashboard/services/page.jsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import Navbar from '../../../components/Navbar';
import { FaArrowLeft, FaUpload, FaSave } from 'react-icons/fa';

const ServicesManagement = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [services, setServices] = useState({
    plans: { title: '', description: '', image: '' },
    transportation: { title: '', description: '', image: '' },
    hotels: { title: '', description: '', image: '' },
    residence: { title: '', description: '', image: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      fetchServices();
    }
  }, [router]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      
      if (data && data.length > 0) {
        const servicesData = {};
        data.forEach(service => {
          servicesData[service.type] = {
            title: service.title || '',
            description: service.description || '',
            image: service.image || ''
          };
        });
        setServices(prev => ({ ...prev, ...servicesData }));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setMessage('Error loading services data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const serviceData = services[type];
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          title: serviceData.title,
          description: serviceData.description,
          image: serviceData.image
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
      } else {
        setMessage(data.message || `Error updating ${type}`);
      }
    } catch (error) {
      console.error('Error updating service:', error);
      setMessage(`Error updating ${type}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (type, field, value) => {
    setServices(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleImageUpload = async (e, type) => {
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
        handleChange(type, 'image', data.secure_url);
        setMessage('Image uploaded successfully!');
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    }
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

  const serviceTypes = [
    { key: 'plans', title: translations.plans || 'Plans', icon: '📋' },
    { key: 'transportation', title: translations.transportation || 'Transportation', icon: '🚗' },
    { key: 'hotels', title: translations.hotels || 'Hotels', icon: '🏨' },
    { key: 'residence', title: translations.residence || 'Residence', icon: '🏠' }
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
                {translations.manageServices || 'Manage Services'}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
            {serviceTypes.map((service) => (
              <div key={service.key} className="bg-gray-800 bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-3 ml-3">{service.icon}</span>
                  <h2 className="text-2xl font-semibold">{service.title}</h2>
                </div>

                <form onSubmit={(e) => handleSubmit(e, service.key)}>
                  <div className="mb-4 ">
                    <label className="block text-sm font-medium mb-2 ">{translations.Title}</label>
                    <input
                      type="text"
                      value={services[service.key].title}
                      onChange={(e) => handleChange(service.key, 'title', e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder={`Enter ${service.title} title`}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2"> {translations.Description}</label>
                    <textarea
                      value={services[service.key].description}
                      onChange={(e) => handleChange(service.key, 'description', e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      rows={4}
                      placeholder={`Enter ${service.title} description`}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">{translations.Image}</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700 transition">
                        <FaUpload className="mr-2 ml-2" />
                        {translations.UploadImage}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, service.key)}
                          className="hidden"
                        />
                      </label>
                      {services[service.key].image && (
                        <span className="text-sm text-blue-300">{translations.Imageuploaded}</span>
                      )}
                    </div>
                    {services[service.key].image && (
                      <div className="mt-4">
                        <img 
                          src={services[service.key].image} 
                          alt="Preview" 
                          className="h-40 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-md font-semibold flex items-center hover:from-blue-600 hover:to-purple-700 transition duration-300 disabled:opacity-50"
                  >
                    <FaSave className="mr-2 ml-2" />
                    {saving ? 'Saving...' : `Save ${service.title}`}
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;