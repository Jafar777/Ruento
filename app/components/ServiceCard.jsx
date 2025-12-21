// app/components/ServiceCard.jsx
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaStar, FaClock, FaUsers, FaMapMarkerAlt,
  FaCheck, FaArrowRight, FaShareAlt,
  FaBookmark, FaHeart, FaImage
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const ServiceCard = ({ service }) => {
  const { translations, currentLanguage } = useLanguage();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Default image URL
  const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

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

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {!imageError && (service.images?.[0] || defaultImage) ? (
          <img 
            src={service.images?.[0] || defaultImage} 
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              setImageError(true);
              e.target.src = defaultImage;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center text-gray-400">
              <FaImage className="text-4xl mx-auto mb-2" />
              <p className="text-sm">لا توجد صورة</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
            {getCategoryName(service.type)}
          </span>
          {service.rating && (
            <span className="px-3 py-1 bg-yellow-500 text-yellow-900 text-sm rounded-full flex items-center gap-1">
              <FaStar className="text-xs" /> {service.rating}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-full ${isBookmarked ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}
          >
            <FaBookmark className={isBookmarked ? 'fill-current' : ''} />
          </button>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full ${isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}
          >
            <FaHeart className={isLiked ? 'fill-current' : ''} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Icon */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
              {service.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-2xl">{service.icon}</span>
              <span className="text-sm">{getCategoryName(service.type)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Quick Facts */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {service.duration && (
            <div className="flex items-center gap-2 text-gray-700">
              <FaClock className="text-blue-500" />
              <span className="text-sm">{service.duration}</span>
            </div>
          )}
          {service.groupSize && (
            <div className="flex items-center gap-2 text-gray-700">
              <FaUsers className="text-green-500" />
              <span className="text-sm">{service.groupSize}</span>
            </div>
          )}
          {service.locations && (
            <div className="flex items-center gap-2 text-gray-700">
              <FaMapMarkerAlt className="text-red-500" />
              <span className="text-sm">
                {Array.isArray(service.locations) ? service.locations[0] : service.locations}
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              {translations.whatsIncluded || 'ما المضمن'}
            </h4>
            <div className="space-y-1">
              {service.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheck className="text-green-500 text-xs" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              ${service.price || 499}
              <span className="text-sm text-gray-500 ml-1">
                / {service.priceUnit || 'للشخص'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {translations.startingFrom || 'بداية من'}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link 
              href={`/services/${service.type}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              {translations.learnMore || 'اعرف المزيد'}
              <FaArrowRight className={currentLanguage === 'ar' ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;