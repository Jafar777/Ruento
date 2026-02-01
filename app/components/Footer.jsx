// app/components/Footer.jsx
'use client'

import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContacts } from '../hooks/useContacts';
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
  const { contacts, getSocialLinks, loading } = useContacts();

  // Create refs for elements to animate
  const footerRef = useRef(null);
  const companyInfoRef = useRef(null);
  const quickLinksRef = useRef(null);
  const contactInfoRef = useRef(null);
  const bottomBarRef = useRef(null);
  const socialIconsRef = useRef([]);
  const scrollTopButtonRef = useRef(null);

  // Get social links
  const socialLinks = getSocialLinks();

  // Set up animations after component is mounted
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate footer sections on scroll
      const sections = [companyInfoRef, quickLinksRef, contactInfoRef];
      
      sections.forEach((ref, index) => {
        if (ref.current) {
          gsap.from(ref.current, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      });

      // Animate social icons with stagger
      if (socialIconsRef.current.length > 0) {
        gsap.from(socialIconsRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.5,
          scrollTrigger: {
            trigger: companyInfoRef.current,
            start: 'top 85%'
          }
        });
      }

      // Animate bottom bar
      if (bottomBarRef.current) {
        gsap.from(bottomBarRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: bottomBarRef.current,
            start: 'top 90%'
          }
        });
      }

      // Scroll to top button animation
      if (scrollTopButtonRef.current) {
        gsap.from(scrollTopButtonRef.current, {
          scale: 0,
          rotation: 180,
          duration: 0.5,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 80%'
          }
        });
      }
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
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-soft-light filter blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-soft-light filter blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 xl:px-8 py-12 relative z-10">
        {/* Main Footer Content - Updated to 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 mb-12">
          {/* Company Info - Takes 2 columns on large screens for better balance */}
          <div ref={companyInfoRef} className="lg:col-span-1 space-y-6">
            <div className="mb-2">
              <Image
                src="/logo.png"
                alt="Ruento Tourism"
                width={140}
                height={140}
                className="object-contain"
              />
            </div>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base pr-4">
              {translations.footerDescription || 'Experience Russia like never before with our premium tour services. Discover the beauty and culture of Russia with expert guides.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {socialLinks.instagram !== '#' && (
                <a 
                  ref={el => socialIconsRef.current[0] = el} 
                  href={socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-pink-500 to-pink-700 p-3 rounded-full hover:from-pink-600 hover:to-pink-800 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-white text-base" />
                </a>
              )}
              
              {socialLinks.facebook !== '#' && (
                <a 
                  ref={el => socialIconsRef.current[1] = el} 
                  href={socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="Facebook"
                >
                  <FaFacebook className="text-white text-base" />
                </a>
              )}
              
              {socialLinks.twitter !== '#' && (
                <a 
                  ref={el => socialIconsRef.current[2] = el} 
                  href={socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-sky-400 to-sky-600 p-3 rounded-full hover:from-sky-500 hover:to-sky-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-white text-base" />
                </a>
              )}
              
              {socialLinks.linkedin !== '#' && (
                <a 
                  ref={el => socialIconsRef.current[3] = el} 
                  href={socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-blue-700 to-blue-900 p-3 rounded-full hover:from-blue-800 hover:to-blue-950 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-white text-base" />
                </a>
              )}
              
              {socialLinks.youtube !== '#' && (
                <a 
                  ref={el => socialIconsRef.current[4] = el} 
                  href={socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-red-600 to-red-800 p-3 rounded-full hover:from-red-700 hover:to-red-900 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="YouTube"
                >
                  <FaYoutube className="text-white text-base" />
                </a>
              )}
              
              {socialLinks.tiktok !== '#' && (
                <a 
                  ref={el => socialIconsRef.current[5] = el} 
                  href={socialLinks.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-gray-900 to-black p-3 rounded-full hover:from-gray-800 hover:to-gray-900 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="TikTok"
                >
                  <FaTiktok className="text-white text-base" />
                </a>
              )}
              
              {socialLinks.telegram !== '#' && (
                <a 
                  ref={el => socialIconsRef.current[6] = el} 
                  href={socialLinks.telegram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-full hover:from-blue-500 hover:to-blue-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="Telegram"
                >
                  <FaTelegram className="text-white text-base" />
                </a>
              )}
              
              {socialLinks.whatsapp !== '#' && (
                <a 
                  ref={el => socialIconsRef.current[7] = el} 
                  href={socialLinks.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-full hover:from-green-600 hover:to-green-800 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="text-white text-base" />
                </a>
              )}
              
              {socialLinks.snapchat !== '#' && (
                <a 
                  ref={el => socialIconsRef.current[8] = el} 
                  href={socialLinks.snapchat} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-full hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  aria-label="Snapchat"
                >
                  <FaSnapchat className="text-white text-base" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div ref={quickLinksRef} className="space-y-6">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-700/50 w-fit">
              {translations.quickLinks || 'Quick Links'}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:pl-2 block py-1.5"
                >
                  {translations.home || 'Home'}
                </Link>
              </li>
              <li>
                <Link 
                  href="/#services" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:pl-2 block py-1.5"
                >
                  {translations.services || 'Services'}
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:pl-2 block py-1.5"
                >
                  {translations.blog || 'Blog'}
                </Link>
              </li>
              <li>
                <Link 
                  href="/#contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:pl-2 block py-1.5"
                >
                  {translations.contact || 'Contact'}
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/login" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:pl-2 block py-1.5"
                >
                  {translations.adminLogin || 'Admin Login'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div ref={contactInfoRef} className="space-y-6">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-700/50 w-fit">
              {translations.contactInfo || 'Contact Info'}
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start space-x-4">
                <div className="mt-0.5">
                  <FaPhone className="text-blue-400 text-base" />
                </div>
                <span className="text-gray-300 text-sm md:text-base leading-relaxed" dir="ltr">
                  {contacts?.phone || '+1 (555) 123-4567'}
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <div className="mt-0.5">
                  <FaEnvelope className="text-blue-400 text-base" />
                </div>
                <span className="text-gray-300 text-sm md:text-base leading-relaxed break-words">
                  {contacts?.email || 'info@ruentotourism.com'}
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <div className="mt-0.5">
                  <FaWhatsapp className="text-green-400 text-base" />
                </div>
                <a 
                  href={socialLinks.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm md:text-base leading-relaxed break-words"
                  dir="ltr"
                >
                  {contacts?.whatsapp || '+1 (555) 123-4567'}
                </a>
              </li>

            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div ref={bottomBarRef} className="border-t border-gray-800/70 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm md:text-base text-center md:text-left order-2 md:order-1">
              &copy; {new Date().getFullYear()} Ruento Tourism. {translations.allRightsReserved || 'All rights reserved.'}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-gray-400 order-1 md:order-2">
              <a 
                href={contacts?.privacyPolicy || '#'} 
                className="hover:text-white transition-colors duration-300 px-1"
              >
                {translations.privacyPolicy || 'Privacy Policy'}
              </a>
              <a 
                href={contacts?.termsOfService || '#'} 
                className="hover:text-white transition-colors duration-300 px-1"
              >
                {translations.termsOfService || 'Terms of Service'}
              </a>
              <a 
                href="#" 
                className="hover:text-white transition-colors duration-300 px-1"
              >
                {translations.faq || 'FAQ'}
              </a>
              <a 
                href="/sitemap" 
                className="hover:text-white transition-colors duration-300 px-1"
              >
                {translations.sitemap || 'Sitemap'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        ref={scrollTopButtonRef}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 z-50 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="text-lg" />
      </button>
    </footer>
  );
};

export default Footer;