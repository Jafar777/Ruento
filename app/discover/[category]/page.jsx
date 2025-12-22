'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaMapMarkerAlt,
  FaStar,
  FaArrowLeft,
  FaSearch,
  FaChevronRight
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const CategoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { translations } = useLanguage();

  const categoryConfig = {
    restaurants: {
      title: translations.premiumRestaurants || 'Premium Restaurants',
      description: translations.restaurantDescription || 'Discover exceptional dining experiences across Russia',
      icon: '🍽️',
      color: 'from-red-500 to-orange-500'
    },
    hotels: {
      title: translations.luxuryHotels || 'Luxury Hotels',
      description: translations.hotelDescription || 'Experience world-class hospitality and accommodations',
      icon: '🏨',
      color: 'from-indigo-500 to-purple-500'
    },
    museums: {
      title: translations.culturalMuseums || 'Cultural Museums',
      description: translations.museumDescription || 'Explore Russia\'s rich history and artistic heritage',
      icon: '🏛️',
      color: 'from-amber-500 to-yellow-500'
    },
    touristAttractions: {
      title: translations.touristAttractions || 'Tourist Attractions',
      description: 'Explore famous landmarks and attractions across Russia',
      icon: '🏛️',
      color: 'from-blue-500 to-cyan-500'
    },
    events: {
      title: translations.events || 'Events',
      description: 'Discover cultural events and festivals in Russia',
      icon: '🎪',
      color: 'from-purple-500 to-pink-500'
    },
    shopping: {
      title: translations.shopping || 'Shopping',
      description: 'Find the best shopping destinations in Russia',
      icon: '🛍️',
      color: 'from-emerald-500 to-green-500'
    },
    naturalPlaces: {
      title: translations.naturalPlaces || 'Natural Places',
      description: 'Explore Russia\'s breathtaking natural landscapes',
      icon: '🏞️',
      color: 'from-green-500 to-emerald-500'
    }
  };

  const config = categoryConfig[params.category] || {
    title: translations.discoverExperiences || 'Discover',
    description: translations.explorePremium || 'Explore premium experiences',
    icon: '🏛️',
    color: 'from-blue-500 to-purple-500'
  };

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const response = await fetch(`/api/get-to-know-russia?category=${params.category}`);
        const data = await response.json();
        setItems(data.items || []);
      } catch (error) {
        console.error('Error fetching category items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [params.category]);

  const filteredItems = items.filter(item => 
    search === '' || 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg">
            {translations.loadingExperiences?.replace('{category}', config.title) || `Loading ${config.title}...`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className={`bg-gradient-to-r ${config.color} text-white py-20`}>
        <div className="container mx-auto px-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            {translations.backToDiscover || 'Back to Discover'}
          </button>
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6">
              <span className="mr-2 text-xl">{config.icon}</span>
              <span className="font-medium">{config.title}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {config.title}
            </h1>
            
            <p className="text-xl text-white/90 mb-8">
              {config.description}
            </p>
            
            <div className="flex items-center">
              <div className="relative flex-1 max-w-xl">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={translations.searchPlaceholder?.replace('{category}', config.title.toLowerCase()) || `Search ${config.title.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {translations.results?.replace('{count}', filteredItems.length.toString())
                                      .replace('{results}', filteredItems.length === 1 ? 
                                        translations.result || 'Result' : 
                                        translations.resultsPlural || 'Results') || 
                 `${filteredItems.length} ${filteredItems.length === 1 ? 'Result' : 'Results'}`}
              </h2>
              <p className="text-gray-600">
                {translations.premiumExperiences || 'Premium experiences curated for you'}
              </p>
            </div>
          </div>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <FaSearch className="text-gray-400" size={48} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              {translations.noResultsFound || 'No Results Found'}
            </h3>
            <p className="text-gray-600 mb-8">
              {translations.adjustFilters || 'Try adjusting your filters or search terms'}
            </p>
            <button
              onClick={() => setSearch('')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              {translations.clearSearch || 'Clear Search'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <Link
                key={item.id || index}
                href={`/discover/${params.category}/${item.id}?slug=${item.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="relative h-48 overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0].url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-4xl opacity-50">{config.icon}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      {item.rating && (
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="font-semibold text-gray-900">{item.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description?.substring(0, 100)}...
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="mr-1.5" />
                        <span className="truncate max-w-[120px]">
                          {item.address || translations.multipleLocations || 'Multiple Locations'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-blue-600 font-medium">
                        <span>{translations.explore || 'Explore'}</span>
                        <FaChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;