// app/components/Contact.jsx
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaClock } from 'react-icons/fa';
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
    const ctx = gsap.context(() => {
      // Animation for the main title - different entrance effect
      gsap.fromTo(titleRef.current,
        { opacity: 0, scale: 0.8, rotation: -5 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.8)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            markers: false,
          }
        }
      );

      // Animation for contact info section - slide from left
      gsap.fromTo(contactInfoRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: contactInfoRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            markers: false,
          }
        }
      );

      // Animation for contact items - staggered with a bounce effect
      contactItemsRef.current.forEach((itemRef, index) => {
        if (!itemRef) return;

        gsap.fromTo(itemRef,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: itemRef,
              start: 'top 90%',
              toggleActions: 'play none none none',
              markers: false,
            }
          }
        );
      });

      // Animation for map section - different effect
      gsap.fromTo(mapRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: mapRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            markers: false,
          }
        }
      );

      // Animation for form section - slide from right
      gsap.fromTo(formRef.current,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            markers: false,
          }
        }
      );

      // Animation for form fields - staggered with a fade and slight rotation
      formFieldsRef.current.forEach((fieldRef, index) => {
        if (!fieldRef) return;

        gsap.fromTo(fieldRef,
          { opacity: 0, rotation: -2, y: 20 },
          {
            opacity: 1,
            rotation: 0,
            y: 0,
            duration: 0.7,
            delay: index * 0.15,
            scrollTrigger: {
              trigger: fieldRef,
              start: 'top 90%',
              toggleActions: 'play none none none',
              markers: false,
            }
          }
        );
      });

      // Special animation for the submit button
      const submitButton = formRef.current?.querySelector('button[type="submit"]');
      if (submitButton) {
        gsap.fromTo(submitButton,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: submitButton,
              start: 'top 90%',
              toggleActions: 'play none none none',
              markers: false,
            }
          }
        );
      }
    }, sectionRef);

    // Clean up function
    return () => ctx.revert();
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
                    <p className="">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div ref={el => contactItemsRef.current[1] = el} className="flex items-start">
                  <div className="bg-purple-500 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{translations.email || 'Email'}</h4>
                    <p className="">info@ruentotourism.com</p>
                  </div>
                </div>



                <div ref={el => contactItemsRef.current[3] = el} className="flex items-start">
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

          </div>

          {/* Contact Form */}
          <div ref={formRef} className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl text-purple-600 p-6 border border-white border-opacity-20">
            <h3 className="text-2xl font-semibold mb-6">{translations.sendMessage || 'Send us a Message'}</h3>

            {submitMessage && (
              <div className="bg-green-800 text-black p-4 rounded-md mb-6">
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div ref={el => formFieldsRef.current[0] = el}>
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

                <div ref={el => formFieldsRef.current[1] = el}>
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

              <div ref={el => formFieldsRef.current[2] = el}>
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

              <div ref={el => formFieldsRef.current[3] = el}>
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