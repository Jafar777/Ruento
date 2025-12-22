// app/components/Contact.jsx
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContacts } from '../hooks/useContacts'; // Add this import
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaClock, FaWhatsapp } from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { translations } = useLanguage();
  const { contacts, getWhatsAppLink, loading } = useContacts(); // Use the hook

  // Create refs for elements to animate
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contactInfoRef = useRef(null);
  const contactItemsRef = useRef([]);
  const mapRef = useRef(null);
  const formRef = useRef(null);
  const formFieldsRef = useRef([]);

  // Set up animations after component is mounted
  useEffect(() => {
    // ... (keep existing animations)
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage(translations.contactSuccess || 'Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    }, 1500);
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
        </div>
      </section>
    );
  }

  // Get WhatsApp link
  const whatsappLink = getWhatsAppLink();

  return (
    <section id="contact" ref={sectionRef} className="py-16 px-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-soft-light filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-soft-light filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            {translations.contactUs || 'Contact Us'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6"></div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {translations.contactDescription || 'Get in touch with us for any questions about our services or to plan your next trip to Russia'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div ref={contactInfoRef} className="space-y-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border text-purple-600 border-white border-opacity-20">
              <h3 className="text-2xl font-semibold mb-6">{translations.getInTouch || 'Get In Touch'}</h3>

              <div className="space-y-6">
                <div ref={el => contactItemsRef.current[0] = el} className="flex items-start">
                  <div className="bg-blue-500 p-3 rounded-full mr-4">
                    <FaPhone className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{translations.phone || 'Phone'}</h4>
                    <p className="">{contacts?.phone || '+1 (555) 123-4567'}</p>
                  </div>
                </div>

                <div ref={el => contactItemsRef.current[1] = el} className="flex items-start">
                  <div className="bg-purple-500 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{translations.email || 'Email'}</h4>
                    <p className="">{contacts?.email || 'info@ruentotourism.com'}</p>
                  </div>
                </div>

                <div ref={el => contactItemsRef.current[2] = el} className="flex items-start">
                  <div className="bg-green-500 p-3 rounded-full mr-4">
                    <FaWhatsapp className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{translations.whatsapp || 'WhatsApp'}</h4>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {contacts?.whatsapp || '+1 (555) 123-4567'}
                    </a>
                  </div>
                </div>

                <div ref={el => contactItemsRef.current[3] = el} className="flex items-start">
                  <div className="bg-orange-500 p-3 rounded-full mr-4">
                    <FaClock className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{translations.officeHours || 'Office Hours'}</h4>
                    <p className="">{contacts?.businessHours || 'Monday - Friday: 9AM - 6PM'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div ref={mapRef} className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <h3 className="text-2xl font-semibold mb-4">{translations.ourLocation || 'Our Location'}</h3>
              <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <FaMapMarkerAlt className="text-white text-4xl mx-auto mb-4" />
                  <p className="text-lg">{contacts?.address || '123 Moscow Street, Moscow, Russia'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Keep as is */}
          <div ref={formRef} className="space-y-6">

            
            {/* WhatsApp Quick Contact */}
            <div className="bg-green-500 bg-opacity-20 backdrop-blur-md rounded-2xl p-6 border border-green-500 border-opacity-40">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-500 p-3 rounded-full">
                  <FaWhatsapp className="text-white text-2xl" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{translations.quickWhatsApp || 'Quick Contact via WhatsApp'}</h4>
                  <p className="text-green-200">{translations.whatsappDescription || 'Get instant response on WhatsApp'}</p>
                </div>
              </div>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold flex items-center justify-center hover:bg-green-700 transition duration-300"
              >
                <FaWhatsapp className="mr-2" />
                {translations.messageOnWhatsApp || 'Message on WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;