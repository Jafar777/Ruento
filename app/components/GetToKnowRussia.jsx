// app/components/GetToKnowRussia.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaClock, FaTicketAlt } from 'react-icons/fa';

const GetToKnowRussia = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('restaurants');
  const [activeItems, setActiveItems] = useState({});
  const { translations } = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/get-to-know-russia');
        const data = await response.json();
        setCategories(data);
        
        // Initialize active items
        const initialActiveItems = {};
        data.forEach(category => {
          initialActiveItems[category.type] = 0;
        });
        setActiveItems(initialActiveItems);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const nextItem = (category) => {
    setActiveItems(prev => {
      const categoryData = categories.find(c => c.type === category);
      if (!categoryData) return prev;
      
      return {
        ...prev,
        [category]: (prev[category] + 1) % categoryData.items.length
      };
    });
  };

  const prevItem = (category) => {
    setActiveItems(prev => {
      const categoryData = categories.find(c => c.type === category);
      if (!categoryData) return prev;
      
      return {
        ...prev,
        [category]: (prev[category] - 1 + categoryData.items.length) % categoryData.items.length
      };
    });
  };

  const nextImage = (category, itemIndex) => {
    setCategories(prev => {
      const newCategories = [...prev];
      const categoryIndex = newCategories.findIndex(c => c.type === category);
      if (categoryIndex === -1) return prev;
      
      const item = newCategories[categoryIndex].items[itemIndex];
      if (!item.images || item.images.length <= 1) return prev;
      
      const currentImageIndex = item.currentImageIndex || 0;
      const newImageIndex = (currentImageIndex + 1) % item.images.length;
      
      newCategories[categoryIndex].items[itemIndex] = {
        ...item,
        currentImageIndex: newImageIndex
      };
      
      return newCategories;
    });
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </section>
    );
  }

  const categoryIcons = {
    restaurants: '🍽️',
    touristAttractions: '🏛️',
    events: '🎪',
    shopping: '🛍️',
    museums: '🏛️',
    naturalPlaces: '🏞️'
  };

  const categoryTitles = {
    restaurants: translations.restaurants || 'Restaurants',
    touristAttractions: translations.touristAttractions || 'Tourist Attractions',
    events: translations.events || 'Events',
    shopping: translations.shopping || 'Shopping',
    museums: translations.museums || 'Museums',
    naturalPlaces: translations.naturalPlaces || 'Natural Places'
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {translations.getToKnowRussia || 'Get to Know Russia'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {translations.discoverRussia || 'Discover the diverse beauty and rich culture of Russia through its many attractions'}
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.type}
              onClick={() => setActiveCategory(category.type)}
              className={`px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.type
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-800 shadow-md hover:shadow-lg'
              }`}
            >
              <span className="text-xl mr-2">{categoryIcons[category.type]}</span>
              {categoryTitles[category.type]}
            </button>
          ))}
        </div>

        {/* Category Content */}
        {categories.map((category) => (
          <div
            key={category.type}
            className={`transition-all duration-500 ${
              activeCategory === category.type ? 'opacity-100 block' : 'opacity-0 hidden'
            }`}
          >
            {category.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  {translations.noContent || 'No content available for this category yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {/* Image Slider */}
                    <div className="relative h-64 overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <>
                          <Image
                            src={item.images[item.currentImageIndex || 0].url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          
                          {item.images.length > 1 && (
                            <>
                              <button
                                onClick={() => {
                                  const newCategories = [...categories];
                                  const catIndex = newCategories.findIndex(c => c.type === category.type);
                                  const currentImageIndex = newCategories[catIndex].items[itemIndex].currentImageIndex || 0;
                                  const newImageIndex = (currentImageIndex - 1 + item.images.length) % item.images.length;
                                  
                                  newCategories[catIndex].items[itemIndex] = {
                                    ...item,
                                    currentImageIndex: newImageIndex
                                  };
                                  
                                  setCategories(newCategories);
                                }}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition"
                              >
                                <FaChevronLeft />
                              </button>
                              <button
                                onClick={() => nextImage(category.type, itemIndex)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition"
                              >
                                <FaChevronRight />
                              </button>
                              
                              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                {item.images.map((_, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className={`w-2 h-2 rounded-full ${
                                      (item.currentImageIndex || 0) === imgIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <span className="text-5xl">{categoryIcons[category.type]}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      
                      {/* Image Details */}
                      {item.images && item.images.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            {item.images[item.currentImageIndex || 0].title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {item.images[item.currentImageIndex || 0].description}
                          </p>
                        </div>
                      )}
                      
                      {/* Category-specific info */}
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        {category.type === 'events' && (
                          <>
                            <FaClock className="mr-1" />
                            <span>Upcoming Event</span>
                          </>
                        )}
                        {category.type === 'touristAttractions' && (
                          <>
                            <FaMapMarkerAlt className="mr-1" />
                            <span>Popular Destination</span>
                          </>
                        )}
                        {category.type === 'museums' && (
                          <>
                            <FaTicketAlt className="mr-1" />
                            <span>Cultural Experience</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default GetToKnowRussia;