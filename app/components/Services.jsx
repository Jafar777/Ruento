// app/components/Services.jsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services = ({ id }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const { translations } = useLanguage();

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const servicesRef = useRef([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        console.log('Fetched services:', data); // Debug log
        setServices(data || []);
        
        // Initialize image indexes
        const indexes = {};
        data.forEach(service => {
          const serviceId = service._id || service.type || Math.random().toString();
          indexes[serviceId] = 0;
        });
        setCurrentImageIndex(indexes);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (services.length === 0) return;

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

      servicesRef.current.forEach((serviceRef, index) => {
        if (!serviceRef) return;
        
        gsap.fromTo(serviceRef,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: serviceRef,
              start: 'top 85%',
              toggleActions: 'play none none none',
              markers: false,
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  const nextImage = (serviceId) => {
    const service = services.find(s => (s._id || s.type || '') === serviceId);
    if (!service || !service.images || service.images.length <= 1) return;
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] + 1) % service.images.length
    }));
  };

  const prevImage = (serviceId) => {
    const service = services.find(s => (s._id || s.type || '') === serviceId);
    if (!service || !service.images || service.images.length <= 1) return;
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] - 1 + service.images.length) % service.images.length
    }));
  };

  // Safe image URL check
  const getSafeImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    return url;
  };

  // Get service ID for keys and state management
  const getServiceId = (service) => {
    return service._id || service.type || `service-${Math.random()}`;
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

  return (
    <section id={id} ref={sectionRef} className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {translations.ourServices || 'Our Services'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {translations.servicesDescription || 'Discover our comprehensive travel services designed to make your Russian adventure unforgettable'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const serviceId = getServiceId(service);
            const currentIndex = currentImageIndex[serviceId] || 0;
            const safeImages = (service.images || []).filter(img => getSafeImageUrl(img));
            
            return (
              <div 
                key={serviceId} 
                ref={el => servicesRef.current[index] = el}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">{service.icon || '📋'}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {service.title || 'Service Title'}
                  </h3>
                </div>

                {safeImages.length > 0 && (
                  <div className="mb-6 rounded-xl overflow-hidden relative">
                    {/* Use regular img tag instead of Next.js Image to avoid optimization issues */}
                    <img
                      src={getSafeImageUrl(safeImages[currentIndex])}
                      alt={service.title || 'Service Image'}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                      }}
                    />
                    
                    {/* Image Navigation */}
                    {safeImages.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(serviceId)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => nextImage(serviceId)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                        >
                          ›
                        </button>
                        
                        {/* Dots Indicator */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {safeImages.map((_, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={() => setCurrentImageIndex(prev => ({
                                ...prev,
                                [serviceId]: imgIndex
                              }))}
                              className={`w-2 h-2 rounded-full ${
                                currentIndex === imgIndex 
                                  ? 'bg-white' 
                                  : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    {service.title || 'Service Title'}
                  </h4>
                  <p className="text-gray-600 leading-relaxed min-h-[80px]">
                    {service.description || 'Service description will appear here.'}
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                    {translations.learnMore || 'Learn More'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {translations.noServices || 'No services available at the moment. Please check back later.'}
            </p>
          </div>
        )}
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

export default Services;