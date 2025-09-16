// app/components/Services.jsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useLanguage();

  // Create refs for elements to animate
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const servicesRef = useRef([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Set up animations after data is loaded and component is mounted
  useEffect(() => {
    if (services.length === 0) return; // Wait until data is available

    const ctx = gsap.context(() => {
      // Animation for the main title
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

      // Animation for each service card
      servicesRef.current.forEach((serviceRef, index) => {
        if (!serviceRef) return;
        
        gsap.fromTo(serviceRef,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1, // Stagger the animations
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

    // Clean up function
    return () => ctx.revert();
  }, [services]);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </section>
    );
  }

  const serviceIcons = {
    plans: '📋',
    transportation: '🚗',
    hotels: '🏨',
    residence: '🏠'
  };

  const serviceTitles = {
    plans: translations.plans || 'Travel Plans',
    transportation: translations.transportation || 'Transportation',
    hotels: translations.hotels || 'Hotels',
    residence: translations.residence || 'Residence'
  };

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Decorative elements */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.type} 
              ref={el => servicesRef.current[index] = el}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{serviceIcons[service.type]}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {serviceTitles[service.type]}
                </h3>
              </div>

              {service.image && (
                <div className="mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 text-center">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  {translations.learnMore || 'Learn More'}
                </button>
              </div>
            </div>
          ))}
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