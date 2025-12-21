'use client'

import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdLanguage } from "react-icons/md";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

// Mobile Sidebar Component - Updated to remove share and location
const MobileSidebar = ({ isOpen, onClose, handleNavigation, handleUserIconClick }) => {
    const sidebarRef = useRef();
    const { translations, toggleLanguage, currentLanguage } = useLanguage();

    const handleLinkClick = (sectionId = null) => {
        if (sectionId) {
            handleNavigation(sectionId);
        }
        onClose();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>
            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-4">
                    <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold text-gray-800">
                        &times;
                    </button>
                    <div className="mt-12">
                        <nav className="flex flex-col space-y-4">
                            <button onClick={() => handleLinkClick('hero')} className="text-gray-800 hover:text-blue-500 transition py-2 text-left">
                                {translations.home}
                            </button>

                            <button onClick={() => handleLinkClick('services')} className="text-gray-800 hover:text-blue-500 transition py-2 text-left">
                                {translations.services}
                            </button>

                            <button onClick={() => handleLinkClick('get-to-know-russia')} className="text-gray-800 hover:text-blue-500 transition py-2 text-left">
                                {translations.getToKnowRussia}
                            </button>

                            <button onClick={() => handleLinkClick('blog')} className="text-gray-800 hover:text-blue-500 transition py-2 text-left">
                                {translations.blog || 'Blog'}
                            </button>

                            <button onClick={() => handleLinkClick('contact')} className="text-gray-800 hover:text-blue-500 transition py-2 text-left">
                                {translations.contact}
                            </button>
                        </nav>

                        <div className="mt-8 border-t pt-4">
                            <button
                                onClick={handleUserIconClick}
                                className="flex items-center space-x-2 text-gray-800 hover:text-blue-500 transition py-2 w-full"
                            >
                                <FaUser size={20} />
                                <span>Admin</span>
                            </button>
                        </div>

                        <div className="mt-8 border-t pt-4">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center space-x-2 text-gray-800 hover:text-blue-500 transition py-2 w-full"
                            >
                                <MdLanguage size={24} />
                                <span>{currentLanguage === 'en' ? 'العربية' : 'English'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Navbar Component with share and location removed
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navbarRef = useRef();
    const { translations, toggleLanguage, currentLanguage } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();

    const isAdminLoginPage = pathname === '/admin/login';
    const isHomePage = pathname === '/';

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    useEffect(() => {
        // Always solid on non-home pages
        if (!isHomePage) {
            setIsScrolled(true);
            return;
        }

        // On home page, check scroll position
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        // Set initial state based on current scroll position
        setIsScrolled(window.scrollY > 50);
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    useGSAP(() => {
        gsap.fromTo(navbarRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
        );
    }, []);

    const handleUserIconClick = () => {
        router.push('/admin/dashboard');
    };

    const handleNavigation = (sectionId) => {
        if (pathname !== '/') {
            // Store the section to scroll to in sessionStorage
            sessionStorage.setItem('scrollToSection', sectionId);
            sessionStorage.setItem('scrollTimestamp', Date.now().toString());
            
            // Navigate to home
            router.push('/');
        } else {
            // Already on home page, scroll to section immediately
            scrollToSection(sectionId);
        }
    };

    const scrollToSection = (sectionId) => {
        // Special handling for home/hero - scroll to top of page
        if (sectionId === 'hero') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

        // For other sections, find the element and scroll to it
        const element = document.getElementById(sectionId);
        if (element) {
            // Use scrollIntoView which is more reliable
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Clear the stored section after successful scroll
            sessionStorage.removeItem('scrollToSection');
            sessionStorage.removeItem('scrollTimestamp');
        } else {
            // If element not found, try again after a short delay
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    sessionStorage.removeItem('scrollToSection');
                    sessionStorage.removeItem('scrollTimestamp');
                }
            }, 300);
        }
    };

    // Listen for navigation completion to trigger scrolling
    useEffect(() => {
        const handleRouteChange = () => {
            if (pathname === '/') {
                // Check if there's a section to scroll to
                const sectionToScroll = sessionStorage.getItem('scrollToSection');
                const scrollTimestamp = sessionStorage.getItem('scrollTimestamp');
                
                if (sectionToScroll && scrollTimestamp) {
                    const timeElapsed = Date.now() - parseInt(scrollTimestamp);
                    
                    // If less than 5 seconds have passed, scroll to section
                    if (timeElapsed < 5000) {
                        // Wait a bit for the page to fully render
                        setTimeout(() => {
                            scrollToSection(sectionToScroll);
                        }, 500);
                    } else {
                        // Clear old scroll data
                        sessionStorage.removeItem('scrollToSection');
                        sessionStorage.removeItem('scrollTimestamp');
                    }
                }
            }
        };

        // Listen for route changes
        const timeoutId = setTimeout(() => {
            handleRouteChange();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    // Determine navbar background class
    const getNavbarBackground = () => {
        // Admin login page always has blue background
        if (isAdminLoginPage) {
            return 'bg-blue-600 shadow-md';
        }
        
        // Non-home pages always have blue background
        if (!isHomePage) {
            return 'bg-blue-600 shadow-md';
        }
        
        // Home page: transparent when not scrolled, blue when scrolled
        return isScrolled ? 'bg-blue-600 shadow-md' : 'bg-transparent';
    };

    return (
        <>
            <header
                ref={navbarRef}
                className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 h-16 ${getNavbarBackground()}`}
            >
                <div className="container mx-auto px-4 h-full">
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center justify-between h-full almarai-regular">
                        {/* Left Icons - Only User icon remains */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleUserIconClick}
                                className={`p-2 rounded-full hover:bg-blue-600 transition cursor-pointer ${
                                    isHomePage && !isScrolled ? 'text-gray-800 hover:bg-blue-100' : 'text-white hover:bg-blue-600'
                                }`}
                                suppressHydrationWarning
                            >
                                <FaUser size={20} />
                            </button>
                        </div>

                        {/* Centered Logo */}
                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <button onClick={() => handleNavigation('hero')} className="cursor-pointer">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={140}
                                    height={140}
                                    className="h-32 w-auto"
                                />
                            </button>
                        </div>

                        {/* Right Navigation */}
                        <div className="flex items-center space-x-6">
                            <nav className="flex items-center space-x-6">
                                <button 
                                    onClick={() => handleNavigation('hero')} 
                                    className={`transition ml-3 mr-3 ${
                                        isHomePage && !isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
                                    }`}
                                >
                                    {translations.home}
                                </button>

                                <button
                                    onClick={() => handleNavigation('services')}
                                    className={`ml-3 mr-3 transition ${
                                        isHomePage && !isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
                                    }`}
                                >
                                    {translations.services}
                                </button>

                                <button
                                    onClick={() => handleNavigation('get-to-know-russia')}
                                    className={`ml-3 mr-3 transition ${
                                        isHomePage && !isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
                                    }`}
                                >
                                    {translations.getToKnowRussia}
                                </button>

                                <button
                                    onClick={() => handleNavigation('blog')}
                                    className={`ml-3 mr-3 transition ${
                                        isHomePage && !isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
                                    }`}
                                >
                                    {translations.blog || 'Blog'}
                                </button>

                                <button 
                                    onClick={() => handleNavigation('contact')} 
                                    className={`ml-3 mr-3 transition ${
                                        isHomePage && !isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
                                    }`}
                                >
                                    {translations.contact}
                                </button>
                            </nav>

                            <button
                                onClick={toggleLanguage}
                                className={`p-2 rounded-full hover:bg-blue-600 transition cursor-pointer ${
                                    isHomePage && !isScrolled ? 'text-gray-800 hover:bg-blue-100' : 'text-white hover:bg-blue-600'
                                }`}
                            >
                                <MdLanguage size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex lg:hidden items-center justify-between h-full">
                        <div className="flex items-center h-full">
                            <button
                                onClick={() => setMobileSidebarOpen(true)}
                                className={`p-2 rounded-full hover:bg-blue-600 transition ${
                                    isHomePage && !isScrolled ? 'text-gray-800 hover:bg-blue-100' : 'text-white hover:bg-blue-600'
                                }`}
                            >
                                <RxHamburgerMenu size={24} />
                            </button>
                        </div>

                        <div className="flex items-center justify-center h-full flex-1">
                            <button onClick={() => handleNavigation('hero')} className="cursor-pointer">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={100}
                                    height={100}
                                    className="h-10 w-auto"
                                />
                            </button>
                        </div>

                        <div className="flex items-center h-full">
                            <button
                                onClick={toggleLanguage}
                                className={`p-2 rounded-full hover:bg-blue-600 transition ${
                                    isHomePage && !isScrolled ? 'text-gray-800 hover:bg-blue-100' : 'text-white hover:bg-blue-600'
                                }`}
                            >
                                <MdLanguage size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
                handleNavigation={handleNavigation}
                handleUserIconClick={handleUserIconClick}
            />
        </>
    );
};

export default Navbar;