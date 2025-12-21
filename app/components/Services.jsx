// app/components/Services.jsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Sparkles } from 'lucide-react';
import { FaArrowRight } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const Services = ({ id }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const { translations, currentLanguage } = useLanguage(); // Fixed: Added currentLanguage
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
          // REMOVED: setFilteredServices(data); - This line was causing the error
        } else {
          // If API fails, use minimal fallback
          const fallbackServices = [
            {
              id: 1,
              type: 'plans',
              title: 'جولة روسيا الشاملة',
              description: 'جولة شاملة لاستكشاف أفضل ما في روسيا',
              icon: '📋',
              price: 1999,
              priceUnit: 'للشخص',
              rating: 4.8
            }
          ];
          setServices(fallbackServices);
          // REMOVED: setFilteredServices(fallbackServices); - This line was causing the error
        }
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
      gsap.fromTo(titleRef.current.querySelectorAll('.char'),
        { opacity: 0, y: 30, rotateX: 90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );

      cardsRef.current.forEach((cardRef, index) => {
        if (!cardRef) return;

        gsap.fromTo(cardRef,
          { opacity: 0, y: 80, scale: 0.8, rotationY: 15 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 1,
            delay: index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardRef,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  const nextImage = (serviceId, e) => {
    e.stopPropagation();
    const service = services.find(s => (s._id || s.type || '') === serviceId);
    if (!service || !service.images || service.images.length <= 1) return;

    setCurrentImageIndex(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] + 1) % service.images.length
    }));
  };

  const prevImage = (serviceId, e) => {
    e.stopPropagation();
    const service = services.find(s => (s._id || s.type || '') === serviceId);
    if (!service || !service.images || service.images.length <= 1) return;

    setCurrentImageIndex(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] - 1 + service.images.length) % service.images.length
    }));
  };

const getSafeImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return url;
};

  const getServiceId = (service) => {
    return service._id || service.type || `service-${Math.random()}`;
  };

  const splitText = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char inline-block" style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  if (loading) {
    return (
      <section className="py-32 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-black relative overflow-hidden">
        <div className="container mx-auto flex justify-center items-center min-h-[60vh]">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-16 h-16 border-4 border-transparent border-t-blue-400 border-r-purple-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} ref={sectionRef} className="py-32 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 20}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>

      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto relative z-10">
        <div ref={titleRef} className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {translations.ourServices || 'Our Services'}
          </h2>

          <div className="relative inline-block">
            <div className="w-48 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full"></div>
            <div className="absolute inset-0 w-48 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 rounded-full blur-sm"></div>
          </div>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {translations.servicesDescription || 'Discover our comprehensive travel services designed to make your Russian adventure unforgettable'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const serviceId = getServiceId(service);
            const currentIndex = currentImageIndex[serviceId] || 0;
            const safeImages = (service.images || []).filter(img => getSafeImageUrl(img));

            return (
              <div
                key={serviceId}
                ref={el => cardsRef.current[index] = el}
                className="group relative"
                onMouseEnter={() => setHoveredCard(serviceId)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 rounded-3xl blur-xl transition-opacity duration-500 ${hoveredCard === serviceId ? 'opacity-100' : 'opacity-0'
                  }`}></div>

                <div className="relative bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:border-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-500/30 rounded-tl-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-purple-500/30 rounded-br-3xl"></div>

                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                      <div className="text-3xl">{service.icon || '✨'}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {safeImages.length > 0 && (
                    <div className="relative mb-8 rounded-2xl overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={getSafeImageUrl(safeImages[currentIndex])}
                          alt={service.title || 'Service Image'}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>

                        {safeImages.length > 1 && (
                          <>
                            <button
                              onClick={(e) => prevImage(serviceId, e)}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-white hover:bg-gray-800 transition-all hover:scale-110 hover:border-blue-500 group/nav"
                            >
                              <ChevronLeft className="w-5 h-5 group-hover/nav:-translate-x-0.5 transition-transform" />
                            </button>
                            <button
                              onClick={(e) => nextImage(serviceId, e)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-white hover:bg-gray-800 transition-all hover:scale-110 hover:border-purple-500 group/nav"
                            >
                              <ChevronRight className="w-5 h-5 group-hover/nav:translate-x-0.5 transition-transform" />
                            </button>
                          </>
                        )}

                        {safeImages.length > 1 && (
                          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-sm text-white">
                            {currentIndex + 1} / {safeImages.length}
                          </div>
                        )}
                      </div>

                      {safeImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {safeImages.map((_, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={() => setCurrentImageIndex(prev => ({
                                ...prev,
                                [serviceId]: imgIndex
                              }))}
                              className={`w-2 h-2 rounded-full transition-all ${currentIndex === imgIndex
                                  ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                                  : 'bg-gray-600 hover:bg-gray-400'
                                }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                      {service.title || translations.serviceTitle || 'Service Title'}
                    </h3>

                    <p className="text-gray-300 mb-8 leading-relaxed line-clamp-3">
                      {service.description || translations.serviceDescriptionDefault || 'Service description will appear here.'}
                    </p>

                    <Link
                      href={`/services/${service.type}`}
                      className="group/btn w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white font-semibold flex items-center justify-center gap-2 hover:from-blue-600/30 hover:to-purple-600/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <span>{translations.learnMore || 'Learn More'}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-500 ${hoveredCard === serviceId ? 'scale-100' : 'scale-0'
                    }`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {services.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-8 rounded-3xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50">
              <div className="text-6xl mb-4">🌌</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {translations.comingSoon || 'Coming Soon'}
              </h3>
              <p className="text-gray-400 max-w-md">
                {translations.noServices || 'No services available at the moment. Please check back later.'}
              </p>
            </div>
          </div>
        )}

        {/* "All Services" Button - Fixed with currentLanguage */}
        <div className="text-center mt-20">
          <Link 
            href="/services"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>{translations.viewAllServices || 'عرض جميع الخدمات'}</span>
            <FaArrowRight className={`ml-3 ${currentLanguage === 'ar' ? 'rotate-180 mr-3' : ''}`} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -20px) rotate(5deg); }
          50% { transform: translate(-15px, 15px) rotate(-5deg); }
          75% { transform: translate(10px, -10px) rotate(3deg); }
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .char {
          transform-style: preserve-3d;
          backfaceVisibility: hidden;
        }
      `}</style>
    </section>
  );
};

export default Services;