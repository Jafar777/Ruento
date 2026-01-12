// app/services/[type]/page.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  FaStar, FaClock, FaUsers, FaMapMarkerAlt,
  FaCheck, FaPhone, FaEnvelope, FaWhatsapp,
  FaCalendar, FaBed, FaCar, FaUtensils,
  FaArrowLeft, FaShareAlt, FaBookmark,
  FaWifi, FaSwimmingPool, FaSpa, FaDumbbell,
  FaParking, FaPaw, FaSnowflake, FaTv,
  FaCreditCard, FaShieldAlt, FaLeaf, FaGlobe,
  FaImage
} from 'react-icons/fa';
import Link from 'next/link';
import { FaLocationDot, FaCalendarCheck } from 'react-icons/fa6';

const ServiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { translations, currentLanguage } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    startDate: '',
    travelers: 1,
    specialRequests: ''
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [contacts, setContacts] = useState(null);

  // Default service images array
  const defaultImages = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  ];

  // Fetch contacts on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  const getWhatsAppLink = (customMessage = '') => {
    if (!contacts?.whatsapp) return '#';
    
    let phoneNumber = contacts.whatsapp;
    if (phoneNumber.includes('wa.me/') || phoneNumber.includes('whatsapp.com/')) {
      const match = phoneNumber.match(/\/?\+?(\d+)/);
      if (match) phoneNumber = match[1];
    }
    
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    const message = customMessage || contacts.whatsappMessage || 'Hello! I am interested in your services.';
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/services/${params.type}`);
        
        if (!response.ok) {
          throw new Error('Service not found');
        }
        
        const data = await response.json();
        // Ensure service has images array
        if (!data.images || data.images.length === 0) {
          data.images = defaultImages;
        }
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
        setError(translations.experienceNotFound || 'Service not found');
      } finally {
        setLoading(false);
      }
    };

    if (params.type) {
      fetchService();
    }
  }, [params.type, translations]);

  const handleBookingSubmit = () => {
    const message = `Booking request for ${service.title}:
    Name: ${bookingData.fullName}
    Email: ${bookingData.email}
    Phone: ${bookingData.phone}
    Start Date: ${bookingData.startDate}
    Travelers: ${bookingData.travelers}
    Special Requests: ${bookingData.specialRequests}`;
    
    const whatsappLink = getWhatsAppLink(message);
    window.open(whatsappLink, '_blank');
    setShowBookingForm(false);
    setBookingData({
      fullName: '',
      email: '',
      phone: '',
      startDate: '',
      travelers: 1,
      specialRequests: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'واي فاي مجاني': <FaWifi />,
      'حمام سباحة': <FaSwimmingPool />,
      'سبا': <FaSpa />,
      'مركز لياقة': <FaDumbbell />,
      'مطعم': <FaUtensils />,
      'موقف سيارات': <FaParking />,
      'مسموح بالحيوانات': <FaPaw />,
      'تكييف هواء': <FaSnowflake />,
      'تلفزيون': <FaTv />,
      'الإفطار مشمول': <FaUtensils />,
      'كونسيرج 24/7': <FaPhone />
    };
    
    return iconMap[amenity] || <FaCheck />;
  };

  const getCategoryName = (type) => {
    const categories = {
      'plans': translations.plans || 'الخطط',
      'transportation': translations.transportation || 'النقل',
      'hotels': translations.hotels || 'الفنادق',
      'residence': translations.residence || 'الإقامة',
      'restaurants': translations.restaurants || 'المطاعم',
      'tourist-attractions': translations.touristAttractions || 'المعالم السياحية',
      'events': translations.events || 'الفعاليات',
      'shopping': translations.shopping || 'التسوق',
      'museums': translations.museums || 'المتاحف',
      'natural-places': translations.naturalPlaces || 'الأماكن الطبيعية',
    };
    return categories[type] || type;
  };

  // Check if a field should be displayed (not empty/null/undefined)
  const shouldDisplayField = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (value === 0) return false; // Price of 0 shouldn't be shown
    return true;
  };

  // Process locations to handle different formats
  const getLocationsArray = () => {
    if (!service?.locations) return [];
    
    if (Array.isArray(service.locations)) {
      return service.locations.filter(location => location && location.trim() !== '');
    }
    
    if (typeof service.locations === 'string') {
      if (service.locations.trim() === '') return [];
      return [service.locations];
    }
    
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="pt-32 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="pt-32 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl mb-4">😔</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {translations.experienceNotFound || 'Service Not Found'}
            </h1>
            <p className="text-gray-600 mb-8">
              {translations.notFoundMessage || 'The service you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <Link 
              href="/services"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {translations.backToServices || 'Back to Services'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get processed locations
  const locationsArray = getLocationsArray();
  const hasLocations = locationsArray.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link 
              href="/services"
              className="flex items-center text-blue-600 hover:text-blue-800 transition"
            >
              <FaArrowLeft className={`mr-2 ${currentLanguage === 'ar' ? 'ml-2 rotate-180' : ''}`} />
              {translations.backToServices || 'Back to Services'}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images Gallery */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                {service.images && service.images.length > 0 ? (
                  <img 
                    src={service.images[activeImage]} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImages[0];
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <FaImage className="text-6xl mb-4" />
                    <p>لا توجد صور متاحة</p>
                  </div>
                )}
              </div>
              
              {service.images && service.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {service.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative h-20 rounded-lg overflow-hidden transition-all ${
                        activeImage === index 
                          ? 'ring-2 ring-blue-500 ring-offset-2' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${service.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImages[index % defaultImages.length];
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                    {getCategoryName(service.type)}
                  </span>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {service.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-4">
                    
                    {service.features && (
                      <div className="flex items-center gap-2">
                        {service.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="text-sm text-gray-600">
                            • {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                {service.description}
              </p>

              {/* Quick Facts - Conditionally shown */}
              {(shouldDisplayField(service.duration) || 
                shouldDisplayField(service.groupSize) || 
                shouldDisplayField(service.availability) || 
                hasLocations) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-blue-50 rounded-xl">
                  {/* Duration - Only show if exists and not empty */}
                  {shouldDisplayField(service.duration) && (
                    <div className="text-center">
                      <FaClock className="text-blue-500 text-xl mx-auto mb-2" />
                      <div className="font-semibold text-gray-800">{service.duration}</div>
                      <div className="text-sm text-gray-600">{translations.duration || 'المدة'}</div>
                    </div>
                  )}
                  
                  {/* Group Size - Only show if exists and not empty */}
                  {shouldDisplayField(service.groupSize) && (
                    <div className="text-center">
                      <FaUsers className="text-green-500 text-xl mx-auto mb-2" />
                      <div className="font-semibold text-gray-800">{service.groupSize}</div>
                      <div className="text-sm text-gray-600">{translations.groupSize || 'حجم المجموعة'}</div>
                    </div>
                  )}
                  
                  {/* Locations - Only show if array has items */}
                  {hasLocations && (
                    <div className="text-center">
                      <FaLocationDot className="text-red-500 text-xl mx-auto mb-2" />
                      <div className="font-semibold text-gray-800">
                        {locationsArray.length}
                      </div>
                      <div className="text-sm text-gray-600">{translations.locations || 'المواقع'}</div>
                    </div>
                  )}
                  
                  {/* Availability - Only show if exists and not empty */}
                  {shouldDisplayField(service.availability) && (
                    <div className="text-center">
                      <FaCalendarCheck className="text-purple-500 text-xl mx-auto mb-2" />
                      <div className="font-semibold text-gray-800">
                        {service.availability}
                      </div>
                      <div className="text-sm text-gray-600">{translations.availability || 'التوفر'}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Price and Booking - Conditionally shown */}
              {(shouldDisplayField(service.price) || shouldDisplayField(service.priceUnit)) && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      {/* Only show price if it exists and is greater than 0 */}
                      {shouldDisplayField(service.price) && service.price > 0 ? (
                        <>
                          <div className="text-3xl font-bold text-blue-600">
                            ${service.price}
                            <span className="text-lg text-gray-500 ml-2">
                              / {service.priceUnit || translations.perPerson || 'للشخص'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {translations.startingFrom || 'بداية من'} • {translations.includesTaxes || 'يشمل الضرائب'}
                          </div>
                        </>
                      ) : shouldDisplayField(service.priceUnit) ? (
                        <div className="text-2xl font-bold text-blue-600">
                          {translations.contactForPrice || 'اتصل للاستفسار عن السعر'}
                          {service.priceUnit && (
                            <span className="text-lg text-gray-500 ml-2">
                              / {service.priceUnit}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                    
                    <button
                      onClick={() => {
                        const whatsappLink = getWhatsAppLink(`I want to book service: ${service.title}`);
                        window.open(whatsappLink, '_blank');
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
                    >
                      {translations.bookNow || 'احجز الآن'}
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <FaCheck className="inline text-green-500 mr-2" />
                    {translations.flexibleCancellation || 'إلغاء مجاني حتى 30 يوم قبل البدء'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Details Sections */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Features & Itinerary */}
            <div className="lg:col-span-2 space-y-12">
              {/* Included Features - Only show if exists */}
              {service.features && service.features.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {translations.whatsIncluded || 'ما المضمن'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits - Only show if exists */}
              {service.benefits && service.benefits.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {translations.whyChooseThisService || 'لماذا تختار هذه الخدمة؟'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {service.benefits.map((benefit, index) => {
                      let Icon = FaCheck;
                      let color = 'text-green-500';
                      
                      if (benefit.includes('سعر')) Icon = FaCreditCard;
                      if (benefit.includes('إلغاء')) Icon = FaShieldAlt;
                      if (benefit.includes('مرشد')) Icon = FaGlobe;
                      if (benefit.includes('سياحة')) Icon = FaLeaf;
                      
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-blue-50 ${color}`}>
                            <Icon className="text-xl" />
                          </div>
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact & Amenities */}
            <div className="space-y-6">
              {/* Contact Information - Only show if exists */}
              {service.contactInfo && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {translations.contactInformation || 'معلومات الاتصال'}
                  </h2>
                  <div className="space-y-4">
                    {service.contactInfo?.هاتف && (
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-blue-500" />
                        <div>
                          <div className="font-semibold">{service.contactInfo.هاتف}</div>
                          <div className="text-sm text-gray-500">{translations.phoneNumber || 'هاتف'}</div>
                        </div>
                      </div>
                    )}
                    
                    {service.contactInfo?.إيميل && (
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-green-500" />
                        <div>
                          <div className="font-semibold">{service.contactInfo.إيميل}</div>
                          <div className="text-sm text-gray-500">{translations.emailAddress || 'بريد إلكتروني'}</div>
                        </div>
                      </div>
                    )}
                    
                    {service.contactInfo?.موقع && (
                      <div className="flex items-center gap-3">
                        <FaGlobe className="text-purple-500" />
                        <div>
                          <a 
                            href={service.contactInfo.موقع}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 hover:underline"
                          >
                            {translations.visitWebsite || 'زيارة الموقع'}
                          </a>
                          <div className="text-sm text-gray-500">{translations.website || 'موقع إلكتروني'}</div>
                        </div>
                      </div>
                    )}
                    
                    {service.contactInfo?.دردشة && (
                      <div className="flex items-center gap-3">
                        <FaWhatsapp className="text-green-500" />
                        <div>
                          <div className="font-semibold">{service.contactInfo.دردشة}</div>
                          <div className="text-sm text-gray-500">{translations.liveChat || 'دردشة مباشرة'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Help */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">
                  {translations.needHelp || 'تحتاج مساعدة؟'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-white/80" />
                    <span>{contacts?.phone || '+7 (999) 999-9999'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaWhatsapp className="text-white/80" />
                    <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {translations.available24_7 || 'متاح 24/7'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-white/80" />
                    <span>{contacts?.email || 'help@ruento.com'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {translations.bookExperience || 'احجز الخدمة'}
                </h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleBookingSubmit(); }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.fullName || 'الاسم الكامل'}
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={bookingData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.emailAddress || 'البريد الإلكتروني'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.phoneNumber || 'رقم الهاتف'}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.startDate || 'تاريخ البدء'}
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={bookingData.startDate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.travelers || 'عدد المسافرين'}
                    </label>
                    <input
                      type="number"
                      name="travelers"
                      min="1"
                      max="20"
                      value={bookingData.travelers}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.specialRequests || 'طلبات خاصة'}
                    </label>
                    <textarea
                      name="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={translations.specialRequestsPlaceholder || 'أي طلبات إضافية...'}
                    />
                  </div>

                  {/* Price Summary - Only show if price exists */}
                  {shouldDisplayField(service.price) && service.price > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">
                          {service.title}
                        </span>
                        <span className="font-semibold">
                          ${service.price} × {bookingData.travelers}
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>{translations.totalPrice || 'السعر الإجمالي'}</span>
                          <span className="text-blue-600">
                            ${service.price * bookingData.travelers}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      {translations.cancel || 'إلغاء'}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {submitting ? (translations.sending || 'جاري الإرسال...') : translations.confirmBooking || 'تأكيد الحجز'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;