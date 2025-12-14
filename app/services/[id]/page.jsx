// app/services/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Users, MapPin, CheckCircle, Phone, Mail, Globe } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import { useLanguage } from '../../context/LanguageContext';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    travelers: 1,
    specialRequests: ''
  });
  
  const { translations } = useLanguage();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${params.id}`);
        if (!response.ok) {
          throw new Error('Service not found');
        }
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
        router.push('/#services');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id, router]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', { service: service.title, ...bookingData });
    alert('Booking request submitted! We will contact you shortly.');
    setIsBookingModalOpen(false);
    setBookingData({
      name: '',
      email: '',
      phone: '',
      startDate: '',
      travelers: 1,
      specialRequests: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative w-16 h-16 border-4 border-transparent border-t-blue-400 border-r-purple-400 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  const images = service.images || [];
  const includedFeatures = service.includedFeatures || [
    translations.expertLocalGuides || 'Expert local guides',
    translations.comfortableAccommodations || 'Comfortable accommodations',
    translations.allTransportationIncluded || 'All transportation included',
    translations.entryFeesToAttractions || 'Entry fees to attractions',
    translations.traditionalMeals || 'Traditional meals',
    translations.support24_7 || '24/7 support'
  ];
  
  const itinerary = service.itinerary || [
    { day: translations.day1 || 'Day 1', title: translations.arrivalWelcome || 'Arrival & Welcome', description: translations.arrivalWelcomeDesc || 'Airport pickup and traditional welcome dinner' },
    { day: translations.day2 || 'Day 2', title: translations.cityExploration || 'City Exploration', description: translations.cityExplorationDesc || 'Guided tour of historical sites and local markets' },
    { day: translations.day3 || 'Day 3', title: translations.culturalImmersion || 'Cultural Immersion', description: translations.culturalImmersionDesc || 'Traditional workshops and cultural performances' },
    { day: translations.day4 || 'Day 4', title: translations.naturalWonders || 'Natural Wonders', description: translations.naturalWondersDesc || 'Day trip to scenic landscapes and natural reserves' },
    { day: translations.day5 || 'Day 5', title: translations.departure || 'Departure', description: translations.departureDesc || 'Final breakfast and airport transfer' },
  ];
  
  const contactInfo = service.contactInfo || {
    phone: '+1 (234) 567-890',
    email: 'info@ruento.com',
    liveChat: translations.available24_7 || 'Available 24/7'
  };
  
  const benefits = service.benefits || [
    translations.bestPriceGuarantee || 'Best price guarantee',
    translations.flexibleCancellation || 'Flexible cancellation',
    translations.localExpertGuides || 'Local expert guides',
    translations.sustainableTourism || 'Sustainable tourism'
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
          <div className="container mx-auto px-4 py-16 relative">
            <Link 
              href="/#services"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {translations.backToServices || 'Back to Services'}
            </Link>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left Column - Images & Basic Info */}
              <div className="lg:w-1/2">
                {/* Main Image */}
                <div className="mb-6 rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl">
                  {images.length > 0 ? (
                    <img 
                      src={images[selectedImage]} 
                      alt={service.title}
                      className="w-full h-[400px] object-cover"
                    />
                  ) : (
                    <div className="w-full h-[400px] bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
                      <span className="text-6xl">{service.icon || '✨'}</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage === index 
                            ? 'border-blue-500 scale-105' 
                            : 'border-gray-700/50 hover:border-gray-600'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Facts */}
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-bold mb-4 text-blue-300">
                    {translations.quickFacts || 'Quick Facts'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{translations.duration || 'Duration'}</p>
                        <p className="font-semibold">{service.duration || translations.durationDefault || '3-7 Days'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{translations.groupSize || 'Group Size'}</p>
                        <p className="font-semibold">{service.groupSize || translations.groupSizeDefault || '2-12 People'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{translations.availability || 'Availability'}</p>
                        <p className="font-semibold">{service.availability || translations.availabilityDefault || 'Year-round'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{translations.locations || 'Locations'}</p>
                        <p className="font-semibold">{service.locations || translations.locationsDefault || 'Multiple'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:w-1/2">
                {/* Service Icon & Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <span className="text-4xl">{service.icon || '✨'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-blue-400 font-semibold uppercase tracking-wider">
                      {translations.premiumService || 'Premium Service'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      {service.title}
                    </h1>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-blue-300">
                    {translations.overview || 'Overview'}
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features/Highlights */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-purple-300">
                    {translations.whatsIncluded || 'What\'s Included'}
                  </h2>
                  <div className="space-y-3">
                    {includedFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <p className="text-gray-400 mb-1">
                        {translations.startingFrom || 'Starting from'}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          ${service.price || 499}
                        </span>
                        <span className="text-gray-400">/ {service.priceUnit || translations.perPerson || 'person'}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {translations.customPackagesAvailable || 'Custom packages available'}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setIsBookingModalOpen(true)}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                      >
                        {translations.bookNow || 'Book Now'}
                      </button>
                      <button className="px-8 py-3 rounded-xl border-2 border-blue-500/50 text-blue-400 font-bold hover:bg-blue-500/10 transition-all duration-300">
                        {translations.requestQuote || 'Request Quote'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Itinerary */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-bold mb-6 text-blue-300">
                  {translations.detailedItinerary || 'Detailed Itinerary'}
                </h2>
                <div className="space-y-6">
                  {itinerary.map((day, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                          {day.day}
                        </div>
                        {index < itinerary.length - 1 && (
                          <div className="w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <h3 className="text-xl font-bold mb-2">{day.title}</h3>
                        <p className="text-gray-300">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Support */}
            <div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 text-purple-300">
                  {translations.needHelp || 'Need Help?'}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/10">
                      <Phone className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{translations.callUs || 'Call us'}</p>
                      <a href={`tel:${contactInfo.phone}`} className="text-lg font-semibold hover:text-blue-300 transition-colors">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/10">
                      <Mail className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{translations.emailUs || 'Email us'}</p>
                      <a href={`mailto:${contactInfo.email}`} className="text-lg font-semibold hover:text-purple-300 transition-colors">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-green-500/10">
                      <Globe className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{translations.liveChat || 'Live Chat'}</p>
                      <span className="text-lg font-semibold text-green-400">
                        {contactInfo.liveChat}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700/50">
                  <h3 className="text-lg font-bold mb-4">
                    {translations.whyChooseThisService || 'Why Choose This Service?'}
                  </h3>
                  <ul className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700/50">
            <h3 className="text-2xl font-bold mb-4">
              {translations.book || 'Book'} {service.title}
            </h3>
            <p className="text-gray-400 mb-6">
              {translations.fillDetails || 'Fill in your details and we\'ll contact you shortly'}
            </p>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={translations.fullName || 'Full Name'}
                value={bookingData.name}
                onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                required
              />
              <input
                type="email"
                placeholder={translations.emailAddress || 'Email Address'}
                value={bookingData.email}
                onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                required
              />
              <input
                type="tel"
                placeholder={translations.phoneNumber || 'Phone Number'}
                value={bookingData.phone}
                onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  placeholder={translations.startDate || 'Start Date'}
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                  required
                />
                <input
                  type="number"
                  placeholder={translations.travelers || 'Travelers'}
                  value={bookingData.travelers}
                  onChange={(e) => setBookingData({...bookingData, travelers: parseInt(e.target.value) || 1})}
                  min="1"
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                  required
                />
              </div>
              <textarea
                placeholder={translations.specialRequests || 'Special Requests'}
                rows={3}
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
              />
              
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-700/50 transition-colors"
                >
                  {translations.cancel || 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  {translations.submitBooking || 'Submit Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}