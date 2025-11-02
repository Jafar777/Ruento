'use client'

import React, { useState, useRef, useContext, useEffect } from 'react';
import { FaUser, FaShareNodes, FaLocationDot } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdLanguage } from "react-icons/md";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

// Social Modal Component (unchanged)
const SocialModal = ({ isOpen, onClose }) => {
    const modalRef = useRef();
    const { translations } = useLanguage();

    useGSAP(() => {
        if (isOpen) {
            gsap.fromTo(modalRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
            );
        } else {
            gsap.to(modalRef.current,
                { y: -100, opacity: 0, duration: 0.3, ease: "power2.in" }
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
            <div ref={modalRef} className="bg-white rounded-lg p-6 w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl font-bold"
                >
                    &times;
                </button>
                <h3 className="text-xl font-bold mb-4">{translations.shareOnSocial}</h3>
                {/* Add your social media links here */}
            </div>
        </div>
    );
};

// Location Modal Component (unchanged)
const LocationModal = ({ isOpen, onClose }) => {
    const modalRef = useRef();

    const { translations } = useLanguage();

    useGSAP(() => {
        if (isOpen) {
            gsap.fromTo(modalRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
            );
        } else {
            gsap.to(modalRef.current,
                { y: -100, opacity: 0, duration: 0.3, ease: "power2.in" }
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
            <div ref={modalRef} className="bg-white rounded-lg p-6 w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl font-bold"
                >
                    &times;
                </button>
                <h3 className="text-xl font-bold mb-4">{translations.companyLocation}</h3>
                <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {translations.viewOnMap}
                </a>
            </div>
        </div>
    );
};

// Mobile Sidebar Component - Updated to handle navigation
const MobileSidebar = ({ isOpen, onClose, setSocialModalOpen, setLocationModalOpen, handleNavigation, handleServiceNavigation, handleUserIconClick }) => {
    const sidebarRef = useRef();
    const { translations, toggleLanguage, currentLanguage } = useLanguage();
    const [showServices, setShowServices] = useState(false);
    const [showRussia, setShowRussia] = useState(false);

    const handleLinkClick = (sectionId = null) => {
        if (sectionId) {
            handleNavigation(sectionId);
        }
        onClose();
    };

    const handleServiceLinkClick = (serviceId) => {
        handleServiceNavigation(serviceId);
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

                            <div>
                                <button
                                    className="text-gray-800 hover:text-blue-500 transition w-full text-left py-2 flex justify-between items-center"
                                    onClick={() => setShowServices(!showServices)}
                                >
                                    <span>{translations.services}</span>
                                    <span>{showServices ? '−' : '+'}</span>
                                </button>
                                {showServices && (
                                    <div className="pl-4 mt-2 flex flex-col space-y-2 border-l border-gray-200">
                                        <button onClick={() => handleServiceLinkClick('plans')} className="text-gray-600 hover:text-blue-500 py-1 text-left">
                                            {translations.plans}
                                        </button>
                                        <button onClick={() => handleServiceLinkClick('transportation')} className="text-gray-600 hover:text-blue-500 py-1 text-left">
                                            {translations.transportation}
                                        </button>
                                        <button onClick={() => handleServiceLinkClick('hotels')} className="text-gray-600 hover:text-blue-500 py-1 text-left">
                                            {translations.hotels}
                                        </button>
                                        <button onClick={() => handleServiceLinkClick('residence')} className="text-gray-600 hover:text-blue-500 py-1 text-left">
                                            {translations.residence}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    className="text-gray-800 hover:text-blue-500 transition w-full text-left py-2 flex justify-between items-center"
                                    onClick={() => setShowRussia(!showRussia)}
                                >
                                    <span>{translations.getToKnowRussia}</span>
                                    <span>{showRussia ? '−' : '+'}</span>
                                </button>
                                {showRussia && (
                                    <div className="pl-4 mt-2 flex flex-col space-y-2 border-l border-gray-200">
                                        <button onClick={() => handleLinkClick('get-to-know-russia')} className="text-gray-600 hover:text-blue-500 py-1 text-left">
                                            {translations.restaurants}
                                        </button>
                                        <button onClick={() => handleLinkClick('get-to-know-russia')} className="text-gray-600 hover:text-blue-500 py-1 text-left">
                                            {translations.touristAttractions}
                                        </button>
                                        <button onClick={() => handleLinkClick('get-to-know-russia')} className="text-gray-600 hover:text-blue-500 py-1 text-left">
                                            {translations.events}
                                        </button>
                                        <button onClick={() => handleLinkClick('get-to-know-russia')} className="text-gray-600 hover:text-blue-500 py-1 text-left">
                                            {translations.shopping}
                                        </button>
                                        <button onClick={() => handleLinkClick('get-to-know-russia')} className="text-gray-600 hover:text-blue-500 py-1 text-left">
                                            {translations.museums}
                                        </button>
                                        <button onClick={() => handleLinkClick('get-to-know-russia')} className="text-gray-600 hover:text-blue-500 py-1 text-left">
                                            {translations.naturalPlaces}
                                        </button>
                                    </div>
                                )}
                            </div>

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
                            <button
                                onClick={() => { setSocialModalOpen(true); handleLinkClick(); }}
                                className="flex items-center space-x-2 text-gray-800 hover:text-blue-500 transition py-2 w-full"
                            >
                                <FaShareNodes size={20} />
                                <span>{translations.shareOnSocial}</span>
                            </button>
                            <button
                                onClick={() => { setLocationModalOpen(true); handleLinkClick(); }}
                                className="flex items-center space-x-2 text-gray-800 hover:text-blue-500 transition py-2 w-full"
                            >
                                <FaLocationDot size={20} />
                                <span>{translations.companyLocation}</span>
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

// Main Navbar Component with navigation handling
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [socialModalOpen, setSocialModalOpen] = useState(false);
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [servicesHovered, setServicesHovered] = useState(false);
    const [russiaHovered, setRussiaHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navbarRef = useRef();
    const { translations, toggleLanguage, currentLanguage } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();

    const isAdminLoginPage = pathname === '/admin/login';

    const servicesTimeoutRef = useRef(null);
    const russiaTimeoutRef = useRef(null);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    useEffect(() => {
        if (isMobile || isAdminLoginPage) {
            setIsScrolled(true);
            return;
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile, isAdminLoginPage]);

    useGSAP(() => {
        gsap.fromTo(navbarRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
        );
    }, []);

    const handleServicesMouseEnter = () => {
        if (servicesTimeoutRef.current) {
            clearTimeout(servicesTimeoutRef.current);
        }
        setServicesHovered(true);
    };

    const handleServicesMouseLeave = () => {
        servicesTimeoutRef.current = setTimeout(() => {
            setServicesHovered(false);
        }, 200);
    };

    const handleRussiaMouseEnter = () => {
        if (russiaTimeoutRef.current) {
            clearTimeout(russiaTimeoutRef.current);
        }
        setRussiaHovered(true);
    };

    const handleRussiaMouseLeave = () => {
        russiaTimeoutRef.current = setTimeout(() => {
            setRussiaHovered(false);
        }, 200);
    };

    // SIMPLE: Just check localStorage directly on click
    const handleUserIconClick = () => {

            router.push('/admin/dashboard');

    };

    // Handle navigation to home page and scrolling to sections
    const handleNavigation = (sectionId) => {
        if (pathname !== '/') {
            router.push('/');
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 100);
        } else {
            scrollToSection(sectionId);
        }
    };

    // Handle service sub-navigation (scroll to specific service within Services section)
    const handleServiceNavigation = (serviceId) => {
        if (pathname !== '/') {
            router.push('/');
            setTimeout(() => {
                scrollToService(serviceId);
            }, 100);
        } else {
            scrollToService(serviceId);
        }
    };

    // Scroll to specific section on home page
    const scrollToSection = (sectionId) => {
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 50);
    };

    // Scroll to specific service within Services section
    const scrollToService = (serviceId) => {
        setTimeout(() => {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    const serviceElement = document.getElementById(`service-${serviceId}`);
                    if (serviceElement) {
                        serviceElement.classList.add('ring-2', 'ring-blue-500', 'scale-105');
                        setTimeout(() => {
                            serviceElement.classList.remove('ring-2', 'ring-blue-500', 'scale-105');
                        }, 2000);
                    }
                }, 500);
            }
        }, 50);
    };

    useEffect(() => {
        return () => {
            if (servicesTimeoutRef.current) {
                clearTimeout(servicesTimeoutRef.current);
            }
            if (russiaTimeoutRef.current) {
                clearTimeout(russiaTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <header
                ref={navbarRef}
                className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 h-16 ${isAdminLoginPage ? 'bg-blue-600 shadow-md' :
                    (isScrolled ? 'bg-blue-600 shadow-md' : 'bg-transparent')
                    }`}
            >
                <div className="container mx-auto px-4 h-full">
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center justify-between h-full almarai-regular">
                        {/* Left Icons */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleUserIconClick}
                                className="text-white p-2 rounded-full hover:bg-blue-600 transition cursor-pointer"
                                suppressHydrationWarning
                            >
                                <FaUser size={20} />
                            </button>
                            <button
                                onClick={() => setSocialModalOpen(true)}
                                className="text-white p-2 rounded-full hover:bg-blue-600 transition cursor-pointer"
                            >
                                <FaShareNodes size={20} />
                            </button>
                            <button
                                onClick={() => setLocationModalOpen(true)}
                                className="text-white p-2 rounded-full hover:bg-blue-600 transition cursor-pointer"
                            >
                                <FaLocationDot size={20} />
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
                                <button onClick={() => handleNavigation('hero')} className="text-white hover:text-blue-200 transition">
                                    {translations.home}
                                </button>

                                <div
                                    className="relative group"
                                    onMouseEnter={handleServicesMouseEnter}
                                    onMouseLeave={handleServicesMouseLeave}
                                >
                                    <button
                                        onClick={() => handleNavigation('services')}
                                        className="text-white hover:text-blue-200 transition flex items-center"
                                    >
                                        {translations.services}
                                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    <div
                                        className={`absolute top-full left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-2 z-40 transition-opacity duration-300 ${servicesHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                                        onMouseEnter={handleServicesMouseEnter}
                                        onMouseLeave={handleServicesMouseLeave}
                                    >
                                        <button onClick={() => handleServiceNavigation('plans')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.plans}
                                        </button>
                                        <button onClick={() => handleServiceNavigation('transportation')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.transportation}
                                        </button>
                                        <button onClick={() => handleServiceNavigation('hotels')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.hotels}
                                        </button>
                                        <button onClick={() => handleServiceNavigation('residence')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.residence}
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className="relative group"
                                    onMouseEnter={handleRussiaMouseEnter}
                                    onMouseLeave={handleRussiaMouseLeave}
                                >
                                    <button
                                        onClick={() => handleNavigation('get-to-know-russia')}
                                        className="text-white hover:text-blue-200 transition flex items-center"
                                    >
                                        {translations.getToKnowRussia}
                                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    <div
                                        className={`absolute top-full left-0 mt-0 w-56 bg-white rounded-md shadow-lg py-2 z-40 transition-opacity duration-300 ${russiaHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                                        onMouseEnter={handleRussiaMouseEnter}
                                        onMouseLeave={handleRussiaMouseLeave}
                                    >
                                        <button onClick={() => handleNavigation('get-to-know-russia')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.restaurants}
                                        </button>
                                        <button onClick={() => handleNavigation('get-to-know-russia')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.touristAttractions}
                                        </button>
                                        <button onClick={() => handleNavigation('get-to-know-russia')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.events}
                                        </button>
                                        <button onClick={() => handleNavigation('get-to-know-russia')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.shopping}
                                        </button>
                                        <button onClick={() => handleNavigation('get-to-know-russia')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.museums}
                                        </button>
                                        <button onClick={() => handleNavigation('get-to-know-russia')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.naturalPlaces}
                                        </button>
                                    </div>
                                </div>

                                <button onClick={() => handleNavigation('contact')} className="text-white hover:text-blue-200 transition">
                                    {translations.contact}
                                </button>
                            </nav>

                            <button
                                onClick={toggleLanguage}
                                className="text-white p-2 rounded-full hover:bg-blue-600 transition cursor-pointer"
                            >
                                <MdLanguage size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation - Fixed with proper alignment */}
                    <div className="flex lg:hidden items-center justify-between h-full">
                        <div className="flex items-center h-full">
                            <button
                                onClick={() => setMobileSidebarOpen(true)}
                                className="text-white p-2 rounded-full hover:bg-blue-600 transition"
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
                                className="text-white p-2 rounded-full hover:bg-blue-600 transition"
                            >
                                <MdLanguage size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Modals */}
            <SocialModal
                isOpen={socialModalOpen}
                onClose={() => setSocialModalOpen(false)}
            />
            <LocationModal
                isOpen={locationModalOpen}
                onClose={() => setLocationModalOpen(false)}
            />

            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
                setSocialModalOpen={setSocialModalOpen}
                setLocationModalOpen={setLocationModalOpen}
                handleNavigation={handleNavigation}
                handleServiceNavigation={handleServiceNavigation}
                handleUserIconClick={handleUserIconClick}
            />
        </>
    );
};

export default Navbar;