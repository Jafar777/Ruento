// src/app/ClientProviders.jsx
'use client'

import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import { ContactsProvider } from './context/ContactsContext'
import WhatsAppButton from './components/WhatsAppButton'

export default function ClientProviders({ children }) {
  return (
    <LanguageProvider>
                <ContactsProvider>

      <Navbar />
      {children}
                  <WhatsAppButton />

                </ContactsProvider>

    </LanguageProvider>
  )
}