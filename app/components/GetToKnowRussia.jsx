'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaMapMarkerAlt, 
  FaStar, 
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
  FaArrowRight,
  FaRegHeart,
  FaHeart,
  FaShare,
  FaBookmark,
  FaDollarSign
} from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GetToKnowRussia = ({ id }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('restaurants');
  const [activeItems, setActiveItems] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const { translations } = useLanguage();

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const categoryButtonsRef = useRef([]);

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

  const categoryConfig = {
    restaurants: {
      icon: '🍽️',
      color: 'from-red-500 to-orange-500',
      gradient: 'bg-gradient-to-br from-red-50 to-orange-50',
      buttonColor: 'hover:bg-red-500/10 text-red-600',
      borderColor: 'border-red-200',
      title: translations.premiumRestaurants || 'Premium Restaurants'
    },
    touristAttractions: {
      icon: '🏛️',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      buttonColor: 'hover:bg-blue-500/10 text-blue-600',
      borderColor: 'border-blue-200',
      title: translations.touristAttractions || 'Tourist Attractions'
    },
    events: {
      icon: '🎪',
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
      buttonColor: 'hover:bg-purple-500/10 text-purple-600',
      borderColor: 'border-purple-200',
      title: translations.events || 'Events'
    },
    shopping: {
      icon: '🛍️',
      color: 'from-emerald-500 to-green-500',
      gradient: 'bg-gradient-to-br from-emerald-50 to-green-50',
      buttonColor: 'hover:bg-emerald-500/10 text-emerald-600',
      borderColor: 'border-emerald-200',
      title: translations.shopping || 'Shopping'
    },
    museums: {
      icon: '🏛️',
      color: 'from-amber-500 to-yellow-500',
      gradient: 'bg-gradient-to-br from-amber-50 to-yellow-50',
      buttonColor: 'hover:bg-amber-500/10 text-amber-600',
      borderColor: 'border-amber-200',
      title: translations.museums || 'Museums'
    },
    naturalPlaces: {
      icon: '🏞️',
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
      buttonColor: 'hover:bg-green-500/10 text-green-600',
      borderColor: 'border-green-200',
      title: translations.naturalPlaces || 'Natural Places'
    },
    hotels: {
      icon: '🏨',
      color: 'from-indigo-500 to-purple-500',
      gradient: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      buttonColor: 'hover:bg-indigo-500/10 text-indigo-600',
      borderColor: 'border-indigo-200',
      title: translations.luxuryHotels || 'Luxury Hotels'
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/get-to-know-russia');
        const data = await response.json();
        
        const processedData = data.map(category => ({
          ...category,
          items: category.items.map((item, idx) => {
            const itemId = item.id || `${category.type}-${idx}-${Date.now()}`;
            const slug = item.slug || 
              (item.title 
                ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
                : `${category.type}-${idx}`);
            
            return {
              ...item,
              id: itemId,
              slug: slug
            };
          })
        }));
        
        setCategories(processedData);
        
        const initialActiveItems = {};
        processedData.forEach(category => {
          initialActiveItems[category.type] = 0;
        });
        setActiveItems(initialActiveItems);
        
        const savedFavorites = localStorage.getItem('russiaFavorites');
        if (savedFavorites) {
          setFavorites(new Set(JSON.parse(savedFavorites)));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
          }
        }
      );

      categoryButtonsRef.current.forEach((buttonRef, index) => {
        if (!buttonRef) return;
        
        gsap.fromTo(buttonRef,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: buttonRef,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [categories]);

  const toggleFavorite = (itemId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('russiaFavorites', JSON.stringify([...newFavorites]));
  };

  const renderStars = (rating) => {
    const stars = [];
    const numericRating = parseInt(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={`${i <= numericRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const truncateText = (text, length = 100) => {
    if (!text) return translations.exploreCulture || 'Experience the best of Russian culture and hospitality';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  if (loading) {
    return (
      <section className="py-32 px-4 bg-white">
        <div className="container mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">{translations.loadingExperiences || 'Loading experiences...'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} ref={sectionRef} className="py-32 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="container mx-auto relative z-10">
        <div ref={titleRef} className="text-center mb-20">

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {translations.getToKnowRussia || 'Experience Russia'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {translations.exploreCulture || 'Explore the rich culture, breathtaking landscapes, and unique experiences that make Russia extraordinary'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category, index) => {
            const config = categoryConfig[category.type] || {};
            return (
              <button
                key={category.type}
                ref={el => categoryButtonsRef.current[index] = el}
                onClick={() => setActiveCategory(category.type)}
                className={`group px-6 py-3 rounded-xl transition-all duration-300 flex items-center border ${
                  activeCategory === category.type
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-105`
                    : `bg-white text-gray-700 ${config.buttonColor} border-gray-200 hover:shadow-md`
                }`}
              >
                <span className="text-xl mr-3">{config.icon}</span>
                <span className="font-medium">{config.title || category.title || category.type}</span>
                <span className={`ml-3 text-sm px-2 py-1 rounded-full ${
                  activeCategory === category.type 
                    ? 'bg-white/20' 
                    : 'bg-gray-100'
                }`}>
                  {category.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {categories.map((category) => {
          const config = categoryConfig[category.type] || {};
          
          return (
            <div
              key={category.type}
              className={`transition-all duration-500 ${
                activeCategory === category.type ? 'opacity-100 block' : 'opacity-0 hidden'
              }`}
            >
              {category.items.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl">🏛️</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {translations.comingSoon || 'Coming Soon'}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {translations.curatingExperiences?.replace('{category}', category.title || config.title || category.type) || 
                     `We're curating the best ${category.title || config.title || category.type} experiences for you.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {category.items.map((item, itemIndex) => {
                    const isFavorite = favorites.has(item.id);
                    
                    return (
                      <div
                        key={item.id}
                        className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border ${
                          config.borderColor
                        }`}
                      >
                        <div className="relative h-64 overflow-hidden">
                          {item.images && item.images.length > 0 ? (
                            <>
                              <Image
                                src={item.images[0].url}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                              
                              <button
                                onClick={() => toggleFavorite(item.id)}
                                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-colors duration-300"
                                aria-label={translations.favorite || 'Favorite'}
                              >
                                {isFavorite ? (
                                  <FaHeart className="text-red-500 text-lg" />
                                ) : (
                                  <FaRegHeart className="text-gray-600 text-lg" />
                                )}
                              </button>
                              
                              <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                                  <span className="mr-2">{config.icon}</span>
                                  <span className="font-medium">{config.title || category.title || category.type}</span>
                                </span>
                              </div>
                              
                              {category.type === 'hotels' && item.rating && (
                                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1.5 rounded-full flex items-center">
                                  {renderStars(item.rating)}
                                  <span className="ml-2 font-bold">{item.rating}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className={`w-full h-full ${config.gradient} flex items-center justify-center`}>
                              <span className="text-6xl opacity-50">{config.icon}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                              {item.title}
                            </h3>

                          </div>

                          <p className="text-gray-600 mb-6 line-clamp-2">
                            {truncateText(item.description, 80)}
                          </p>

                          {/* Price Display for Hotels */}
                          {category.type === 'hotels' && item.priceStartsFrom && (
                            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center text-sm text-gray-600 mb-1">
                                    <FaDollarSign className="mr-1" />
                                    {translations.priceStartsFrom || 'Price starts from'}
                                  </div>
                                  <div className="text-2xl font-bold text-gray-900">
                                    ${item.priceStartsFrom}
                                    <span className="text-lg font-normal text-gray-600 ml-1">
                                      {translations.perNight || '/night'}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-green-600 font-medium">
                                    {translations.bestPrice || 'Best Price'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {translations.includesTaxes || 'Includes taxes & fees'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mb-6">
                            {category.type === 'hotels' && item.amenities && item.amenities.slice(0, 3).map((amenity, index) => (
                              <span key={index} className="inline-flex items-center text-sm text-gray-500 mr-3 mb-2">
                                <span className="mr-1.5">
                                  {amenityIcons[amenity] || <FaBed className="text-gray-400" />}
                                </span>
                                {amenity}
                              </span>
                            ))}
                          </div>

                          <div className="flex justify-center items-center pt-4 border-t border-gray-100">
                            <Link
                              href={`/discover/${category.type}/${item.id}?slug=${item.slug}`}
                              className="group/btn w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                            >
                              <span className="font-medium">{translations.explore || 'Explore'}</span>
                              <FaArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {category.items.length > 0 && (
                <div className="text-center mt-16">
                  <Link
                    href={`/discover/${category.type}`}
                    className="inline-flex items-center px-8 py-4 bg-white text-gray-800 rounded-xl border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 hover:shadow-lg font-medium"
                  >
                    {translations.viewAll || 'View All'} {category.title || config.title || category.type}
                    <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, #00000008 1px, transparent 1px),
            linear-gradient(to bottom, #00000008 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </section>
  );
};

export default GetToKnowRussia;