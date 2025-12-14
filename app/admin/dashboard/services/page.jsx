// app/admin/dashboard/services/page.jsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import Navbar from '../../../components/Navbar';
import { FaArrowLeft, FaUpload, FaSave, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const ServicesManagement = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ 
    type: '', 
    title: '', 
    description: '', 
    icon: '📋',
    images: [],
    // New dynamic fields
    duration: '3-7 Days',
    groupSize: '2-12 People',
    availability: 'Year-round',
    locations: 'Multiple Cities',
    price: 499,
    priceUnit: 'person',
    includedFeatures: [
      'Expert local guides',
      'Comfortable accommodations',
      'All transportation included',
      'Entry fees to attractions',
      'Traditional meals',
      '24/7 support'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Welcome', description: 'Airport pickup and traditional welcome dinner' },
      { day: 'Day 2', title: 'City Exploration', description: 'Guided tour of historical sites and local markets' },
      { day: 'Day 3', title: 'Cultural Immersion', description: 'Traditional workshops and cultural performances' }
    ],
    contactInfo: {
      phone: '+1 (234) 567-890',
      email: 'info@ruento.com',
      liveChat: 'Available 24/7'
    },
    benefits: [
      'Best price guarantee',
      'Flexible cancellation',
      'Local expert guides',
      'Sustainable tourism'
    ]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newItinerary, setNewItinerary] = useState({ day: '', title: '', description: '' });
  const { translations } = useLanguage();
  const router = useRouter();

  const popularEmojis = ['📋', '🚗', '🏨', '🏠', '✈️', '🏛️', '🎯', '🛎️', '🚕', '🏢', '🌍', '🗺️'];

  useEffect(() => {
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
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setMessage('Error loading services data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, service = null) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const serviceData = service || newService;
      const method = service ? 'PUT' : 'POST';
      const url = service ? `/api/services/${service._id}` : '/api/services';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(service ? 'Service updated successfully!' : 'Service added successfully!');
        setShowAddForm(false);
        setNewService({ 
          type: '', 
          title: '', 
          description: '', 
          icon: '📋',
          images: [],
          duration: '3-7 Days',
          groupSize: '2-12 People',
          availability: 'Year-round',
          locations: 'Multiple Cities',
          price: 499,
          priceUnit: 'person',
          includedFeatures: [
            'Expert local guides',
            'Comfortable accommodations',
            'All transportation included',
            'Entry fees to attractions',
            'Traditional meals',
            '24/7 support'
          ],
          itinerary: [
            { day: 'Day 1', title: 'Arrival & Welcome', description: 'Airport pickup and traditional welcome dinner' },
            { day: 'Day 2', title: 'City Exploration', description: 'Guided tour of historical sites and local markets' },
            { day: 'Day 3', title: 'Cultural Immersion', description: 'Traditional workshops and cultural performances' }
          ],
          contactInfo: {
            phone: '+1 (234) 567-890',
            email: 'info@ruento.com',
            liveChat: 'Available 24/7'
          },
          benefits: [
            'Best price guarantee',
            'Flexible cancellation',
            'Local expert guides',
            'Sustainable tourism'
          ]
        });
        fetchServices();
      } else {
        setMessage(data.message || `Error ${service ? 'updating' : 'adding'} service`);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      setMessage(`Error ${service ? 'updating' : 'adding'} service`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Service deleted successfully!');
        fetchServices();
      } else {
        setMessage(data.message || 'Error deleting service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      setMessage('Error deleting service');
    }
  };

  const handleChange = (field, value, index = null) => {
    if (index !== null) {
      // Editing existing service
      setServices(prev => prev.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      ));
    } else {
      // New service
      setNewService(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNestedChange = (parentField, field, value, index = null) => {
    if (index !== null) {
      // Editing existing service
      setServices(prev => prev.map((service, i) => 
        i === index ? { 
          ...service, 
          [parentField]: { ...service[parentField], [field]: value }
        } : service
      ));
    } else {
      // New service
      setNewService(prev => ({ 
        ...prev, 
        [parentField]: { ...prev[parentField], [field]: value }
      }));
    }
  };

  const addFeature = (index = null) => {
    if (!newFeature.trim()) return;
    
    if (index !== null) {
      setServices(prev => prev.map((service, i) => 
        i === index ? { 
          ...service, 
          includedFeatures: [...service.includedFeatures, newFeature.trim()]
        } : service
      ));
    } else {
      setNewService(prev => ({ 
        ...prev, 
        includedFeatures: [...prev.includedFeatures, newFeature.trim()]
      }));
    }
    setNewFeature('');
  };

  const removeFeature = (featureIndex, serviceIndex = null) => {
    if (serviceIndex !== null) {
      setServices(prev => prev.map((service, i) => 
        i === serviceIndex ? {
          ...service,
          includedFeatures: service.includedFeatures.filter((_, idx) => idx !== featureIndex)
        } : service
      ));
    } else {
      setNewService(prev => ({
        ...prev,
        includedFeatures: prev.includedFeatures.filter((_, idx) => idx !== featureIndex)
      }));
    }
  };

  const addBenefit = (index = null) => {
    if (!newBenefit.trim()) return;
    
    if (index !== null) {
      setServices(prev => prev.map((service, i) => 
        i === index ? { 
          ...service, 
          benefits: [...service.benefits, newBenefit.trim()]
        } : service
      ));
    } else {
      setNewService(prev => ({ 
        ...prev, 
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
    }
    setNewBenefit('');
  };

  const removeBenefit = (benefitIndex, serviceIndex = null) => {
    if (serviceIndex !== null) {
      setServices(prev => prev.map((service, i) => 
        i === serviceIndex ? {
          ...service,
          benefits: service.benefits.filter((_, idx) => idx !== benefitIndex)
        } : service
      ));
    } else {
      setNewService(prev => ({
        ...prev,
        benefits: prev.benefits.filter((_, idx) => idx !== benefitIndex)
      }));
    }
  };

  const addItinerary = (index = null) => {
    if (!newItinerary.day.trim() || !newItinerary.title.trim() || !newItinerary.description.trim()) return;
    
    if (index !== null) {
      setServices(prev => prev.map((service, i) => 
        i === serviceIndex ? { 
          ...service, 
          itinerary: [...service.itinerary, { ...newItinerary }]
        } : service
      ));
    } else {
      setNewService(prev => ({ 
        ...prev, 
        itinerary: [...prev.itinerary, { ...newItinerary }]
      }));
    }
    setNewItinerary({ day: '', title: '', description: '' });
  };

  const removeItinerary = (itineraryIndex, serviceIndex = null) => {
    if (serviceIndex !== null) {
      setServices(prev => prev.map((service, i) => 
        i === serviceIndex ? {
          ...service,
          itinerary: service.itinerary.filter((_, idx) => idx !== itineraryIndex)
        } : service
      ));
    } else {
      setNewService(prev => ({
        ...prev,
        itinerary: prev.itinerary.filter((_, idx) => idx !== itineraryIndex)
      }));
    }
  };

  const handleImageUpload = async (e, index = null) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setMessage('Uploading images...');

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        
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
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      if (index !== null) {
        // Add to existing service
        setServices(prev => prev.map((service, i) => 
          i === index ? { 
            ...service, 
            images: [...service.images, ...uploadedUrls] 
          } : service
        ));
      } else {
        // Add to new service
        setNewService(prev => ({ 
          ...prev, 
          images: [...prev.images, ...uploadedUrls] 
        }));
      }
      
      setMessage('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      setMessage('Error uploading images');
    }
  };

  const removeImage = (imageIndex, serviceIndex = null) => {
    if (serviceIndex !== null) {
      setServices(prev => prev.map((service, i) => 
        i === serviceIndex ? {
          ...service,
          images: service.images.filter((_, idx) => idx !== imageIndex)
        } : service
      ));
    } else {
      setNewService(prev => ({
        ...prev,
        images: prev.images.filter((_, idx) => idx !== imageIndex)
      }));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 text-white">
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Service
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

          {/* Add New Service Form */}
          {showAddForm && (
            <div className="bg-gray-800 bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Add New Service</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Type (Unique Identifier)</label>
                    <input
                      type="text"
                      value={newService.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder="e.g., plans, transportation, hotels"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <input
                      type="text"
                      value={newService.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder="e.g., Travel Plans, Transportation"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Icon/Emoji</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={newService.icon}
                      onChange={(e) => handleChange('icon', e.target.value)}
                      className="w-20 p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white text-center text-2xl"
                      maxLength="2"
                      required
                    />
                    <div className="flex flex-wrap gap-2">
                      {popularEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleChange('icon', emoji)}
                          className="text-2xl hover:scale-110 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newService.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                    rows={3}
                    placeholder="Enter service description"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <input
                      type="text"
                      value={newService.duration}
                      onChange={(e) => handleChange('duration', e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder="e.g., 3-7 Days"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Group Size</label>
                    <input
                      type="text"
                      value={newService.groupSize}
                      onChange={(e) => handleChange('groupSize', e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder="e.g., 2-12 People"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Availability</label>
                    <input
                      type="text"
                      value={newService.availability}
                      onChange={(e) => handleChange('availability', e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder="e.g., Year-round"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Locations</label>
                    <input
                      type="text"
                      value={newService.locations}
                      onChange={(e) => handleChange('locations', e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder="e.g., Multiple Cities"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="number"
                      value={newService.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder="499"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Unit</label>
                    <input
                      type="text"
                      value={newService.priceUnit}
                      onChange={(e) => handleChange('priceUnit', e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder="e.g., person, day, package"
                    />
                  </div>
                </div>

                {/* Included Features */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Included Features</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder="Add a feature"
                    />
                    <button
                      type="button"
                      onClick={() => addFeature()}
                      className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newService.includedFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Benefits</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      className="flex-1 p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder="Add a benefit"
                    />
                    <button
                      type="button"
                      onClick={() => addBenefit()}
                      className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newService.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                        <span>{benefit}</span>
                        <button
                          type="button"
                          onClick={() => removeBenefit(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="text"
                        value={newService.contactInfo.phone}
                        onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                        className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={newService.contactInfo.email}
                        onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)}
                        className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Live Chat Status</label>
                      <input
                        type="text"
                        value={newService.contactInfo.liveChat}
                        onChange={(e) => handleNestedChange('contactInfo', 'liveChat', e.target.value)}
                        className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Images</label>
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700 transition">
                      <FaUpload className="mr-2" />
                      Upload Images
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-blue-300">
                      {newService.images.length} image(s) uploaded
                    </span>
                  </div>
                  {newService.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {newService.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img 
                            src={image} 
                            alt={`Preview ${imgIndex + 1}`} 
                            className="h-32 w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(imgIndex)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-md font-semibold flex items-center hover:from-blue-600 hover:to-purple-700 transition duration-300 disabled:opacity-50"
                  >
                    <FaSave className="mr-2" />
                    {saving ? 'Adding...' : 'Add Service'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-700 transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Services - Simplified for space */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={service._id} className="bg-gray-800 bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <span className="text-3xl">{service.icon}</span>
                    <h3 className="text-2xl font-semibold ml-3">{service.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200"
                  >
                    <FaTrash />
                  </button>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-2">{service.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-blue-400 font-bold">${service.price || 499}</span>
                    <span className="text-gray-400 ml-1">/ {service.priceUnit || 'person'}</span>
                  </div>
                  <Link 
                    href={`/services/${service._id}`}
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View Service Page →
                  </Link>
                </div>

                <button
                  onClick={() => {
                    // In a real app, you'd open an edit modal or navigate to edit page
                    alert('Edit functionality would open a form similar to add form');
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300"
                >
                  <FaEdit className="inline mr-2" />
                  Edit Service
                </button>
              </div>
            ))}
          </div>

          {services.length === 0 && !showAddForm && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No services yet. Add your first service!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;