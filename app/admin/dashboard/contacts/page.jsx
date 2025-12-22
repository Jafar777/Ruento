// app/admin/dashboard/contacts/page.jsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import Navbar from '../../../components/Navbar';
import { 
  FaArrowLeft, FaSave, FaWhatsapp, 
  FaInstagram, FaFacebook, FaTwitter,
  FaLinkedin, FaYoutube, FaTiktok,
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaGlobe, FaTelegram, FaSnapchat
} from 'react-icons/fa';

const ContactsManagement = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState({
    phone: '+7 (999) 999-9999',
    whatsapp: '+7 (999) 999-9999',
    email: 'info@ruento.com',
    address: '123 Moscow Street, Moscow, Russia',
    // Social Media
    instagram: 'https://instagram.com/ruento',
    facebook: 'https://facebook.com/ruento',
    twitter: 'https://twitter.com/ruento',
    linkedin: 'https://linkedin.com/company/ruento',
    youtube: 'https://youtube.com/ruento',
    tiktok: 'https://tiktok.com/@ruento',
    telegram: 'https://t.me/ruento',
    snapchat: 'https://snapchat.com/add/ruento',
    // Business Hours
    businessHours: 'Monday - Friday: 9AM - 6PM',
    // WhatsApp Message Template
    whatsappMessage: 'Hello! I am interested in your services.',
    // SEO Meta
    seoDescription: 'Ruento Tourism - Premium travel services in Russia',
    seoKeywords: 'Russia tourism, travel to Russia, Moscow tours, St Petersburg travel',
    // Legal
    privacyPolicy: 'https://ruento.com/privacy',
    termsOfService: 'https://ruento.com/terms'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { translations } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchContacts();
    }
  }, [router]);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/contacts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contacts),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Contacts updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Error updating contacts');
      }
    } catch (error) {
      console.error('Error saving contacts:', error);
      setMessage('Error updating contacts');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setContacts(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const socialMediaPlatforms = [
    { key: 'whatsapp', icon: <FaWhatsapp className="text-green-500" />, label: translations.whatsapp, placeholder: '+7 (999) 999-9999' },
    { key: 'instagram', icon: <FaInstagram className="text-pink-500" />, label: translations.instagram, placeholder: 'https://instagram.com/username' },
    { key: 'facebook', icon: <FaFacebook className="text-blue-600" />, label: translations.facebook, placeholder: 'https://facebook.com/username' },
    { key: 'twitter', icon: <FaTwitter className="text-blue-400" />, label: translations.twitter, placeholder: 'https://twitter.com/username' },
    { key: 'linkedin', icon: <FaLinkedin className="text-blue-700" />, label: translations.linkedin, placeholder: 'https://linkedin.com/company/username' },
    { key: 'youtube', icon: <FaYoutube className="text-red-600" />, label: translations.youtube, placeholder: 'https://youtube.com/channel' },
    { key: 'tiktok', icon: <FaTiktok className="text-black" />, label: translations.tiktok, placeholder: 'https://tiktok.com/@username' },
    { key: 'telegram', icon: <FaTelegram className="text-blue-400" />, label: translations.telegram, placeholder: 'https://t.me/username' },
    { key: 'snapchat', icon: <FaSnapchat className="text-yellow-500" />, label: translations.snapchat, placeholder: 'https://snapchat.com/add/username' },
  ];

  const contactFields = [
    { key: 'phone', icon: <FaPhone />, label: translations.phoneNumber || 'Phone Number', type: 'tel' },
    { key: 'email', icon: <FaEnvelope />, label: translations.emailAddress || 'Email Address', type: 'email' },
    { key: 'address', icon: <FaMapMarkerAlt />, label: translations.physicalAddress || 'Physical Address', type: 'text' },
    { key: 'businessHours', icon: <FaGlobe />, label: translations.businessHours || 'Business Hours', type: 'text' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 text-white">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 transition duration-200 mr-4"
                title={translations.backToDashboard}
              >
                <FaArrowLeft />
              </button>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {translations.manageContactsAndSocialMediaTitle || "Manage Contacts & Social Media"}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
            >
              {translations.logout}
            </button>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-md ${message.includes('success') ? 'bg-green-800' : 'bg-red-800'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="bg-gray-800 bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-8">
              <h2 className="text-2xl font-semibold mb-6">{translations.contactInformation || "Contact Information"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      {field.icon}
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={contacts[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-gray-800 bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-8">
              <h2 className="text-2xl font-semibold mb-6">{translations.socialMediaLinks || "Social Media Links"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialMediaPlatforms.map((platform) => (
                  <div key={platform.key}>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      {platform.icon}
                      {platform.label}
                    </label>
                    <input
                      type="url"
                      value={contacts[platform.key]}
                      onChange={(e) => handleChange(platform.key, e.target.value)}
                      className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                      placeholder={platform.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Legal & SEO */}
            <div className="bg-gray-800 bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-8">
              <h2 className="text-2xl font-semibold mb-6">{translations.legalAndSEOSettings || "Legal & SEO Settings"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">{translations.seoDescription || "SEO Description"}</label>
                  <textarea
                    value={contacts.seoDescription}
                    onChange={(e) => handleChange('seoDescription', e.target.value)}
                    className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                    rows={3}
                    placeholder="Meta description for SEO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{translations.seoKeywords || "SEO Keywords"}</label>
                  <textarea
                    value={contacts.seoKeywords}
                    onChange={(e) => handleChange('seoKeywords', e.target.value)}
                    className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                    rows={3}
                    placeholder="Comma-separated keywords"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{translations.privacyPolicyURL || "Privacy Policy URL"}</label>
                  <input
                    type="url"
                    value={contacts.privacyPolicy}
                    onChange={(e) => handleChange('privacyPolicy', e.target.value)}
                    className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                    placeholder="https://yourwebsite.com/privacy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{translations.termsOfServiceURL || "Terms of Service URL"}</label>
                  <input
                    type="url"
                    value={contacts.termsOfService}
                    onChange={(e) => handleChange('termsOfService', e.target.value)}
                    className="w-full p-3 bg-gray-500 bg-opacity-5 border border-white border-opacity-20 rounded-md text-white"
                    placeholder="https://yourwebsite.com/terms"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-md font-semibold flex items-center hover:from-blue-600 hover:to-purple-700 transition duration-300 disabled:opacity-50"
              >
                <FaSave className="mr-2" />
                {saving ? 'Saving...' : (translations.saveAllSettings || 'Save All Settings')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactsManagement;