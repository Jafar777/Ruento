// app/components/Contact.jsx
'use client'

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaClock } from 'react-icons/fa';

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

  return (
    <section id="contact" className="py-16 px-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-soft-light filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-soft-light filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
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
          <div className="space-y-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border text-purple-600 border-white border-opacity-20">
              <h3 className="text-2xl font-semibold mb-6">{translations.getInTouch || 'Get In Touch'}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-500 p-3 rounded-full mr-4">
                    <FaPhone className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{translations.phone || 'Phone'}</h4>
                    <p className="">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-500 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{translations.email || 'Email'}</h4>
                    <p className="">info@ruentotourism.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-500 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{translations.address || 'Address'}</h4>
                    <p className="">123 Tourism Street, Moscow, Russia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-orange-500 p-3 rounded-full mr-4">
                    <FaClock className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{translations.officeHours || 'Office Hours'}</h4>
                    <p className="">{translations.hours || 'Monday - Friday: 9AM - 6PM'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border text-purple-600 border-white border-opacity-20">
              <h3 className="text-2xl font-semibold mb-4">{translations.visitUs || 'Visit Us'}</h3>
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-blue-100">{translations.mapPlaceholder || 'Interactive map would appear here'}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl text-purple-600 p-6 border border-white border-opacity-20">
            <h3 className="text-2xl font-semibold mb-6">{translations.sendMessage || 'Send us a Message'}</h3>
            
            {submitMessage && (
              <div className="bg-green-800 text-black p-4 rounded-md mb-6">
                {submitMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {translations.yourName || 'Your Name'} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 bg-white bg-opacity-5 border border-black border-opacity-20 rounded-md text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {translations.yourEmail || 'Your Email'} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-white bg-opacity-5 border border-black border-opacity-20 rounded-md text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {translations.subject || 'Subject'} *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 bg-white bg-opacity-5 border border-black border-opacity-20 rounded-md text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {translations.message || 'Message'} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-3 bg-white bg-opacity-5 border border-black border-opacity-20 rounded-md text-white"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-md font-semibold flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition duration-300 disabled:opacity-50 w-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    {translations.sending || 'Sending...'}
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    {translations.sendMessage || 'Send Message'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;