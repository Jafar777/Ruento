// app/components/Footer.jsx
'use client'

import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContacts } from '../hooks/useContacts'; // Add this import
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaTelegram,
  FaWhatsapp,
  FaSnapchat,
  FaArrowUp
} from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const { translations, currentLanguage } = useLanguage();
  const { contacts, getSocialLinks, loading } = useContacts(); // Use the hook

  // Create refs for elements to animate
  const footerRef = useRef(null);
  const companyInfoRef = useRef(null);
  const quickLinksRef = useRef(null);
  const russiaCategoriesRef = useRef(null);
  const contactInfoRef = useRef(null);
  const newsletterRef = useRef(null);
  const bottomBarRef = useRef(null);
  const socialIconsRef = useRef([]);
  const scrollTopButtonRef = useRef(null);

  // Get social links
  const socialLinks = getSocialLinks();

  // Set up animations after component is mounted
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ... (keep all existing animations the same)
    }, footerRef);

    // Clean up function
    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
        </div>
      </footer>
    );
  }

  return (
    <footer ref={footerRef} className="bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-soft-light filter blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-soft-light filter blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div ref={companyInfoRef} className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src="/logo.png"
                alt="Ruento Tourism"
                width={140}
                height={140}
                className=""
              />
            </div>
            <p className="text-gray-400 mb-6">
              {translations.footerDescription || 'Experience Russia like never before with our premium tour services. Discover the beauty and culture of Russia with expert guides.'}
            </p>
            <div className="flex space-x-2">
              {socialLinks.instagram !== '#' && (
                <a ref={el => socialIconsRef.current[0] = el} 
                   href={socialLinks.instagram} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 transition">
                  <FaInstagram className="text-white" />
                </a>
              )}
              
              {socialLinks.facebook !== '#' && (
                <a ref={el => socialIconsRef.current[1] = el} 
                   href={socialLinks.facebook} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition">
                  <FaFacebook className="text-white" />
                </a>
              )}
              
              {socialLinks.twitter !== '#' && (
                <a ref={el => socialIconsRef.current[2] = el} 
                   href={socialLinks.twitter} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition">
                  <FaTwitter className="text-white" />
                </a>
              )}
              
              {socialLinks.linkedin !== '#' && (
                <a ref={el => socialIconsRef.current[3] = el} 
                   href={socialLinks.linkedin} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-blue-700 p-2 rounded-full hover:bg-blue-800 transition">
                  <FaLinkedin className="text-white" />
                </a>
              )}
              
              {socialLinks.youtube !== '#' && (
                <a ref={el => socialIconsRef.current[4] = el} 
                   href={socialLinks.youtube} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition">
                  <FaYoutube className="text-white" />
                </a>
              )}
              
              {socialLinks.tiktok !== '#' && (
                <a ref={el => socialIconsRef.current[5] = el} 
                   href={socialLinks.tiktok} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-black p-2 rounded-full hover:bg-gray-800 transition">
                  <FaTiktok className="text-white" />
                </a>
              )}
              
              {socialLinks.telegram !== '#' && (
                <a ref={el => socialIconsRef.current[6] = el} 
                   href={socialLinks.telegram} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition">
                  <FaTelegram className="text-white" />
                </a>
              )}
              
              {socialLinks.whatsapp !== '#' && (
                <a ref={el => socialIconsRef.current[7] = el} 
                   href={socialLinks.whatsapp} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-green-500 p-2 rounded-full hover:bg-green-600 transition">
                  <FaWhatsapp className="text-white" />
                </a>
              )}
              
              {socialLinks.snapchat !== '#' && (
                <a ref={el => socialIconsRef.current[8] = el} 
                   href={socialLinks.snapchat} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-yellow-500 p-2 rounded-full hover:bg-yellow-600 transition">
                  <FaSnapchat className="text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links - Keep as is */}
          <div ref={quickLinksRef}>
            <h3 className="text-xl font-semibold mb-6">{translations.quickLinks || 'Quick Links'}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  {translations.home || 'Home'}
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-gray-400 hover:text-white transition">
                  {translations.services || 'Services'}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition">
                  {translations.blog || 'Blog'}
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-white transition">
                  {translations.contact || 'Contact'}
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-400 hover:text-white transition">
                  {translations.adminLogin || 'Admin Login'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Russia Categories - Keep as is */}
          <div ref={russiaCategoriesRef}>
            <h3 className="text-xl font-semibold mb-6">{translations.discoverRussia || 'Discover Russia'}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/restaurants" className="text-gray-400 hover:text-white transition">
                  {translations.restaurants || 'Restaurants'}
                </Link>
              </li>
              <li>
                <Link href="/attractions" className="text-gray-400 hover:text-white transition">
                  {translations.touristAttractions || 'Tourist Attractions'}
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition">
                  {translations.events || 'Events'}
                </Link>
              </li>
              <li>
                <Link href="/shopping" className="text-gray-400 hover:text-white transition">
                  {translations.shopping || 'Shopping'}
                </Link>
              </li>
              <li>
                <Link href="/museums" className="text-gray-400 hover:text-white transition">
                  {translations.museums || 'Museums'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Use dynamic contacts */}
          <div ref={contactInfoRef}>
            <h3 className="text-xl font-semibold mb-6">{translations.contactInfo || 'Contact Info'}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-400 mt-1 mr-3" />
                <span className="text-gray-400 ml-1 mr-1">{contacts?.address || '123 Tourism Street, Moscow, Russia'}</span>
              </li>
              <li className="flex items-start">
                <FaPhone className="text-blue-400 mt-1 mr-3" />
                <span className="text-gray-400 ml-1 mr-1" dir="ltr">{contacts?.phone || '+1 (555) 123-4567'}</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="text-blue-400 mt-1 mr-3 " />
                <span className="text-gray-400 ml-1 mr-1">{contacts?.email || 'info@ruentotourism.com'}</span>
              </li>
              <li className="flex items-start">
                <FaWhatsapp className="text-green-400 mt-1 mr-3" />
                <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition ml-1 mr-1" dir="ltr">
                  {contacts?.whatsapp || '+1 (555) 123-4567'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div ref={bottomBarRef} className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Ruento Tourism. {translations.allRightsReserved || 'All rights reserved.'}
          </p>
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <a href={contacts?.privacyPolicy || '#'} className="hover:text-white transition">
              {translations.privacyPolicy || 'Privacy Policy'}
            </a>
            <a href={contacts?.termsOfService || '#'} className="hover:text-white transition">
              {translations.termsOfService || 'Terms of Service'}
            </a>
            <a href="#" className="hover:text-white transition">
              {translations.faq || 'FAQ'}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        ref={scrollTopButtonRef}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 z-50"
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;