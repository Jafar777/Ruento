// app/components/ServiceCard.jsx
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaStar, FaClock, FaUsers, FaMapMarkerAlt,
  FaCheck, FaArrowRight, FaShareAlt,
  FaBookmark, FaHeart, FaImage, FaTag
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

// Constants
const CATEGORY_TRANSLATIONS = {
  'plans': 'الخطط',
  'transportation': 'النقل',
  'hotels': 'الفنادق',
  'residence': 'الإقامة',
  'restaurants': 'المطاعم',
  'tourist-attractions': 'المعالم السياحية',
  'events': 'الفعاليات',
  'shopping': 'التسوق',
  'museums': 'المتاحف',
  'natural-places': 'الأماكن الطبيعية',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
const DEFAULT_IMAGE_PLACEHOLDER = '/images/service-placeholder.jpg';

// Sub-components

// Image Section Component
const ServiceImage = ({ service, isBookmarked, isLiked, onBookmarkToggle, onLikeToggle }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = service.images?.[0] || DEFAULT_IMAGE;

  return (
    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      {!imageError ? (
        <img 
          src={imageUrl} 
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-gray-400">
            <FaImage className="text-4xl mx-auto mb-2" />
            <p className="text-sm">لا توجد صورة</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
};

// Badges Component
const ServiceBadges = ({ service, getCategoryName }) => (
  <div className="absolute top-4 left-4 flex gap-2">
    <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-full shadow-md">
      {getCategoryName(service.type)}
    </span>
    {service.rating && (
      <span className="px-3 py-1 bg-yellow-500 text-yellow-900 text-sm rounded-full flex items-center gap-1 shadow-md">
        <FaStar className="text-xs" /> {service.rating}
      </span>
    )}
  </div>
);

// Action Buttons Component
const ActionButtons = ({ isBookmarked, isLiked, onBookmarkToggle, onLikeToggle }) => (
  <div className="absolute top-4 right-4 flex gap-2">
    <button 
      onClick={onBookmarkToggle}
      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
        isBookmarked 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
      }`}
      aria-label={isBookmarked ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
    >
      <FaBookmark className={isBookmarked ? 'fill-current' : ''} />
    </button>
    <button 
      onClick={onLikeToggle}
      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
        isLiked 
          ? 'bg-red-500 text-white shadow-lg' 
          : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
      }`}
      aria-label={isLiked ? "إلغاء الإعجاب" : "إعجاب"}
    >
      <FaHeart className={isLiked ? 'fill-current' : ''} />
    </button>
  </div>
);

// Quick Facts Component
const QuickFacts = ({ service }) => (
  <div className="grid grid-cols-2 gap-4 mb-6">
    {service.duration && (
      <div className="flex items-center gap-2 text-gray-700">
        <div className="p-2 bg-blue-50 rounded-lg">
          <FaClock className="text-blue-500" />
        </div>
        <div>
          <p className="text-xs text-gray-500">المدة</p>
          <p className="text-sm font-medium">{service.duration}</p>
        </div>
      </div>
    )}
    
    {service.groupSize && (
      <div className="flex items-center gap-2 text-gray-700">
        <div className="p-2 bg-green-50 rounded-lg">
          <FaUsers className="text-green-500" />
        </div>
        <div>
          <p className="text-xs text-gray-500">حجم المجموعة</p>
          <p className="text-sm font-medium">{service.groupSize}</p>
        </div>
      </div>
    )}
    
    {service.locations && (
      <div className="flex items-center gap-2 text-gray-700 col-span-2">
        <div className="p-2 bg-red-50 rounded-lg">
          <FaMapMarkerAlt className="text-red-500" />
        </div>
        <div>
          <p className="text-xs text-gray-500">الموقع</p>
          <p className="text-sm font-medium">
            {Array.isArray(service.locations) ? service.locations.join(', ') : service.locations}
          </p>
        </div>
      </div>
    )}
  </div>
);

// Features Component
const ServiceFeatures = ({ service, translations }) => {
  if (!service.features || service.features.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        {translations.whatsIncluded || 'ما المضمن'}
      </h4>
      <div className="space-y-2">
        {service.features.slice(0, 3).map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheck className="text-green-600 text-xs" />
            </div>
            <span className="text-sm text-gray-600 flex-1">{feature}</span>
          </div>
        ))}
        {service.features.length > 3 && (
          <p className="text-xs text-blue-500 text-right mt-2">
            +{service.features.length - 3} أكثر
          </p>
        )}
      </div>
    </div>
  );
};

// Price Section Component
const PriceSection = ({ service, translations, currentLanguage }) => (
  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
    <div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-800">
          ${service.price?.toLocaleString() || '499'}
        </span>
        <span className="text-sm text-gray-500 mr-2">
          / {service.priceUnit || 'للشخص'}
        </span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {translations.startingFrom || 'بداية من'}
      </div>
    </div>
    
    <Link 
      href={`/services/${service.type}`}
      className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
    >
      <span className="font-medium">{translations.learnMore || 'اعرف المزيد'}</span>
      <FaArrowRight className={`transition-transform duration-300 group-hover:translate-x-1 ${
        currentLanguage === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''
      }`} />
    </Link>
  </div>
);

// Header Section Component
const HeaderSection = ({ service, getCategoryName }) => (
  <div className="flex items-start justify-between mb-4">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{service.icon}</span>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {getCategoryName(service.type)}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
        {service.title}
      </h3>
    </div>
  </div>
);

// Main ServiceCard Component
const ServiceCard = ({ service }) => {
  const { translations, currentLanguage } = useLanguage();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getCategoryName = (type) => {
    return translations[type] || CATEGORY_TRANSLATIONS[type] || type;
  };

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleLikeToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Image Section with Overlays */}
      <div className="relative h-48 overflow-hidden">
        <ServiceImage 
          service={service}
          isBookmarked={isBookmarked}
          isLiked={isLiked}
          onBookmarkToggle={handleBookmarkToggle}
          onLikeToggle={handleLikeToggle}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Badges and Actions */}
        <ServiceBadges service={service} getCategoryName={getCategoryName} />
        <ActionButtons 
          isBookmarked={isBookmarked}
          isLiked={isLiked}
          onBookmarkToggle={handleBookmarkToggle}
          onLikeToggle={handleLikeToggle}
        />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header with Title and Category */}
        <HeaderSection service={service} getCategoryName={getCategoryName} />

        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Quick Facts */}
        <QuickFacts service={service} />

        {/* Features List */}
        <ServiceFeatures service={service} translations={translations} />

        {/* Price and Action Button */}
        <PriceSection 
          service={service} 
          translations={translations} 
          currentLanguage={currentLanguage} 
        />
      </div>
    </div>
  );
};

export default ServiceCard;