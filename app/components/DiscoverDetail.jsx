// app/components/DiscoverDetail.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaClock,
  FaWifi,
  FaSwimmingPool,
  FaCar,
  FaUtensils,
  FaDumbbell,
  FaPaw,
  FaTv,
  FaSnowflake,
  FaBed,
  FaArrowLeft,
  FaShareAlt,
  FaBookmark,
  FaCalendar,
  FaMoneyBillWave,
  FaUsers,
  FaParking,
  FaConciergeBell,
  FaWind,
  FaChevronLeft,
  FaChevronRight,
  FaDollarSign,
  FaWhatsapp
} from 'react-icons/fa';

const DiscoverDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { translations } = useLanguage();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });
  const [autoSlide, setAutoSlide] = useState(true);
  const [contacts, setContacts] = useState(null);

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

  const getWhatsAppLink = (phoneNumber, customMessage = '') => {
    if (!phoneNumber) return '#';
    
    let phone = phoneNumber;
    if (phone.includes('wa.me/') || phone.includes('whatsapp.com/')) {
      const match = phone.match(/\/?\+?(\d+)/);
      if (match) phone = match[1];
    }
    
    phone = phone.replace(/[^\d+]/g, '');
    const message = customMessage || `${translations.defaultWhatsappMessage?.replace('{title}', item?.title) || `Hello! I am interested in booking ${item?.title}`}`;
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  };

  const amenityIcons = {
    'free-wifi': <FaWifi className="text-blue-500" size={20} />,
    'swimming-pool': <FaSwimmingPool className="text-blue-500" size={20} />,
    'spa': <FaWind className="text-purple-500" size={20} />,
    'fitness-center': <FaDumbbell className="text-green-500" size={20} />,
    'restaurant': <FaUtensils className="text-red-500" size={20} />,
    'parking': <FaParking className="text-gray-600" size={20} />,
    'pet-friendly': <FaPaw className="text-yellow-500" size={20} />,
    'air-conditioning': <FaSnowflake className="text-cyan-500" size={20} />,
    'tv': <FaTv className="text-purple-500" size={20} />,
    'breakfast': <FaUtensils className="text-orange-500" size={20} />,
    'concierge': <FaConciergeBell className="text-indigo-500" size={20} />
  };

  const amenityLabels = {
    'free-wifi': translations.freeWifi || 'واي فاي مجاني',
    'swimming-pool': translations.swimmingPool || 'حمام سباحة',
    'spa': translations.spaWellness || 'سبا وعناية بالصحة',
    'fitness-center': translations.fitnessCenter || 'مركز لياقة بدنية',
    'restaurant': translations.restaurantAmenity || 'مطعم',
    'parking': translations.parkingAmenity || 'موقف سيارات',
    'pet-friendly': translations.petFriendly || 'مسموح بالحيوانات الأليفة',
    'air-conditioning': translations.airConditioning || 'تكييف هواء',
    'tv': translations.smartTV || 'تلفزيون ذكي',
    'breakfast': translations.breakfastIncluded || 'الإفطار مشمول',
    'concierge': translations.concierge24 || 'كونسيرج 24/7'
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/get-to-know-russia?category=${params.category}&id=${params.id}`);
        const data = await response.json();
        const formattedData = {
          ...data,
          images: data.images || [{ url: '/default-image.jpg' }],
          amenities: data.amenities || [],
          priceStartsFrom: data.priceStartsFrom || '',
          whatsapp: data.whatsapp || ''
        };
        setItem(formattedData);
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchItem();
    }
  }, [params.id, params.category]);

  // Auto slide effect
  useEffect(() => {
    if (!item || !item.images || item.images.length <= 1 || !autoSlide) return;

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % item.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [item, autoSlide]);

  const nextImage = () => {
    if (!item || !item.images) return;
    setActiveImage((prev) => (prev + 1) % item.images.length);
    setAutoSlide(false);
  };

  const prevImage = () => {
    if (!item || !item.images) return;
    setActiveImage((prev) => (prev - 1 + item.images.length) % item.images.length);
    setAutoSlide(false);
  };

  const handleBooking = () => {
    const whatsappLink = getWhatsAppLink(item.whatsapp || contacts?.whatsapp, `${translations.bookingInquiry?.replace('{title}', item.title) || `I want to book: ${item.title}`}`);
    window.open(whatsappLink, '_blank');
    setBookingModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg">
            {translations.loadingDetails || 'جاري تحميل تفاصيل التجربة...'}
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-100 to-orange-100 flex items-center justify-center">
            <FaMapMarkerAlt className="text-red-500" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {translations.experienceNotFound || 'التجربة غير موجودة'}
          </h2>
          <p className="text-gray-600 mb-8">
            {translations.notFoundMessage || 'التجربة التي تبحث عنها غير موجودة أو تمت إزالتها.'}
          </p>
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {translations.goBack || 'العودة'}
          </button>
        </div>
      </div>
    );
  }

  const isHotel = params.category === 'hotels';
  const categoryName = params.category === 'hotels' ? translations.luxuryHotels || 'الفنادق' :
                     params.category === 'restaurants' ? translations.premiumRestaurants || 'المطاعم' :
                     params.category === 'museums' ? translations.culturalMuseums || 'المتاحف الثقافية' :
                     translations.touristAttractions || 'المعالم السياحية';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <>
            <div className="relative w-full h-full">
              {item.images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === activeImage ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              
              {/* Navigation Buttons */}
              {item.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all duration-300"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all duration-300"
                  >
                    <FaChevronRight />
                  </button>
                  
                  {/* Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {item.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveImage(index);
                          setAutoSlide(false);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === activeImage
                            ? 'w-6 bg-white'
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm z-20">
                    {activeImage + 1} / {item.images.length}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        )}

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors bg-black/20 backdrop-blur-sm px-4 py-2.5 rounded-xl"
              >
                <FaArrowLeft />
                <span>{translations.backToDiscover || 'العودة إلى الاكتشاف'}</span>
              </button>
              
              <div className="flex gap-2">
                <button 
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
                  aria-label={translations.share || 'مشاركة'}
                >
                  <FaShareAlt className="text-white" />
                </button>
                <button 
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
                  aria-label={translations.bookmark || 'حفظ'}
                >
                  <FaBookmark className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 pb-8 md:pb-12">
            <div className="max-w-4xl">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-4">
                <span className="mr-2 text-xl">
                  {params.category === 'hotels' ? '🏨' : 
                   params.category === 'restaurants' ? '🍽️' :
                   params.category === 'museums' ? '🏛️' : '🏛️'}
                </span>
                <span className="font-medium">{categoryName}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {item.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 text-white/90">
                {item.address && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-white/80" />
                    <span>{item.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {translations.aboutExperience || 'حول هذه التجربة'}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="text-lg mb-6">{item.description}</p>
              </div>
            </div>

            {/* Amenities Section */}
            {item.amenities && item.amenities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  {translations.amenitiesServices || 'المرافق والخدمات'}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {item.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="mb-3 p-3 bg-white rounded-lg shadow-sm">
                        {amenityIcons[amenity] || <FaBed className="text-gray-600 text-xl" />}
                      </div>
                      <span className="text-sm font-medium text-gray-900 text-center">
                        {amenityLabels[amenity] || amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      {item.priceStartsFrom ? (
                        <>
                          <div className="text-sm text-gray-600 mb-1 flex items-center">
                            <FaDollarSign className="mr-1" />
                            {translations.priceStartsFrom || 'السعر يبدأ من'}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            ${item.priceStartsFrom}
                            <span className="text-lg font-normal text-gray-600 ml-1">
                              {translations.perNight || '/ليلة'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {translations.taxesFeesIncluded || 'يشمل الضرائب والرسوم'}
                          </div>
                        </>
                      ) : (
                        <div className="text-2xl font-bold text-gray-900">
                          {translations.contactForPrice || 'تواصل للسعر'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isHotel ? (
                    <>
                      <button
                        onClick={() => setBookingModal(true)}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] mb-4"
                      >
                        {translations.bookNow || 'احجز الآن'}
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => {
                        const whatsappLink = getWhatsAppLink(item.whatsapp || contacts?.whatsapp, `${translations.bookingInquiry?.replace('{title}', item.title) || `I want to book experience: ${item.title}`}`);
                        window.open(whatsappLink, '_blank');
                      }}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      {translations.bookExperience || 'احجز التجربة'}
                    </button>
                  )}
                </div>

                {/* Contact Information */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {translations.contactInformation || 'معلومات الاتصال'}
                  </h3>
                  
                  <div className="space-y-4">
                    {item.phone && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                        <FaPhone className="text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-600">
                            {translations.phoneNumber || 'الهاتف'}
                          </div>
                          <div className="font-medium text-gray-900">{item.phone}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* WhatsApp Button - Replaces Website */}
                    {(item.whatsapp || contacts?.whatsapp) && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                        <FaWhatsapp className="text-green-600 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-600">
                            {translations.whatsapp || 'واتساب'}
                          </div>
                          <a
                            href={getWhatsAppLink(item.whatsapp || contacts?.whatsapp, `${translations.bookingInquiry?.replace('{title}', item.title) || `Hello! I'm interested in ${item.title}`}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-green-600 hover:underline break-all flex items-center"
                          >
                            {translations.chatOnWhatsApp || 'تواصل عبر واتساب'}
                            <FaWhatsapp className="ml-2 text-sm" />
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {item.address && (
                      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                        <FaMapMarkerAlt className="text-amber-600 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-600">
                            {translations.addressLocation || 'العنوان'}
                          </div>
                          <div className="font-medium text-gray-900">{item.address}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                      <FaClock className="text-purple-600 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">
                          {translations.availability || 'التوفر'}
                        </div>
                        <div className="font-medium text-gray-900">
                          {translations.checkRealTime || 'تحقق من التوفر في الوقت الفعلي'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">
                  {translations.quickContact || 'اتصال سريع'}
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const whatsappLink = getWhatsAppLink(item.whatsapp || contacts?.whatsapp, `${translations.quickInquiry?.replace('{title}', item.title) || `Quick inquiry about ${item.title}`}`);
                      window.open(whatsappLink, '_blank');
                    }}
                    className="w-full py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
                  >
                    <FaWhatsapp className="mr-2" />
                    {translations.messageOnWhatsApp || 'رسالة عبر واتساب'}
                  </button>
                  
                  {item.phone && (
                    <a
                      href={`tel:${item.phone}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <FaPhone className="text-white/80" />
                      <span>{item.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Safety Guidelines */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {translations.safetyGuidelines || 'إرشادات السلامة'}
                </h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5 flex-shrink-0">
                      ✓
                    </div>
                    <span>{translations.covidSafety || 'إجراءات السلامة من كوفيد-19 مطبقة'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5 flex-shrink-0">
                      ✓
                    </div>
                    <span>{translations.contactlessCheckin || 'تسجيل الوصول بدون تلامس متاح'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5 flex-shrink-0">
                      ✓
                    </div>
                    <span>{translations.enhancedCleaning || 'بروتوكول تنظيف معزز'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {translations.bookYourStay || 'احجز إقامتك'}
                </h3>
                <button
                  onClick={() => setBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mb-8">{item.title}</p>
              
              <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.checkIn || 'تاريخ الوصول'}
                    </label>
                    <input
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.checkOut || 'تاريخ المغادرة'}
                    </label>
                    <input
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.guests || 'الضيوف'}
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setBookingData({...bookingData, guests: Math.max(1, bookingData.guests - 1)})}
                        className="p-3 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                      >
                        -
                      </button>
                      <div className="flex-1 p-3 border-t border-b border-gray-300 text-center">
                        {bookingData.guests} {bookingData.guests === 1 ? 
                          translations.guest || 'ضيف' : 
                          translations.guestsPlural || 'ضيوف'}
                      </div>
                      <button
                        type="button"
                        onClick={() => setBookingData({...bookingData, guests: bookingData.guests + 1})}
                        className="p-3 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.rooms || 'الغرف'}
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setBookingData({...bookingData, rooms: Math.max(1, bookingData.rooms - 1)})}
                        className="p-3 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                      >
                        -
                      </button>
                      <div className="flex-1 p-3 border-t border-b border-gray-300 text-center">
                        {bookingData.rooms} {bookingData.rooms === 1 ? 
                          translations.room || 'غرفة' : 
                          translations.roomsPlural || 'غرف'}
                      </div>
                      <button
                        type="button"
                        onClick={() => setBookingData({...bookingData, rooms: bookingData.rooms + 1})}
                        className="p-3 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Price Calculation */}
                {item.priceStartsFrom && (
                  <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="text-sm text-gray-600">
                          {translations.totalPrice || 'السعر الإجمالي'}
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          ${parseInt(item.priceStartsFrom) * bookingData.rooms * 5}
                        </div>
                        <div className="text-sm text-gray-600">
                          {translations.includesTaxes || 'لمدة 5 ليالي • يشمل الضرائب والرسوم'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-600 mb-1">
                          25% {translations.off || 'خصم'}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {translations.saveAmount?.replace('{amount}', Math.round(parseInt(item.priceStartsFrom) * 0.25)) || `وفر $${Math.round(parseInt(item.priceStartsFrom) * 0.25)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setBookingModal(false)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    {translations.cancel || 'إلغاء'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const message = `${translations.bookingRequest?.replace('{title}', item.title) || `Booking request for ${item.title}`}:
                      ${translations.checkInLabel?.replace('{checkIn}', bookingData.checkIn) || `Check-in: ${bookingData.checkIn}`}
                      ${translations.checkOutLabel?.replace('{checkOut}', bookingData.checkOut) || `Check-out: ${bookingData.checkOut}`}
                      ${translations.guestsLabel?.replace('{guests}', bookingData.guests) || `Guests: ${bookingData.guests}`}
                      ${translations.roomsLabel?.replace('{rooms}', bookingData.rooms) || `Rooms: ${bookingData.rooms}`}
                      ${item.priceStartsFrom ? `${translations.estimatedPrice?.replace('{price}', `$${parseInt(item.priceStartsFrom) * bookingData.rooms * 5}`) || `Estimated Price: $${parseInt(item.priceStartsFrom) * bookingData.rooms * 5} (for 5 nights)`}` : ''}`;
                      
                      const whatsappLink = getWhatsAppLink(item.whatsapp || contacts?.whatsapp, message);
                      window.open(whatsappLink, '_blank');
                      setBookingModal(false);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition hover:scale-[1.02]"
                  >
                    {translations.confirmBooking || 'تأكيد الحجز'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverDetail;