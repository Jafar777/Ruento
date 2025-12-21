// app/admin/dashboard/services/page.jsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import Navbar from '../../../components/Navbar';
import { FaArrowLeft, FaUpload, FaSave, FaPlus, FaTrash, FaEdit, FaTimes, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

const ServicesManagement = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ 
    type: '', 
    title: '', 
    description: '', 
    icon: '📋',
    images: [],
    duration: '3-7 أيام',
    groupSize: '2-12 شخص',
    availability: 'على مدار السنة',
    locations: ['متعدد'],
    price: 499,
    priceUnit: 'للشخص',
    rating: 4.5,
    features: [
      'مرشدين محليين خبراء',
      'إقامة مريحة',
      'جميع وسائل النقل مشمولة',
      'رسوم دخول المعالم السياحية',
      'وجبات تقليدية',
      'دعم على مدار الساعة'
    ],
    itinerary: [
      { يوم: 'اليوم الأول', عنوان: 'الوصول والترحيب', وصف: 'استقبال من المطار وعشاء ترحيبي تقليدي' },
      { يوم: 'اليوم الثاني', عنوان: 'استكشاف المدينة', وصف: 'جولة إرشادية في المواقع التاريخية والأسواق المحلية' },
      { يوم: 'اليوم الثالث', عنوان: 'الانغماس الثقافي', وصف: 'ورش عمل تقليدية وعروض ثقافية' }
    ],
    contactInfo: {
      هاتف: '+7 (999) 999-9999',
      إيميل: 'info@ruento.com',
      دردشة: 'متاحة 24/7'
    },
    benefits: [
      'ضمان أفضل سعر',
      'إلغاء مرن',
      'مرشدين محليين خبراء',
      'سياحة مستدامة'
    ]
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newItinerary, setNewItinerary] = useState({ يوم: '', عنوان: '', وصف: '' });
  const { translations, currentLanguage } = useLanguage();
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
      setMessage(translations.loadingServices || 'Loading services...');
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data || []);
      setMessage('');
    } catch (error) {
      console.error('Error fetching services:', error);
      setMessage(translations.errorLoadingServices || 'Error loading services data');
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
      const url = service ? `/api/services/${service.type}` : '/api/services';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(service ? translations.serviceUpdated : translations.serviceAdded);
        setShowAddForm(false);
        setEditingService(null);
        // Reset new service form
        setNewService({ 
          type: '', 
          title: '', 
          description: '', 
          icon: '📋',
          images: [],
          duration: '3-7 أيام',
          groupSize: '2-12 شخص',
          availability: 'على مدار السنة',
          locations: ['متعدد'],
          price: 499,
          priceUnit: 'للشخص',
          rating: 4.5,
          features: [
            'مرشدين محليين خبراء',
            'إقامة مريحة',
            'جميع وسائل النقل مشمولة',
            'رسوم دخول المعالم السياحية',
            'وجبات تقليدية',
            'دعم على مدار الساعة'
          ],
          itinerary: [
            { يوم: 'اليوم الأول', عنوان: 'الوصول والترحيب', وصف: 'استقبال من المطار وعشاء ترحيبي تقليدي' },
            { يوم: 'اليوم الثاني', عنوان: 'استكشاف المدينة', وصف: 'جولة إرشادية في المواقع التاريخية والأسواق المحلية' },
            { يوم: 'اليوم الثالث', عنوان: 'الانغماس الثقافي', وصف: 'ورش عمل تقليدية وعروض ثقافية' }
          ],
          contactInfo: {
            هاتف: '+7 (999) 999-9999',
            إيميل: 'info@ruento.com',
            دردشة: 'متاحة 24/7'
          },
          benefits: [
            'ضمان أفضل سعر',
            'إلغاء مرن',
            'مرشدين محليين خبراء',
            'سياحة مستدامة'
          ]
        });
        fetchServices();
      } else {
        setMessage(data.message || (service ? translations.errorUpdatingService : translations.errorAddingService));
      }
    } catch (error) {
      console.error('Error saving service:', error);
      setMessage(service ? translations.errorUpdatingService : translations.errorAddingService);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service) => {
    if (!confirm(translations.confirmDelete || 'Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/services/${service.type}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage(translations.serviceDeleted);
        fetchServices();
      } else {
        setMessage(data.message || translations.errorDeletingService);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      setMessage(translations.errorDeletingService);
    }
  };

  const startEditing = (service) => {
    setEditingService(service);
    setShowAddForm(true);
  };

  const cancelEditing = () => {
    setEditingService(null);
    setShowAddForm(false);
    // Reset new service form
    setNewService({ 
      type: '', 
      title: '', 
      description: '', 
      icon: '📋',
      images: [],
      duration: '3-7 أيام',
      groupSize: '2-12 شخص',
      availability: 'على مدار السنة',
      locations: ['متعدد'],
      price: 499,
      priceUnit: 'للشخص',
      rating: 4.5,
      features: [
        'مرشدين محليين خبراء',
        'إقامة مريحة',
        'جميع وسائل النقل مشمولة',
        'رسوم دخول المعالم السياحية',
        'وجبات تقليدية',
        'دعم على مدار الساعة'
      ],
      itinerary: [
        { يوم: 'اليوم الأول', عنوان: 'الوصول والترحيب', وصف: 'استقبال من المطار وعشاء ترحيبي تقليدي' },
        { يوم: 'اليوم الثاني', عنوان: 'استكشاف المدينة', وصف: 'جولة إرشادية في المواقع التاريخية والأسواق المحلية' },
        { يوم: 'اليوم الثالث', عنوان: 'الانغماس الثقافي', وصف: 'ورش عمل تقليدية وعروض ثقافية' }
      ],
      contactInfo: {
        هاتف: '+7 (999) 999-9999',
        إيميل: 'info@ruento.com',
        دردشة: 'متاحة 24/7'
      },
      benefits: [
        'ضمان أفضل سعر',
        'إلغاء مرن',
        'مرشدين محليين خبراء',
        'سياحة مستدامة'
      ]
    });
  };

  const handleFormChange = (field, value) => {
    if (editingService) {
      setEditingService({ ...editingService, [field]: value });
    } else {
      setNewService({ ...newService, [field]: value });
    }
  };

  const handleNestedChange = (parentField, field, value) => {
    if (editingService) {
      setEditingService({ 
        ...editingService, 
        [parentField]: { ...editingService[parentField], [field]: value }
      });
    } else {
      setNewService({ 
        ...newService, 
        [parentField]: { ...newService[parentField], [field]: value }
      });
    }
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    
    if (editingService) {
      setEditingService({ 
        ...editingService, 
        features: [...editingService.features, newFeature.trim()]
      });
    } else {
      setNewService({ 
        ...newService, 
        features: [...newService.features, newFeature.trim()]
      });
    }
    setNewFeature('');
  };

  const removeFeature = (featureIndex) => {
    if (editingService) {
      setEditingService({
        ...editingService,
        features: editingService.features.filter((_, idx) => idx !== featureIndex)
      });
    } else {
      setNewService({
        ...newService,
        features: newService.features.filter((_, idx) => idx !== featureIndex)
      });
    }
  };

  const addBenefit = () => {
    if (!newBenefit.trim()) return;
    
    if (editingService) {
      setEditingService({ 
        ...editingService, 
        benefits: [...editingService.benefits, newBenefit.trim()]
      });
    } else {
      setNewService({ 
        ...newService, 
        benefits: [...newService.benefits, newBenefit.trim()]
      });
    }
    setNewBenefit('');
  };

  const removeBenefit = (benefitIndex) => {
    if (editingService) {
      setEditingService({
        ...editingService,
        benefits: editingService.benefits.filter((_, idx) => idx !== benefitIndex)
      });
    } else {
      setNewService({
        ...newService,
        benefits: newService.benefits.filter((_, idx) => idx !== benefitIndex)
      });
    }
  };

  const addItinerary = () => {
    if (!newItinerary.يوم.trim() || !newItinerary.عنوان.trim() || !newItinerary.وصف.trim()) return;
    
    if (editingService) {
      setEditingService({ 
        ...editingService, 
        itinerary: [...editingService.itinerary, { ...newItinerary }]
      });
    } else {
      setNewService({ 
        ...newService, 
        itinerary: [...newService.itinerary, { ...newItinerary }]
      });
    }
    setNewItinerary({ يوم: '', عنوان: '', وصف: '' });
  };

  const removeItinerary = (itineraryIndex) => {
    if (editingService) {
      setEditingService({
        ...editingService,
        itinerary: editingService.itinerary.filter((_, idx) => idx !== itineraryIndex)
      });
    } else {
      setNewService({
        ...newService,
        itinerary: newService.itinerary.filter((_, idx) => idx !== itineraryIndex)
      });
    }
  };

const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  setMessage(translations.uploadingImages || 'Uploading images...');

  try {
    // IMPORTANT: Make sure these environment variables are properly set
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'ddy7qrjck';
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ruento';
    
    // For debugging - log the env variables
    console.log('Cloudinary Config:', {
      cloudName,
      uploadPreset,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
    });

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      
      // Add timestamp and folder for better organization
      formData.append('timestamp', Math.round((new Date()).getTime() / 1000));
      formData.append('folder', 'ruento/services');
      
      // IMPORTANT: Use the correct API endpoint
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      
      console.log('Uploading to:', uploadUrl);
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        // No headers needed for FormData
      });
      
      const data = await response.json();
      console.log('Cloudinary response:', data);
      
      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error('Upload failed:', data);
        throw new Error(data.error?.message || 'Image upload failed');
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    console.log('Uploaded URLs:', uploadedUrls);

    if (editingService) {
      setEditingService({ 
        ...editingService, 
        images: [...(editingService.images || []), ...uploadedUrls] 
      });
    } else {
      setNewService({ 
        ...newService, 
        images: [...(newService.images || []), ...uploadedUrls] 
      });
    }
    
    setMessage(translations.imagesUploadedSuccess || 'Images uploaded successfully!');
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
    
  } catch (error) {
    console.error('Error uploading images:', error);
    setMessage(error.message || translations.errorUploadingImages || 'Error uploading images');
  }
};

  const removeImage = (imageIndex) => {
    if (editingService) {
      setEditingService({
        ...editingService,
        images: editingService.images.filter((_, idx) => idx !== imageIndex)
      });
    } else {
      setNewService({
        ...newService,
        images: newService.images.filter((_, idx) => idx !== imageIndex)
      });
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

  // Get current form data for editing or adding
  const formData = editingService || newService;

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
                title={translations.backToDashboard}
              >
                <FaArrowLeft />
              </button>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {translations.manageServices}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  if (showAddForm) cancelEditing();
                }}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 flex items-center"
              >
                <FaPlus className="mr-2" />
                {showAddForm ? translations.cancel : translations.addService}
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
            <div className={`p-4 mb-6 rounded-md ${message.includes('success') || message.includes('تم') ? 'bg-green-800' : 'bg-red-800'}`}>
              <div className="flex items-center">
                <FaInfoCircle className="mr-2" />
                {message}
              </div>
            </div>
          )}

          {/* Add/Edit Service Form */}
          {showAddForm && (
            <div className="bg-gray-800 bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  {editingService ? translations.editServiceTitle : translations.newService}
                </h2>
                {editingService && (
                  <button
                    onClick={cancelEditing}
                    className="text-gray-400 hover:text-white"
                    title={translations.cancel}
                  >
                    <FaTimes size={24} />
                  </button>
                )}
              </div>
              <form onSubmit={(e) => handleSubmit(e, editingService)}>
                {/* Basic Information Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-500 pb-2">
                    {translations.basicInformation}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{translations.serviceType}</label>
                      <input
                        type="text"
                        value={formData.type}
                        onChange={(e) => handleFormChange('type', e.target.value)}
                        className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                        placeholder={translations.serviceTypePlaceholder}
                        required
                        disabled={!!editingService}
                      />
                      {editingService && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center">
                          <FaInfoCircle className="mr-1" />
                          {translations.typeCannotBeChanged}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{translations.displayName}</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                        placeholder={translations.displayNamePlaceholder}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">{translations.iconEmoji}</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => handleFormChange('icon', e.target.value)}
                        className="w-20 p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white text-center text-2xl"
                        maxLength="2"
                        required
                      />
                      <div className="flex flex-wrap gap-2">
                        {popularEmojis.map((emoji, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleFormChange('icon', emoji)}
                            className="text-2xl hover:scale-110 transition-transform bg-gray-700 bg-opacity-30 p-2 rounded-md"
                            title={`Select ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">{translations.description}</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      rows={3}
                      placeholder={translations.descriptionPlaceholder}
                      required
                    />
                  </div>
                </div>

                {/* Service Details Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-500 pb-2">
                    {translations.serviceDetails}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{translations.duration}</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => handleFormChange('duration', e.target.value)}
                        className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                        placeholder={translations.durationPlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{translations.groupSize}</label>
                      <input
                        type="text"
                        value={formData.groupSize}
                        onChange={(e) => handleFormChange('groupSize', e.target.value)}
                        className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                        placeholder={translations.groupSizePlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{translations.availability}</label>
                      <input
                        type="text"
                        value={formData.availability}
                        onChange={(e) => handleFormChange('availability', e.target.value)}
                        className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                        placeholder={translations.availabilityPlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{translations.locations}</label>
                      <input
                        type="text"
                        value={Array.isArray(formData.locations) ? formData.locations.join(', ') : formData.locations}
                        onChange={(e) => handleFormChange('locations', e.target.value.split(',').map(l => l.trim()))}
                        className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                        placeholder={translations.locationsPlaceholder}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Information Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-500 pb-2">
                    {translations.pricingInformation}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{translations.price}</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleFormChange('price', e.target.value)}
                        className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                        placeholder="499"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{translations.priceUnit}</label>
                      <input
                        type="text"
                        value={formData.priceUnit}
                        onChange={(e) => handleFormChange('priceUnit', e.target.value)}
                        className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                        placeholder={translations.priceUnitPlaceholder}
                      />
                    </div>
                  </div>
                </div>

                {/* Included Features Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-500 pb-2">
                    {translations.includedFeatures}
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder={translations.addFeature}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition flex items-center"
                    >
                      {translations.add}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.features && formData.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-red-400 hover:text-red-300"
                          title={translations.delete}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-500 pb-2">
                    {translations.serviceBenefits}
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      className="flex-1 p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder={translations.addBenefit}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                    />
                    <button
                      type="button"
                      onClick={addBenefit}
                      className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition flex items-center"
                    >
                      {translations.add}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.benefits && formData.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                        <span>{benefit}</span>
                        <button
                          type="button"
                          onClick={() => removeBenefit(idx)}
                          className="text-red-400 hover:text-red-300"
                          title={translations.delete}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>






                {/* Images Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-500 pb-2">
                    {translations.mediaGallery}
                  </h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700 transition">
                      <FaUpload className="mr-2" />
                      {translations.uploadImages}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-blue-300">
                      {formData.images?.length || 0} {translations.imagesUploaded}
                    </span>
                  </div>
                  {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, imgIndex) => (
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
                            title={translations.delete}
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
                    {saving ? (editingService ? translations.updating : translations.adding) : (editingService ? translations.updateService : translations.addService)}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="bg-gray-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-700 transition duration-300"
                  >
                    {translations.cancel}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={service._id || index} className="bg-gray-800 bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 hover:border-opacity-40 transition duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <span className="text-3xl">{service.icon}</span>
                    <div className={currentLanguage === 'ar' ? 'mr-3' : 'ml-3'}>
                      <h3 className="text-2xl font-semibold">{service.title}</h3>
                      <p className="text-sm text-gray-400">
                        {translations.serviceType}: {service.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(service)}
                      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
                      title={translations.edit}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-200"
                      title={translations.delete}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-2">{service.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-blue-400 font-bold">{service.price || 499}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-gray-400">{service.priceUnit || translations.priceUnit}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {service.features?.length || 0} {translations.featuresCount} • {service.itinerary?.length || 0} {translations.daysCount}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {service.locations ? (Array.isArray(service.locations) ? service.locations.join(', ') : service.locations) : translations.multipleLocations}
                  </div>
                  <Link 
                    href={`/services/${service.type}`}
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                  >
                    {translations.viewServicePage}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && !showAddForm && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">{translations.noServices}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;