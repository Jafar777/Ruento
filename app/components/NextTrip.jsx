// app/components/NextTrip.jsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NextTrip = () => {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { translations } = useLanguage();
  const [contacts, setContacts] = useState(null);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const carouselRef = useRef(null);
  const countdownRef = useRef(null);
  const destinationsRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);

  // Fetch contacts on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  const getWhatsAppLink = (customMessage = '') => {
    if (!contacts?.whatsapp) return '#';
    
    let phoneNumber = contacts.whatsapp;
    if (phoneNumber.includes('wa.me/') || phoneNumber.includes('whatsapp.com/')) {
      const match = phoneNumber.match(/\/?\+?(\d+)/);
      if (match) phoneNumber = match[1];
    }
    
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    const message = customMessage || contacts.whatsappMessage || 'Hello! I am interested in your services.';
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch('/api/trip-date');
        const data = await response.json();
        setTripData(data);
      } catch (error) {
        console.error('Error fetching trip data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, []);

  // Set up animations after data is loaded and component is mounted
  useEffect(() => {
    if (!tripData) return; // Wait until data is available

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
            toggleActions: 'play none none none', // Only play on enter
            markers: false,
          }
        }
      );

      // Animation for the image carousel
      gsap.fromTo(carouselRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            markers: false,
          }
        }
      );

      // Animation for countdown section
      gsap.fromTo(countdownRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: countdownRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            markers: false,
          }
        }
      );

      // Animation for destinations section
      gsap.fromTo(destinationsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: destinationsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            markers: false,
          }
        }
      );

      // Animation for description section
      gsap.fromTo(descriptionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            markers: false,
          }
        }
      );

      // Animation for CTA button
      gsap.fromTo(ctaRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            markers: false,
          }
        }
      );
    }, sectionRef);

    // Clean up function
    return () => ctx.revert();
  }, [tripData]);

  const nextImage = () => {
    if (!tripData?.images?.length) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === tripData.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!tripData?.images?.length) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? tripData.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!tripData || !tripData.date) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{translations.nextTrip}</h2>
          <p className="text-xl">{translations.noTripPlanned}</p>
        </div>
      </section>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days until trip
  const calculateDaysUntilTrip = () => {
    const today = new Date();
    const tripDate = new Date(tripData.date);
    const difference = tripDate.getTime() - today.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  };

  const daysUntilTrip = calculateDaysUntilTrip();

  return (
    <section ref={sectionRef} className="relative py-16 px-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-soft-light filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-soft-light filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Big "Our Next Trip" Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            {translations.ournexttrip || 'Our Next Trip'}
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6"></div>
          <p className="text-2xl text-blue-100 max-w-3xl mx-auto">
            {translations.experienceRussia || "Experience the majesty of Russia's diverse landscapes and rich culture"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Carousel */}
          <div ref={carouselRef} className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            {tripData.images && tripData.images.length > 0 ? (
              <>
                <img 
                  src={tripData.images[currentImageIndex]} 
                  alt="Trip destination"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                
                {/* Navigation arrows */}
                {tripData.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition"
                    >
                      <FaChevronLeft className="text-white" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-70 transition"
                    >
                      <FaChevronRight className="text-white" />
                    </button>
                  </>
                )}
                
                {/* Image indicators */}
                {tripData.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {tripData.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-700 to-purple-700 flex items-center justify-center">
                <p className="text-xl">{translations.noImagesAvailable}</p>
              </div>
            )}
          </div>

          {/* Trip Information */}
          <div className="space-y-8">
            {/* Countdown */}
            <div ref={countdownRef} className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-2xl font-semibold text-purple-600 mb-4 flex items-center">
                <FaCalendarAlt className="mr-3 ml-3 text-blue-600" />
                {translations.countdown || "Countdown to Adventure"}
              </h3>
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    {daysUntilTrip}
                  </div>
                  <div className="text-sm text-blue-500">{translations.days || "Days Until Departure"}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    {formatDate(tripData.date)}
                  </div>
                  <div className="text-sm text-blue-500">{translations.departureDate || "Departure Date"}</div>
                </div>
              </div>
            </div>

            {/* Destinations */}
            {tripData.places && tripData.places.length > 0 && (
              <div ref={destinationsRef} className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                <h3 className="text-2xl text-purple-600 font-semibold mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-3 ml-3 text-red-600" />
                  {translations.destinations || "Destinations"}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {tripData.places.map((place, index) => (
                    <div 
                      key={index}
                      className="bg-white bg-opacity-5 rounded-lg p-3 text-center hover:bg-opacity-10 transition"
                    >
                      <span className="text-blue-500">{place}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {tripData.description && (
              <div ref={descriptionRef} className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                <h3 className="text-2xl font-semibold mb-4 text-purple-600">{translations.tripDetails || "Trip Details"}</h3>
                <p className="text-blue-500 leading-relaxed ">{tripData.description}</p>
              </div>
            )}

            {/* CTA Button */}
            <div ref={ctaRef} className="text-center lg:text-left">
              <button 
                onClick={() => {
                  const whatsappLink = getWhatsAppLink(`I want to join the trip on ${formatDate(tripData.date)}`);
                  window.open(whatsappLink, '_blank');
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {translations.joinTrip || "Join This Trip"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-1/4 left-5 w-6 h-6 rounded-full bg-blue-400 opacity-30 animate-bounce"></div>
      <div className="absolute bottom-1/3 right-8 w-4 h-4 rounded-full bg-purple-400 opacity-40 animate-bounce animation-delay-1000"></div>
      <div className="absolute top-2/3 left-12 w-8 h-8 rounded-full bg-blue-300 opacity-20 animate-bounce animation-delay-2000"></div>
    </section>
  );
};

export default NextTrip;