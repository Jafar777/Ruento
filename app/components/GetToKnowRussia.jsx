// app/components/GetToKnowRussia.jsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaClock, FaTicketAlt, FaStar, FaPhone, FaGlobe, FaWifi, FaSwimmingPool, FaCar, FaUtensils, FaDumbbell, FaPaw, FaTv, FaSnowflake, FaShower, FaBed } from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GetToKnowRussia = ({id}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('restaurants');
  const [activeItems, setActiveItems] = useState({});
  const { translations } = useLanguage();

  // Create refs for elements to animate
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const categoryButtonsRef = useRef([]);
  const categoryContentRef = useRef(null);
  const itemCardsRef = useRef([]);

  // Amenity icons mapping
  const amenityIcons = {
    'free-wifi': <FaWifi className="text-blue-500" />,
    'swimming-pool': <FaSwimmingPool className="text-blue-500" />,
    'spa': <FaShower className="text-purple-500" />,
    'fitness-center': <FaDumbbell className="text-green-500" />,
    'restaurant': <FaUtensils className="text-red-500" />,
    'parking': <FaCar className="text-gray-500" />,
    'pet-friendly': <FaPaw className="text-yellow-500" />,
    'air-conditioning': <FaSnowflake className="text-cyan-500" />,
    'tv': <FaTv className="text-purple-500" />,
    'breakfast': <FaUtensils className="text-orange-500" />
  };

  const amenityLabels = {
    'free-wifi': 'Free WiFi',
    'swimming-pool': 'Swimming Pool',
    'spa': 'Spa',
    'fitness-center': 'Fitness Center',
    'restaurant': 'Restaurant',
    'parking': 'Free Parking',
    'pet-friendly': 'Pet Friendly',
    'air-conditioning': 'Air Conditioning',
    'tv': 'TV',
    'breakfast': 'Free Breakfast'
  };

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

  // Set up animations after data is loaded and component is mounted
  useEffect(() => {
    if (categories.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            markers: false,
          }
        }
      );

      categoryButtonsRef.current.forEach((buttonRef, index) => {
        if (!buttonRef) return;
        
        gsap.fromTo(buttonRef,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: buttonRef,
              start: 'top 85%',
              toggleActions: 'play none none none',
              markers: false,
            }
          }
        );
      });

      gsap.fromTo(categoryContentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: categoryContentRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            markers: false,
          }
        }
      );

      if (itemCardsRef.current.length > 0) {
        itemCardsRef.current.forEach((cardRef, index) => {
          if (!cardRef) return;
          
          gsap.fromTo(cardRef,
            { opacity: 0, y: 40, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              delay: index * 0.1,
              scrollTrigger: {
                trigger: cardRef,
                start: 'top 85%',
                toggleActions: 'play none none none',
                markers: false,
              }
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [categories, activeCategory]);

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

  const prevImage = (category, itemIndex) => {
    setCategories(prev => {
      const newCategories = [...prev];
      const categoryIndex = newCategories.findIndex(c => c.type === category);
      if (categoryIndex === -1) return prev;
      
      const item = newCategories[categoryIndex].items[itemIndex];
      if (!item.images || item.images.length <= 1) return prev;
      
      const currentImageIndex = item.currentImageIndex || 0;
      const newImageIndex = (currentImageIndex - 1 + item.images.length) % item.images.length;
      
      newCategories[categoryIndex].items[itemIndex] = {
        ...item,
        currentImageIndex: newImageIndex
      };
      
      return newCategories;
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  const renderPriceRange = (priceRange) => {
    const ranges = {
      '$': 'Budget',
      '$$': 'Moderate',
      '$$$': 'Expensive',
      '$$$$': 'Luxury'
    };
    return (
      <span className="font-semibold text-green-600">
        {priceRange} • {ranges[priceRange]}
      </span>
    );
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
    naturalPlaces: '🏞️',
    hotels: '🏨'
  };

  const categoryTitles = {
    restaurants: translations.restaurants || 'Restaurants',
    touristAttractions: translations.touristAttractions || 'Tourist Attractions',
    events: translations.events || 'Events',
    shopping: translations.shopping || 'Shopping',
    museums: translations.museums || 'Museums',
    naturalPlaces: translations.naturalPlaces || 'Natural Places',
    hotels: translations.hotels || 'Hotels'
  };

  return (
    <section id={id} ref={sectionRef} className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto relative z-10">
        <div ref={titleRef} className="text-center mb-16">
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
          {categories.map((category, index) => (
            <button
              key={category.type}
              ref={el => categoryButtonsRef.current[index] = el}
              onClick={() => setActiveCategory(category.type)}
              className={`category-button px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
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
        <div ref={categoryContentRef}>
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
                <div className={`grid gap-8 ${
                  category.type === 'hotels' 
                    ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      ref={el => itemCardsRef.current[itemIndex] = el}
                      className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                        category.type === 'hotels' ? 'h-full flex flex-col' : ''
                      }`}
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
                                  onClick={() => prevImage(category.type, itemIndex)}
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
                      <div className={`p-6 ${category.type === 'hotels' ? 'flex-1 flex flex-col' : ''}`}>
                        {/* Hotel Specific Content */}
                        {category.type === 'hotels' ? (
                          <div className="flex-1">
                            {/* Hotel Header */}
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                              <div className="text-right">
                                <div className="flex items-center justify-end mb-1">
                                  {renderStars(parseInt(item.rating) || 0)}
                                  <span className="ml-1 text-sm text-gray-600">({item.rating})</span>
                                </div>
                                <div className="text-lg font-semibold">
                                  {renderPriceRange(item.priceRange)}
                                </div>
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-4">
                              {item.address && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                                  <span>{item.address}</span>
                                </div>
                              )}
                              {item.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <FaPhone className="mr-2 text-green-500" />
                                  <span>{item.phone}</span>
                                </div>
                              )}
                              {item.website && (
                                <div className="flex items-center text-sm">
                                  <FaGlobe className="mr-2 text-blue-500" />
                                  <a 
                                    href={item.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline truncate"
                                  >
                                    {item.website.replace(/^https?:\/\//, '')}
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 mb-4 text-sm">{item.description}</p>

                            {/* Amenities */}
                            {item.amenities && item.amenities.length > 0 && (
                              <div className="mt-auto">
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">Amenities:</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {item.amenities.slice(0, 6).map((amenity, index) => (
                                    <div key={index} className="flex items-center text-xs text-gray-600">
                                      <span className="mr-1">
                                        {amenityIcons[amenity] || <FaBed className="text-gray-400" />}
                                      </span>
                                      <span>{amenityLabels[amenity] || amenity}</span>
                                    </div>
                                  ))}
                                  {item.amenities.length > 6 && (
                                    <div className="text-xs text-gray-500">
                                      +{item.amenities.length - 6} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Standard Content for other categories */
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
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