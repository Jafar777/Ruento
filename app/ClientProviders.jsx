// src/app/ClientProviders.jsx
'use client'

import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'

export default function ClientProviders({ children }) {
  return (
    <LanguageProvider>
      <Navbar />
      {children}
    </LanguageProvider>
  )
}