'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import {
  FaStar,
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
  FaShower,
  FaBed,
  FaArrowLeft,
  FaShareAlt,
  FaBookmark,
  FaCalendar,
  FaMoneyBillWave,
  FaUsers,
  FaParking,
  FaConciergeBell,
  FaWind
} from 'react-icons/fa';
import { MdPool, MdSpa, MdRestaurant, MdFitnessCenter } from 'react-icons/md';

const DiscoverDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { translations } = useLanguage();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedAmenity, setSelectedAmenity] = useState('all');
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });

  const amenityIcons = {
    'free-wifi': <FaWifi className="text-blue-600" size={20} />,
    'swimming-pool': <MdPool className="text-blue-600" size={20} />,
    'spa': <MdSpa className="text-purple-600" size={20} />,
    'fitness-center': <MdFitnessCenter className="text-green-600" size={20} />,
    'restaurant': <MdRestaurant className="text-red-600" size={20} />,
    'parking': <FaParking className="text-gray-600" size={20} />,
    'pet-friendly': <FaPaw className="text-yellow-600" size={20} />,
    'air-conditioning': <FaWind className="text-cyan-600" size={20} />,
    'tv': <FaTv className="text-purple-600" size={20} />,
    'breakfast': <FaUtensils className="text-orange-600" size={20} />,
    'concierge': <FaConciergeBell className="text-indigo-600" size={20} />
  };

  const amenityLabels = {
    'free-wifi': translations.freeWifi || 'Free WiFi',
    'swimming-pool': translations.swimmingPool || 'Swimming Pool',
    'spa': translations.spaWellness || 'Spa & Wellness',
    'fitness-center': translations.fitnessCenter || 'Fitness Center',
    'restaurant': translations.restaurantAmenity || 'Restaurant',
    'parking': translations.parkingAmenity || 'Parking',
    'pet-friendly': translations.petFriendly || 'Pet Friendly',
    'air-conditioning': translations.airConditioning || 'Air Conditioning',
    'tv': translations.smartTV || 'Smart TV',
    'breakfast': translations.breakfastIncluded || 'Breakfast Included',
    'concierge': translations.concierge24 || '24/7 Concierge'
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/get-to-know-russia?category=${params.category}&id=${params.id}`);
        const data = await response.json();
        setItem(data);
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        size={20}
      />
    ));
  };

  const renderPriceRange = (priceRange) => {
    const ranges = {
      '$': { label: translations.budget || 'Budget', color: 'text-green-600' },
      '$$': { label: translations.moderate || 'Moderate', color: 'text-blue-600' },
      '$$$': { label: translations.expensive || 'Expensive', color: 'text-purple-600' },
      '$$$$': { label: translations.luxury || 'Luxury', color: 'text-amber-600' }
    };
    
    const range = ranges[priceRange] || { label: 'N/A', color: 'text-gray-600' };
    
    return (
      <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${range.color.replace('text-', 'from-')}/10 ${range.color}`}>
        <FaMoneyBillWave className="mr-2" />
        <span className="font-bold">{priceRange}</span>
        <span className="ml-2">• {range.label}</span>
      </div>
    );
  };

  const handleBooking = () => {
    alert('Booking functionality coming soon!');
    setBookingModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg">
            {translations.loadingDetails || 'Loading experience details...'}
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-100 to-orange-100 flex items-center justify-center">
            <FaMapMarkerAlt className="text-red-500" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {translations.experienceNotFound || 'Experience Not Found'}
          </h2>
          <p className="text-gray-600 mb-8">
            {translations.notFoundMessage || 'The experience you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            {translations.goBack || 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  const isHotel = params.category === 'hotels';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="relative h-[600px] overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <>
            <Image
              src={item.images[activeImage].url}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        )}

        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center text-white hover:text-gray-200 transition-colors duration-300 bg-black/20 backdrop-blur-sm px-4 py-2.5 rounded-xl"
              >
                <FaArrowLeft className="mr-3" />
                {translations.backToDiscover || 'Back to Discover'}
              </button>
              
              <div className="flex items-center space-x-4">
                <button 
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-colors duration-300"
                  aria-label={translations.share || 'Share'}
                >
                  <FaShareAlt className="text-white" />
                </button>
                <button 
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-colors duration-300"
                  aria-label={translations.bookmark || 'Bookmark'}
                >
                  <FaBookmark className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-6 pb-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6">
                <span className="mr-2 text-xl">
                  {params.category === 'hotels' ? '🏨' : 
                   params.category === 'restaurants' ? '🍽️' :
                   params.category === 'museums' ? '🏛️' : '🏛️'}
                </span>
                <span className="font-medium">
                  {params.category === 'hotels' ? translations.luxuryHotels || 'Luxury Hotels' :
                   params.category === 'restaurants' ? translations.premiumRestaurants || 'Premium Restaurants' :
                   params.category === 'museums' ? translations.culturalMuseums || 'Cultural Museums' :
                   params.category.replace(/([A-Z])/g, ' $1')}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {item.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                {item.address && (
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{item.address}</span>
                  </div>
                )}
                
                {item.rating && (
                  <div className="flex items-center">
                    {renderStars(parseInt(item.rating))}
                    <span className="ml-2 font-bold">{item.rating}/5</span>
                  </div>
                )}
                
                {item.priceRange && renderPriceRange(item.priceRange)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {item.images && item.images.length > 1 && (
              <div className="mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative h-32 rounded-xl overflow-hidden transition-all duration-300 ${
                        activeImage === index ? 'ring-4 ring-blue-500 ring-offset-2' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.title || item.title}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {translations.aboutExperience || 'About This Experience'}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p>{item.description}</p>
                
                {isHotel && (
                  <>
                    <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">
                      {translations.whatMakesSpecial || 'What Makes This Special'}
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <FaConciergeBell className="text-blue-600" />
                        </div>
                        <span>{translations.personalizedConcierge || 'Personalized concierge service available 24/7'}</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <FaUsers className="text-green-600" />
                        </div>
                        <span>{translations.exclusiveAccess || 'Exclusive access to local experiences and tours'}</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                          <FaCalendar className="text-purple-600" />
                        </div>
                        <span>{translations.flexibleBooking || 'Flexible booking and cancellation policy'}</span>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>

            {item.amenities && item.amenities.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {translations.amenitiesServices || 'Amenities & Services'}
                  </h2>
                  <div className="flex space-x-2">
                    {[
                      { value: 'all', label: translations.allAmenities || 'All' },
                      { value: 'essential', label: translations.essentialAmenities || 'Essential' },
                      { value: 'luxury', label: translations.luxuryAmenities || 'Luxury' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedAmenity(type.value)}
                        className={`px-4 py-2 rounded-full capitalize transition-colors ${
                          selectedAmenity === type.value
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {item.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="mb-4 p-3 bg-white rounded-xl shadow-sm">
                        {amenityIcons[amenity] || <FaBed className="text-gray-600" size={24} />}
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

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {isHotel ? translations.fromPrice || 'From $299' : translations.bookExperience || 'Experience'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {translations.perNight || 'per night'}
                      </div>
                    </div>
                    {item.rating && (
                      <div className="text-right">
                        <div className="flex items-center justify-end mb-1">
                          {renderStars(parseInt(item.rating))}
                        </div>
                        <div className="text-sm text-gray-600">
                          {translations.excellentReviews || 'Excellent • 128 reviews'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {isHotel ? (
                    <>
                      <button
                        onClick={() => setBookingModal(true)}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 mb-4"
                      >
                        {translations.bookNow || 'Book Now'}
                      </button>
                      <button className="w-full py-4 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors duration-300">
                        {translations.saveForLater || 'Save for Later'}
                      </button>
                    </>
                  ) : (
                    <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                      {translations.bookExperience || 'Book Experience'}
                    </button>
                  )}
                </div>

                <div className="p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {translations.contactInformation || 'Contact Information'}
                  </h3>
                  
                  {item.phone && (
                    <div className="flex items-center mb-4 p-3 bg-blue-50 rounded-xl">
                      <FaPhone className="text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">
                          {translations.phoneNumber || 'Phone'}
                        </div>
                        <div className="font-medium text-gray-900">{item.phone}</div>
                      </div>
                    </div>
                  )}
                  
                  {item.address && (
                    <div className="flex items-center mb-4 p-3 bg-green-50 rounded-xl">
                      <FaMapMarkerAlt className="text-green-600 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">
                          {translations.addressLocation || 'Address'}
                        </div>
                        <div className="font-medium text-gray-900">{item.address}</div>
                      </div>
                    </div>
                  )}
                  
                  {item.website && (
                    <div className="flex items-center mb-4 p-3 bg-purple-50 rounded-xl">
                      <FaGlobe className="text-purple-600 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">
                          {translations.website || 'Website'}
                        </div>
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {translations.visitWebsite || 'Visit Website'}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center p-3 bg-amber-50 rounded-xl">
                    <FaClock className="text-amber-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">
                        {translations.availability || 'Availability'}
                      </div>
                      <div className="font-medium text-gray-900">
                        {translations.checkRealTime || 'Check real-time availability'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {translations.safetyGuidelines || 'Safety & Guidelines'}
                </h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-600 rounded-full p-1 mr-2 mt-0.5">✓</div>
                    <span>{translations.covidSafety || 'COVID-19 safety measures in place'}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-600 rounded-full p-1 mr-2 mt-0.5">✓</div>
                    <span>{translations.contactlessCheckin || 'Contactless check-in available'}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-600 rounded-full p-1 mr-2 mt-0.5">✓</div>
                    <span>{translations.enhancedCleaning || 'Enhanced cleaning protocol'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {bookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {translations.bookYourStay || 'Book Your Stay'}
              </h3>
              <p className="text-gray-600">{item.title}</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.checkIn || 'Check-in'}
                  </label>
                  <input
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.checkOut || 'Check-out'}
                  </label>
                  <input
                    type="date"
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.guests || 'Guests'}
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setBookingData({...bookingData, guests: Math.max(1, bookingData.guests - 1)})}
                      className="p-2 border border-gray-200 rounded-l-xl"
                    >
                      -
                    </button>
                    <div className="flex-1 p-2 border-t border-b border-gray-200 text-center">
                      {bookingData.guests} {bookingData.guests === 1 ? 
                        translations.guest || 'Guest' : 
                        translations.guestsPlural || 'Guests'}
                    </div>
                    <button
                      onClick={() => setBookingData({...bookingData, guests: bookingData.guests + 1})}
                      className="p-2 border border-gray-200 rounded-r-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.rooms || 'Rooms'}
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setBookingData({...bookingData, rooms: Math.max(1, bookingData.rooms - 1)})}
                      className="p-2 border border-gray-200 rounded-l-xl"
                    >
                      -
                    </button>
                    <div className="flex-1 p-2 border-t border-b border-gray-200 text-center">
                      {bookingData.rooms} {bookingData.rooms === 1 ? 
                        translations.room || 'Room' : 
                        translations.roomsPlural || 'Rooms'}
                    </div>
                    <button
                      onClick={() => setBookingData({...bookingData, rooms: bookingData.rooms + 1})}
                      className="p-2 border border-gray-200 rounded-r-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">
                      {translations.totalPrice || 'Total Price'}
                    </div>
                    <div className="text-3xl font-bold text-gray-900">$1,497</div>
                    <div className="text-sm text-gray-600">
                      {translations.includesTaxes || 'for 5 nights • Includes taxes & fees'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 mb-1">
                      25% {translations.off || 'off'}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {translations.saveAmount || 'Save $499'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setBookingModal(false)}
                  className="flex-1 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  {translations.cancel || 'Cancel'}
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300"
                >
                  {translations.confirmBooking || 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverDetail;