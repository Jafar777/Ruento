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

  // Default service images array
  const defaultImages = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  ];

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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          serviceId: service?._id,
          serviceType: service?.type,
          serviceTitle: service?.title,
          totalPrice: service?.price * bookingData.travelers
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(translations.contactSuccess || 'Booking request sent successfully! We will contact you soon.');
        setShowBookingForm(false);
        setBookingData({
          fullName: '',
          email: '',
          phone: '',
          startDate: '',
          travelers: 1,
          specialRequests: ''
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert(error.message || 'Error submitting booking');
    } finally {
      setSubmitting(false);
    }
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
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-semibold">{service.rating || 4.5}</span>
                      <span className="text-gray-500 ml-1">
                        ({service.reviews || 128} {translations.reviews || 'reviews'})
                      </span>
                    </div>
                    
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

              {/* Quick Facts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-blue-50 rounded-xl">
                {service.duration && (
                  <div className="text-center">
                    <FaClock className="text-blue-500 text-xl mx-auto mb-2" />
                    <div className="font-semibold text-gray-800">{service.duration}</div>
                    <div className="text-sm text-gray-600">{translations.duration || 'المدة'}</div>
                  </div>
                )}
                
                {service.groupSize && (
                  <div className="text-center">
                    <FaUsers className="text-green-500 text-xl mx-auto mb-2" />
                    <div className="font-semibold text-gray-800">{service.groupSize}</div>
                    <div className="text-sm text-gray-600">{translations.groupSize || 'حجم المجموعة'}</div>
                  </div>
                )}
                
                <div className="text-center">
                  <FaMapMarkerAlt className="text-red-500 text-xl mx-auto mb-2" />
                  <div className="font-semibold text-gray-800">
                    {Array.isArray(service.locations) ? service.locations.length : 1}
                  </div>
                  <div className="text-sm text-gray-600">{translations.locations || 'المواقع'}</div>
                </div>
                
                <div className="text-center">
                  <FaCalendar className="text-purple-500 text-xl mx-auto mb-2" />
                  <div className="font-semibold text-gray-800">
                    {service.availability || translations.availabilityDefault || 'على مدار السنة'}
                  </div>
                  <div className="text-sm text-gray-600">{translations.availability || 'التوفر'}</div>
                </div>
              </div>

              {/* Price and Booking */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      ${service.price || 499}
                      <span className="text-lg text-gray-500 ml-2">
                        / {service.priceUnit || translations.perPerson || 'للشخص'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {translations.startingFrom || 'بداية من'} • {translations.includesTaxes || 'يشمل الضرائب'}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowBookingForm(true)}
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
              {/* Included Features */}
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



              {/* Benefits */}
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
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {translations.contactInformation || 'معلومات الاتصال'}
                </h2>
                <div className="space-y-4">
                  {service.contactInfo?.phone && (
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-blue-500" />
                      <div>
                        <div className="font-semibold">{service.contactInfo.phone}</div>
                        <div className="text-sm text-gray-500">{translations.phoneNumber || 'هاتف'}</div>
                      </div>
                    </div>
                  )}
                  
                  {service.contactInfo?.email && (
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-green-500" />
                      <div>
                        <div className="font-semibold">{service.contactInfo.email}</div>
                        <div className="text-sm text-gray-500">{translations.emailAddress || 'بريد إلكتروني'}</div>
                      </div>
                    </div>
                  )}
                  
                  {service.contactInfo?.website && (
                    <div className="flex items-center gap-3">
                      <FaGlobe className="text-purple-500" />
                      <div>
                        <a 
                          href={service.contactInfo.website}
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
                  
                  {service.contactInfo?.liveChat && (
                    <div className="flex items-center gap-3">
                      <FaWhatsapp className="text-green-500" />
                      <div>
                        <div className="font-semibold">{service.contactInfo.liveChat}</div>
                        <div className="text-sm text-gray-500">{translations.liveChat || 'دردشة مباشرة'}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {service.amenities && service.amenities.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {translations.amenities || 'المرافق'}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {service.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700">
                        {getAmenityIcon(amenity)}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
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
                    <span>+7 (999) 999-9999</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaWhatsapp className="text-white/80" />
                    <span>{translations.available24_7 || 'متاح 24/7'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-white/80" />
                    <span>help@ruento.com</span>
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

              <form onSubmit={handleBookingSubmit}>
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

                  {/* Price Summary */}
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