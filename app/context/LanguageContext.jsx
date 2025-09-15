// LanguageContext.jsx
'use client' // Add this directive at the top

import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Set default language to Arabic
  const [currentLanguage, setCurrentLanguage] = useState('ar');

  const translations = {
    en: {
      home: 'Home',
      services: 'Services',
      plans: 'Plans',
      transportation: 'Transportation',
      hotels: 'Hotels',
      residence: 'Residence',
      contact: 'Contact',
      getToKnowRussia: 'Get to Know Russia',
      restaurants: 'Restaurants',
      touristAttractions: 'Tourist Attractions',
      events: 'Events',
      shopping: 'Shopping',
      museums: 'Museums',
      naturalPlaces: 'Natural Places',
      adminLogin: 'Admin Login',
      shareOnSocial: 'Share on Social Media',
      companyLocation: 'Company Location',
      viewOnMap: 'View on Google Maps',
      // Hero section translations
      heroTitle: 'Ruento Tourism',
      heroDescription: 'Experience Russia like never before with our premium tour services. As the leading tourism provider specializing in Russian destinations, we offer meticulously crafted experiences that blend rich cultural heritage, breathtaking landscapes, and unparalleled hospitality.',
      contactUs: 'Contact Us',
      email: 'Email address',
      password: 'Password',
      signin: 'Sign in',
      signingin: 'Signing in ...',
      backtohome: 'Back to Home page ←',
      email: 'Email address',
      password: 'Password',
      signingin: 'Signing in...',
      signin: 'Sign in',
      backtohome: '← Back to home',
      invalidCredentials: 'Invalid email or password',
      loginSuccess: 'Login successful!',
      welcomeAdmin: 'Welcome Admin',
      dashboard: 'Dashboard',
      logout: 'Logout',
      welcomeAdmin: 'Welcome Admin',
      manageHeroVideo: 'Manage the hero video on the homepage',
      updateTripInfo: 'Update the next trip date information',
      manageServices: 'Manage services cards (Plans, Transportation, etc.)',
      manageRussiaCategories: 'Manage Russia categories (Restaurants, Museums, etc.)',
      manageBlogPosts: 'Create and manage blog posts',
      manageTranslations: 'Manage translations and language content',
      manage: 'Manage',
      recentActivity: 'Recent Activity',
      heroSection: 'Hero Section',
      russiaCategories: 'Russia Categories',
      blogPosts: 'Blog Posts',
      languageContent: 'Language Content',
        manageServices: 'Manage Services',
  ourServices: 'Our Services',
  servicesDescription: 'Discover our comprehensive travel services designed to make your Russian adventure unforgettable',
  learnMore: 'Learn More',
  noServices: 'No services available at the moment. Please check back later.',
    getToKnowRussia: 'Get to Know Russia',
  discoverRussia: 'Discover the diverse beauty and rich culture of Russia through its many attractions',
  addItem: 'Add Item',
  noItems: 'No items added yet. Click "Add Item" to get started.',
  item: 'Item',
  images: 'Images',
  uploadImage: 'Upload Image',
  saving: 'Saving...',
  save: 'Save Changes',
  noContent: 'No content available for this category yet.'

    },
    ar: {
      home: 'الرئيسية',
      services: 'الخدمات',
      plans: 'الخطط',
      transportation: 'النقل',
      hotels: 'الفنادق',
      residence: 'الإقامة',
      contact: 'اتصل بنا',
      getToKnowRussia: 'تعرف على روسيا',
      restaurants: 'المطاعم',
      touristAttractions: 'المعالم السياحية',
      events: 'الفعاليات',
      shopping: 'التسوق',
      museums: 'المتاحف',
      naturalPlaces: 'الأماكن الطبيعية',
      adminLogin: 'تسجيل الدخول كمسؤول',
      shareOnSocial: 'مشاركة على وسائل التواصل',
      companyLocation: 'موقع الشركة',
      viewOnMap: 'عرض على خرائط جوجل',
      // Hero section translations
      heroTitle: 'روينتو للسياحة',
      heroDescription: 'جرب روسيا كما لم يحدث من قبل مع خدماتنا السياحية المميزة. كأفضل مزود للخدمات السياحية المتخصصة في الوجهات الروسية، نقدم تجارب مصممة بدقة تمزج بين التراث الثقافي الغني، والمناظر الطبيعية الخلابة، والضيافة التي لا مثيل لها.',
      contactUs: 'اتصل بنا',
      email: 'الإيميل',
      password: 'كلمة المرور',
      signin: 'تسجيل الدخول',
      signingin: 'جاري تسجيل الدخول ...',
      backtohome: 'العودة إلى الصفحة الرئيسية ← ',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      signingin: 'جاري تسجيل الدخول...',
      signin: 'تسجيل الدخول',
      backtohome: '← العودة إلى الرئيسية',
      invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      loginSuccess: 'تم تسجيل الدخول بنجاح!',
      welcomeAdmin: 'مرحباً يا أدمن',
      dashboard: 'لوحة التحكم',
      logout: 'تسجيل الخروج',
      welcomeAdmin: 'مرحباً يا أدمن',
      manageHeroVideo: 'إدارة الفيديو الرئيسي على الصفحة الرئيسية',
      updateTripInfo: 'تحديث معلومات تاريخ الرحلة القادمة',
      manageServices: 'إدارة بطاقات الخدمات (الخطط، النقل، إلخ)',
      manageRussiaCategories: 'إدارة فئات روسيا (المطاعم، المتاحف، إلخ)',
      manageBlogPosts: 'إنشاء وإدارة المقالات',
      manageTranslations: 'إدارة الترجمات والمحتوى اللغوي',
      manage: 'إدارة',
      recentActivity: 'النشاط الحديث',
      heroSection: 'القسم الرئيسي',
      russiaCategories: 'فئات روسيا',
      blogPosts: 'المقالات',
      languageContent: 'المحتوى اللغوي',
      nextTrip: 'تخطيط الرحلة القادمة',
      destinations: 'وجهة الرحلة',
      joinTrip: 'انضم إلينا في هذه الرحلة',
      tripDetails: 'تفاصيل الرحلة',
      countdown: 'العد التنازلي للرحلة',
      ournexttrip: 'رحلتنا القادمة',
      experienceRussia: 'استمتع بجمال المناظر الطبيعية المتنوعة والثقافة الغنية في روسيا',
      Title : 'العنوان',
      Description : 'الشرح',
      Image : 'الصور',
      Imageuploaded : 'تم تحميل الصورة',
      UploadImage : 'تحميل الصور',
        manageServices: 'إدارة الخدمات',
  ourServices: 'خدماتنا',
  servicesDescription: 'اكتشف خدمات السفر الشاملة المصممة لجعل مغامرتك الروسية لا تنسى',
  learnMore: 'اعرف المزيد',
  noServices: 'لا توجد خدمات متاحة في الوقت الحالي. يرجى التحقق مرة أخرى لاحقًا.',
    getToKnowRussia: 'تعرف على روسيا',
  discoverRussia: 'اكتشف الجمال المتنوع والثقافة الغنية لروسيا من خلال معالمها العديدة',
  addItem: 'إضافة عنصر',
  noItems: 'لم تتم إضافة أي عناصر بعد. انقر فوق "إضافة عنصر" للبدء.',
  item: 'العنصر',
  images: 'الصور',
  uploadImage: 'تحميل الصورة',
  saving: 'جاري الحفظ...',
  save: 'حفظ التغييرات',
  noContent: 'لا يوجد محتوى متاح لهذه الفئة بعد.'
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage(prevLang => prevLang === 'en' ? 'ar' : 'en');
  };

  const value = {
    currentLanguage,
    toggleLanguage,
    translations: translations[currentLanguage]
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'} className={currentLanguage === 'ar' ? 'font-arabic' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export { LanguageContext };