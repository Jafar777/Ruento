// app/hooks/useContacts.js
'use client'

import { useState, useEffect } from 'react';

export function useContacts() {
  const [contacts, setContacts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        } else {
          throw new Error('Failed to fetch contacts');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Helper function to get WhatsApp link with message
  const getWhatsAppLink = (customMessage = '') => {
    if (!contacts?.whatsapp) return '#';
    
    // Extract phone number from URL if it's a full URL, otherwise use as is
    let phoneNumber = contacts.whatsapp;
    if (phoneNumber.includes('wa.me/') || phoneNumber.includes('whatsapp.com/')) {
      // Extract phone number from URL
      const match = phoneNumber.match(/\/?\+?(\d+)/);
      if (match) phoneNumber = match[1];
    }
    
    // Remove all non-digit characters except plus
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    const message = customMessage || contacts.whatsappMessage || 'Hello! I am interested in your services.';
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  // Helper function to get social media links
  const getSocialLinks = () => ({
    whatsapp: getWhatsAppLink(),
    instagram: contacts?.instagram || '#',
    facebook: contacts?.facebook || '#',
    twitter: contacts?.twitter || '#',
    linkedin: contacts?.linkedin || '#',
    youtube: contacts?.youtube || '#',
    tiktok: contacts?.tiktok || '#',
    telegram: contacts?.telegram || '#',
    snapchat: contacts?.snapchat || '#',
  });

  return {
    contacts,
    loading,
    error,
    getWhatsAppLink,
    getSocialLinks,
  };
}