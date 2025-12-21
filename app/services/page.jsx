// app/services/page.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { 
  FaSearch, FaFilter, FaSort, FaStar, 
  FaClock, FaUsers, FaMapMarkerAlt, FaCalendar,
  FaChevronDown, FaChevronUp, FaCheck, FaTimes,
  FaPhone, FaEnvelope, FaWhatsapp, FaInstagram,
  FaFacebook, FaTwitter, FaYoutube, FaTiktok
} from 'react-icons/fa';
import Link from 'next/link';

const ServicesPage = () => {
  const { translations, currentLanguage } = useLanguage();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    search: false,
    category: false,
    price: false,
    sort: false
  });
  const [categories, setCategories] = useState([]); // Changed to state

  // Initialize categories with translations
  useEffect(() => {
    const initialCategories = [
      { 
        id: 'all', 
        name: translations.allServices || 'جميع الخدمات', 
        icon: '🌟',
        color: 'from-purple-500 to-pink-500',
        count: 0
      },
      { 
        id: 'plans', 
        name: translations.plans || 'الخطط السياحية', 
        icon: '📋',
        color: 'from-blue-500 to-cyan-500',
        count: 0
      },
      { 
        id: 'transportation', 
        name: translations.transportation || 'خدمات النقل', 
        icon: '🚗',
        color: 'from-green-500 to-emerald-500',
        count: 0
      },
      { 
        id: 'hotels', 
        name: translations.hotels || 'الفنادق والإقامة', 
        icon: '🏨',
        color: 'from-orange-500 to-red-500',
        count: 0
      },
      { 
        id: 'residence', 
        name: translations.residence || 'شقق الإقامة', 
        icon: '🏠',
        color: 'from-yellow-500 to-amber-500',
        count: 0
      },
      { 
        id: 'restaurants', 
        name: translations.restaurants || 'المطاعم', 
        icon: '🍽️',
        color: 'from-pink-500 to-rose-500',
        count: 0
      },
      { 
        id: 'tourist-attractions', 
        name: translations.touristAttractions || 'المعالم السياحية', 
        icon: '🏰',
        color: 'from-indigo-500 to-blue-500',
        count: 0
      },
      { 
        id: 'events', 
        name: translations.events || 'الفعاليات', 
        icon: '🎪',
        color: 'from-teal-500 to-green-500',
        count: 0
      },
      { 
        id: 'shopping', 
        name: translations.shopping || 'التسوق', 
        icon: '🛍️',
        color: 'from-purple-500 to-pink-500',
        count: 0
      },
      { 
        id: 'museums', 
        name: translations.museums || 'المتاحف', 
        icon: '🏛️',
        color: 'from-gray-600 to-gray-800',
        count: 0
      },
      { 
        id: 'natural-places', 
        name: translations.naturalPlaces || 'الأماكن الطبيعية', 
        icon: '🏞️',
        color: 'from-lime-500 to-green-500',
        count: 0
      }
    ];
    setCategories(initialCategories);
  }, [translations]); // Re-run when translations change

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/services');
        
        if (response.ok) {
          const data = await response.json();
          setServices(data);
          setFilteredServices(data);
          
          // Calculate category counts
          const categoryCounts = {};
          data.forEach(service => {
            if (service.type) {
              categoryCounts[service.type] = (categoryCounts[service.type] || 0) + 1;
            }
          });
          
          // Update categories with counts
          setCategories(prev => prev.map(cat => ({
            ...cat,
            count: cat.id === 'all' ? data.length : (categoryCounts[cat.id] || 0)
          })));
        } else {
          // Fallback to mock data if API fails
          console.log('API failed, using mock data');
          const mockServices = [
            {
              id: 1,
              type: 'plans',
              title: 'جولة موسكو الفاخرة',
              description: 'جولة شاملة لمدة 5 أيام في العاصمة الروسية',
              icon: '📋',
              duration: '5 أيام',
              groupSize: '2-10 أشخاص',
              price: 2499,
              priceUnit: 'للشخص',
              rating: 4.9,
              images: ['/images/moscow1.jpg'],
              features: ['مرشدين محليين خبراء', 'إقامة في فنادق 5 نجوم'],
              benefits: ['ضمان أفضل سعر', 'إلغاء مرن']
            },
            {
              id: 2,
              type: 'transportation',
              title: 'خدمة نقل فاخرة',
              description: 'خدمة نقل خاصة بسيارات فاخرة مع سائقين محترفين',
              icon: '🚗',
              duration: 'مرنة',
              groupSize: '1-8 أشخاص',
              price: 299,
              priceUnit: 'لليوم',
              rating: 4.8,
              images: ['/images/car1.jpg'],
              features: ['سائقون يتحدثون العربية', 'سيارات فاخرة حديثة'],
              benefits: ['حجز فوري', 'تأمين كامل']
            },
            {
              id: 3,
              type: 'hotels',
              title: 'فندق فور سيزونز موسكو',
              description: 'فندق 5 نجوم في قلب موسكو مع إطلالة على الكرملين',
              icon: '🏨',
              duration: 'مرنة',
              groupSize: '1-4 أشخاص',
              price: 599,
              priceUnit: 'لليلة',
              rating: 4.9,
              images: ['/images/hotel1.jpg'],
              amenities: ['واي فاي مجاني', 'سبا ومركز لياقة'],
              benefits: ['خدمة الكونسيرج 24/7', 'مطاعم فاخرة']
            }
          ];
          setServices(mockServices);
          setFilteredServices(mockServices);
          
          // Update counts for mock data
          const mockCounts = {
            'plans': 1,
            'transportation': 1,
            'hotels': 1,
            'all': 3
          };
          setCategories(prev => prev.map(cat => ({
            ...cat,
            count: mockCounts[cat.id] || 0
          })));
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Even if API fails completely, set loading to false
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter and sort services
  useEffect(() => {
    let filtered = [...services];
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.features?.some(feature => feature?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setActiveFilters(prev => ({ ...prev, search: true }));
    } else {
      setActiveFilters(prev => ({ ...prev, search: false }));
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.type === selectedCategory);
      setActiveFilters(prev => ({ ...prev, category: true }));
    } else {
      setActiveFilters(prev => ({ ...prev, category: false }));
    }
    
    // Apply price range filter
    filtered = filtered.filter(service => 
      (service.price || 0) >= priceRange[0] && (service.price || 0) <= priceRange[1]
    );
    setActiveFilters(prev => ({ ...prev, price: priceRange[0] > 0 || priceRange[1] < 5000 }));
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
        break;
    }
    
    setFilteredServices(filtered);
  }, [services, searchQuery, selectedCategory, sortBy, priceRange]);

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    const numValue = parseInt(value) || 0;
    // Ensure min doesn't exceed max and vice versa
    if (index === 0) {
      newRange[0] = Math.min(numValue, priceRange[1]);
    } else {
      newRange[1] = Math.max(numValue, priceRange[0]);
    }
    setPriceRange(newRange);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
    setPriceRange([0, 5000]);
    setActiveFilters({
      search: false,
      category: false,
      price: false,
      sort: false
    });
  };

  const activeFiltersCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              {translations.premiumServices || 'خدماتنا المميزة'}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-blue-100 leading-relaxed">
              {translations.servicesDescription || 'اكتشف خدمات السفر الشاملة المصممة لجعل مغامرتك الروسية لا تنسى'}
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
                <div className="text-3xl font-bold text-yellow-400 mb-2">4.8+</div>
                <div className="text-blue-200 font-medium">تقييم العملاء</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
                <div className="text-3xl font-bold text-green-400 mb-2">5K+</div>
                <div className="text-blue-200 font-medium">مسافر سعيد</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
                <div className="text-3xl font-bold text-red-400 mb-2">50+</div>
                <div className="text-blue-200 font-medium">وجهة مميزة</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-blue-200 font-medium">دعم متواصل</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="sticky top-20 z-40 py-4 px-4 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <FaSearch className={`absolute top-1/2 transform -translate-y-1/2 ${
                currentLanguage === 'ar' ? 'right-4' : 'left-4'
              } text-gray-400`} />
              <input
                type="text"
                placeholder={translations.searchPlaceholder?.replace('{category}', 'الخدمات') || 'ابحث في الخدمات...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full p-3 ${
                  currentLanguage === 'ar' ? 'pr-12' : 'pl-12'
                } bg-gray-100 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 transform -translate-y-1/2 ${
                    currentLanguage === 'ar' ? 'left-4' : 'right-4'
                  } text-gray-500 hover:text-gray-700`}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filter Toggle and Active Filters */}
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <span>{activeFiltersCount}</span>
                  <span>{translations.activeFilters || 'فلتر نشط'}</span>
                </div>
              )}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <FaFilter />
                {translations.filters || 'الفلاتر'}
                {showFilters ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
              </button>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                >
                  {translations.clearAllFilters || 'مسح الكل'}
                </button>
              )}
            </div>
          </div>

          {/* Expanded Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-lg animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {translations.category || 'الفئة'}
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          selectedCategory === category.id
                            ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedCategory === category.id
                            ? 'bg-white/30'
                            : 'bg-gray-200'
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {translations.priceRange || 'نطاق السعر'}
                  </label>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <div className="relative pt-2">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="absolute h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{
                            left: `${(priceRange[0] / 5000) * 100}%`,
                            right: `${100 - (priceRange[1] / 5000) * 100}%`
                          }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(0, e.target.value)}
                        className="absolute top-0 w-full h-2 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(1, e.target.value)}
                        className="absolute top-0 w-full h-2 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">الحد الأدنى</label>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(0, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg text-center"
                          min="0"
                          max="5000"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">الحد الأقصى</label>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(1, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg text-center"
                          min="0"
                          max="5000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {translations.sortBy || 'ترتيب حسب'}
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'featured', label: translations.featured || 'مميز' },
                      { id: 'rating', label: translations.rating || 'الأعلى تقييماً' },
                      { id: 'price-low', label: translations.priceLowToHigh || 'السعر: من الأقل' },
                      { id: 'price-high', label: translations.priceHighToLow || 'السعر: من الأعلى' },
                      { id: 'newest', label: translations.newest || 'الأحدث' }
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          sortBy === option.id
                            ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 text-blue-700'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="font-medium">{option.label}</span>
                        {sortBy === option.id && (
                          <FaCheck className="text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                >
                  {translations.clearAllFilters || 'مسح الكل'}
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  {translations.applyFilters || 'تطبيق الفلاتر'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Quick Navigation */}
      <section className="py-8 px-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {translations.exploreCategories || 'استكشف الفئات'}
          </h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3 min-w-max px-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex flex-col items-center p-4 rounded-2xl min-w-[120px] transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                      : 'bg-white hover:bg-white text-gray-700 hover:text-blue-600 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <span className="text-sm font-medium text-center mb-1">{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-white/30'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {translations.premiumExperiences || 'تجارب مميزة مختارة لك'}
              </h2>
              <div className="flex items-center gap-3">
                <p className="text-gray-600">
                  {translations.results?.replace('{count}', filteredServices.length).replace('{results}', 
                    filteredServices.length === 1 ? translations.result : translations.resultsPlural) || 
                    `${filteredServices.length} ${filteredServices.length === 1 ? 'نتيجة' : 'نتائج'}`
                  }
                </p>
                {sortBy !== 'featured' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {translations.sortedBy?.replace('{sort}', 
                      sortBy === 'rating' ? 'التقييم' :
                      sortBy === 'price-low' ? 'السعر: من الأقل' :
                      sortBy === 'price-high' ? 'السعر: من الأعلى' :
                      'الأحدث'
                    ) || 'مرتب حسب'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="text-sm text-gray-500 hidden md:block">
                {translations.showing || 'عرض'} <span className="font-semibold text-gray-700">{filteredServices.length}</span> {translations.of || 'من'} <span className="font-semibold text-gray-700">{services.length}</span>
              </div>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-blue-600 hover:text-blue-800 transition flex items-center gap-2 px-4 py-2 hover:bg-blue-50 rounded-xl"
                >
                  <span>{translations.viewAll || 'عرض الكل'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin animation-delay-500"></div>
              </div>
              <p className="mt-6 text-gray-600 text-lg">
                {translations.loadingServices || 'جاري تحميل الخدمات المميزة...'}
              </p>
            </div>
          ) : filteredServices.length === 0 ? (
            /* No Results State */
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-lg">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  {translations.noResultsFound || 'لم يتم العثور على نتائج'}
                </h3>
                <p className="text-gray-600 max-w-md mb-6">
                  {translations.adjustFilters || 'حاول تعديل الفلاتر أو مصطلحات البحث'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition"
                  >
                    {translations.clearSearch || 'مسح البحث'}
                  </button>
                  <Link
                    href="/contact"
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition"
                  >
                    {translations.contactUs || 'اتصل بنا'}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Services Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map(service => (
                <ServiceCard key={service._id || service.id} service={service} />
              ))}
            </div>
          )}

          {/* Premium Banner */}
          {!loading && filteredServices.length > 0 && (
            <div className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-30"></div>
              
              <div className="relative p-8 md:p-12">
                <div className="max-w-4xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-1 bg-yellow-500 text-yellow-900 rounded-full text-sm font-bold">
                      {translations.premiumService || 'خدمة مميزة'}
                    </span>
                    <span className="px-4 py-1 bg-white/20 text-white rounded-full text-sm">
                      {translations.VIPExperience || 'تجربة VIP'}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    {translations.exclusiveOffer || 'عرض حصري للعملاء المميزين'}
                  </h3>
                  
                  <p className="text-xl text-blue-100 mb-8 max-w-3xl leading-relaxed">
                    {translations.serviceDescriptionDefault || 'جرب خدمة عالمية المستوى مع عروضنا المميزة، المصممة لأكثر العملاء تميزاً.'}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[
                      translations.personalizedConcierge || 'خدمة كونسيرج شخصية متاحة 24/7',
                      translations.VIPSecurity || 'أمن خاص وحماية',
                      translations.DedicatedSupport || 'دعم مخصص على مدار الساعة',
                      translations.flexibleBooking || 'حجز مرن وإلغاء مجاني'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-white">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/contact"
                      className="px-8 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2"
                    >
                      <FaPhone />
                      {translations.enquireNow || 'استفسر الآن'}
                    </Link>
                    <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition">
                      {translations.viewAllServices || 'عرض جميع الخدمات'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {translations.needHelp || 'تحتاج مساعدة؟'}
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {translations.contactDescription || 'تواصل معنا لأي أسئلة حول خدماتنا أو التخطيط لرحلتك القادمة إلى روسيا'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
              <div className="inline-flex p-3 bg-blue-500/20 rounded-xl mb-4">
                <FaPhone className="text-3xl text-blue-400" />
              </div>
              <div className="text-xl font-bold text-white mb-2">{translations.callUs || 'اتصل بنا'}</div>
              <div className="text-gray-300">+7 (999) 999-9999</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
              <div className="inline-flex p-3 bg-green-500/20 rounded-xl mb-4">
                <FaWhatsapp className="text-3xl text-green-400" />
              </div>
              <div className="text-xl font-bold text-white mb-2">WhatsApp</div>
              <div className="text-gray-300">{translations.available24_7 || 'متاح 24/7'}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
              <div className="inline-flex p-3 bg-red-500/20 rounded-xl mb-4">
                <FaEnvelope className="text-3xl text-red-400" />
              </div>
              <div className="text-xl font-bold text-white mb-2">{translations.emailUs || 'راسلنا'}</div>
              <div className="text-gray-300">info@ruento.com</div>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="flex justify-center gap-4 mb-8">
            {[
              { icon: FaInstagram, color: 'text-pink-500 hover:text-pink-400', label: 'Instagram' },
              { icon: FaFacebook, color: 'text-blue-600 hover:text-blue-500', label: 'Facebook' },
              { icon: FaTwitter, color: 'text-blue-400 hover:text-blue-300', label: 'Twitter' },
              { icon: FaYoutube, color: 'text-red-600 hover:text-red-500', label: 'YouTube' },
              { icon: FaTiktok, color: 'text-black hover:text-gray-800', label: 'TikTok' }
            ].map((social, index) => (
              <a
                key={index}
                href="#"
                className={`w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 ${social.color}`}
                aria-label={social.label}
              >
                <social.icon className="text-xl" />
              </a>
            ))}
          </div>
          
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {translations.contactUs || 'اتصل بنا الآن'}
          </Link>
        </div>
      </section>

      <Footer />
      
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/79999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="تواصل معنا على واتساب"
      >
        <FaWhatsapp className="text-2xl" />
        <span className="absolute -top-1 -right-1 flex h-6 w-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500 items-center justify-center text-xs">
            <FaWhatsapp className="text-white" />
          </span>
        </span>
      </a>
    </div>
  );
};

export default ServicesPage;