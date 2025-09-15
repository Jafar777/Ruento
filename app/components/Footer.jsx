// app/components/Footer.jsx
'use client'

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
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
  FaArrowUp
} from 'react-icons/fa';

const Footer = () => {
  const { translations, currentLanguage } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-soft-light filter blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-soft-light filter blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src="/logo.png"
                alt="Ruento Tourism"
                width={120}
                height={48}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-6">
              {translations.footerDescription || 'Experience Russia like never before with our premium tour services. Discover the beauty and culture of Russia with expert guides.'}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition">
                <FaFacebook className="text-white" />
              </a>
              <a href="#" className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition">
                <FaTwitter className="text-white" />
              </a>
              <a href="#" className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 transition">
                <FaInstagram className="text-white" />
              </a>
              <a href="#" className="bg-blue-700 p-2 rounded-full hover:bg-blue-800 transition">
                <FaLinkedin className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
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

          {/* Russia Categories */}
          <div>
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

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6">{translations.contactInfo || 'Contact Info'}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-400 mt-1 mr-3" />
                <span className="text-gray-400">123 Tourism Street, Moscow, Russia</span>
              </li>
              <li className="flex items-start">
                <FaPhone className="text-blue-400 mt-1 mr-3" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="text-blue-400 mt-1 mr-3" />
                <span className="text-gray-400">info@ruentotourism.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">{translations.newsletter || 'Subscribe to our Newsletter'}</h3>
              <p className="text-gray-400">{translations.newsletterDescription || 'Get the latest news and updates about our services and offers.'}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder={translations.yourEmail || 'Your email address'}
                className="px-4 py-3 rounded-md bg-white bg-opacity-5 border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 sm:min-w-72"
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-300">
                {translations.subscribe || 'Subscribe'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Ruento Tourism. {translations.allRightsReserved || 'All rights reserved.'}
          </p>
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">
              {translations.privacyPolicy || 'Privacy Policy'}
            </a>
            <a href="#" className="hover:text-white transition">
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