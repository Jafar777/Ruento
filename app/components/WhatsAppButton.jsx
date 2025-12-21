// app/components/WhatsAppButton.jsx
'use client'

import React from 'react';
import { useContacts } from '../context/ContactsContext';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const { contacts, loading } = useContacts();

  if (loading || !contacts?.whatsapp) return null;

  const whatsappNumber = contacts.whatsapp.replace(/\D/g, '');
  const message = encodeURIComponent(contacts.whatsappMessage || 'Hello! I am interested in your services.');

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 hover:shadow-xl"
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
      <span className="absolute -top-2 -right-2 flex h-6 w-6">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500 items-center justify-center text-xs">
          <FaWhatsapp className="text-white" />
        </span>
      </span>
    </a>
  );
};

export default WhatsAppButton;