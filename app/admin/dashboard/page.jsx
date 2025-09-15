// src/app/admin/dashboard/page.jsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import { 
  FaVideo, 
  FaCalendarAlt, 
  FaConciergeBell, 
  FaLandmark, 
  FaBlog, 
  FaLanguage, 
  FaSignOutAlt,
  FaRocket,
  FaGlobe,
  FaHotel,
  FaBus,
  FaUmbrellaBeach,
  FaStore,
  FaMountain,
  FaUtensils
} from "react-icons/fa";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { translations } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const cardItems = [
    {
      title: translations.heroSection || "Hero Section",
      description: translations.manageHeroVideo || "Manage the hero video on the homepage",
      icon: <FaVideo className="text-white text-2xl" />,
      path: '/admin/dashboard/hero',
      color: "from-blue-500 to-blue-600"
    },
    {
      title: translations.nextTrip || "Next Trip Date",
      description: translations.updateTripInfo || "Update the next trip date information",
      icon: <FaCalendarAlt className="text-white text-2xl" />,
      path: '/admin/dashboard/trip-date',
      color: "from-purple-500 to-purple-600"
    },
    {
      title: translations.services || "Services",
      description: translations.manageServices || "Manage services cards (Plans, Transportation, etc.)",
      icon: <FaConciergeBell className="text-white text-2xl" />,
      path: '/admin/dashboard/services',
      color: "from-green-500 to-green-600"
    },
    {
      title: translations.russiaCategories || "Russia Categories",
      description: translations.manageRussiaCategories || "Manage Russia categories (Restaurants, Museums, etc.)",
      icon: <FaLandmark className="text-white text-2xl" />,
      path: '/admin/dashboard/get-to-know-russia',
      color: "from-red-500 to-red-600"
    },
    {
      title: translations.blogPosts || "Blog Posts",
      description: translations.manageBlogPosts || "Create and manage blog posts",
      icon: <FaBlog className="text-white text-2xl" />,
      path: '/admin/dashboard/blog',
      color: "from-orange-500 to-orange-600"
    },
    {
      title: translations.languageContent || "Language Content",
      description: translations.manageTranslations || "Manage translations and language content",
      icon: <FaLanguage className="text-white text-2xl" />,
      path: '/admin/dashboard/translations',
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const quickStats = [
    { label: "Total Visits", value: "1,243", change: "+12%", icon: <FaGlobe className="text-blue-400" /> },
    { label: "Bookings", value: "87", change: "+5%", icon: <FaHotel className="text-green-400" /> },
    { label: "Transport", value: "42", change: "+8%", icon: <FaBus className="text-purple-400" /> },
    { label: "Tours", value: "23", change: "+15%", icon: <FaUmbrellaBeach className="text-orange-400" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 text-white">
      <Navbar />
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-gradient-to-r from-blue-800 to-purple-800 rounded-2xl shadow-xl">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                {translations.dashboard || "Dashboard"}
              </h1>
              <p className="text-blue-200 mt-2">
                {translations.welcomeAdmin || "Welcome Admin"} | {new Date().toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 md:mt-0 flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              <FaSignOutAlt className="mr-2" />
              {translations.logout || "Logout"}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => router.push(item.path)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20`}>
                    {item.icon}
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-400 mb-4">
                  {item.description}
                </p>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm hover:from-blue-600 hover:to-purple-700 transition duration-200">
                  {translations.manage || "Manage"}
                </button>
              </div>
            ))}
          </div>

          {/* Recent Activity Section */}
          <div className="mt-12 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FaRocket className="mr-3 text-blue-400" />
              {translations.recentActivity || "Recent Activity"}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-2 rounded-lg mr-4">
                    <FaUtensils className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Updated restaurant listings</p>
                    <p className="text-sm text-gray-400">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-500 p-2 rounded-lg mr-4">
                    <FaMountain className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Added new natural places</p>
                    <p className="text-sm text-gray-400">5 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-purple-500 p-2 rounded-lg mr-4">
                    <FaStore className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Updated shopping section</p>
                    <p className="text-sm text-gray-400">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;