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
import { usePathname } from 'next/navigation';

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

// Mobile Sidebar Component - Updated to handle login status
const MobileSidebar = ({ isOpen, onClose, setSocialModalOpen, setLocationModalOpen, isLoggedIn }) => {
    const sidebarRef = useRef();
    const { translations, toggleLanguage, currentLanguage } = useLanguage();
    const [showServices, setShowServices] = useState(false);
    const [showRussia, setShowRussia] = useState(false);

    const handleLinkClick = () => {
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
                            <Link href="/" className="text-gray-800 hover:text-blue-500 transition py-2" onClick={handleLinkClick}>
                                {translations.home}
                            </Link>

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
                                        <Link href="/plans" className="text-gray-600 hover:text-blue-500 py-1" onClick={handleLinkClick}>
                                            {translations.plans}
                                        </Link>
                                        <Link href="/transportation" className="text-gray-600 hover:text-blue-500 py-1" onClick={handleLinkClick}>
                                            {translations.transportation}
                                        </Link>
                                        <Link href="/hotels" className="text-gray-600 hover:text-blue-500 py-1" onClick={handleLinkClick}>
                                            {translations.hotels}
                                        </Link>
                                        <Link href="/residence" className="text-gray-600 hover:text-blue-500 py-1" onClick={handleLinkClick}>
                                            {translations.residence}
                                        </Link>
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
                                        <Link href="/restaurants" className="text-gray-600 hover:text-blue-500 py-1" onClick={handleLinkClick}>
                                            {translations.restaurants}
                                        </Link>
                                        <Link href="/attractions" className="text-gray-600 hover:text-blue-500 py-1" onClick={handleLinkClick}>
                                            {translations.touristAttractions}
                                        </Link>
                                        <Link href="/events" className="text-gray-600 hover:text-blue-500 py-1" onClick={handleLinkClick}>
                                            {translations.events}
                                        </Link>
                                        <Link href="/shopping" className="text-gray-600 hover:text-blue-500 py-1" onClick={handleLinkClick}>
                                            {translations.shopping}
                                        </Link>
                                        <Link href="/museums" className="text-gray-600 hover:text-blue-500 py-1" onClick={handleLinkClick}>
                                            {translations.museums}
                                        </Link>
                                        <Link href="/natural-places" className="text-gray-600 hover:text-blue-500 py-1" onClick={handleLinkClick}>
                                            {translations.naturalPlaces}
                                        </Link>
                                    </div>
                                )}
                            </div>


                                <Link href="/contact" className="text-gray-800 hover:text-blue-500 transition py-2" onClick={handleLinkClick}>
                                    {translations.contact}
                                </Link>


                        </nav>

                        <div className="mt-8 border-t pt-4">
                            <Link
                                href={isLoggedIn ? "/admin/dashboard" : "/admin/login"}
                                className="flex items-center space-x-2 text-gray-800 hover:text-blue-500 transition py-2 w-full"
                                onClick={handleLinkClick}
                            >
                                <FaUser size={20} />
                                <span>{isLoggedIn ? translations.dashboard : translations.adminLogin}</span>
                            </Link>
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

// Main Navbar Component with fixes for mobile view
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [socialModalOpen, setSocialModalOpen] = useState(false);
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [servicesHovered, setServicesHovered] = useState(false);
    const [russiaHovered, setRussiaHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Added login state
    const navbarRef = useRef();
    const { translations, toggleLanguage, currentLanguage } = useLanguage();

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

    // Check if user is logged in
    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

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
                            <Link href={isLoggedIn ? "/admin/dashboard" : "/admin/login"}>
                                <button className="text-white p-2 rounded-full hover:bg-blue-600 transition cursor-pointer">
                                    <FaUser size={20} />
                                </button>
                            </Link>
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
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={140}
                                height={140}
                                className="h-32 w-auto"
                            />
                        </div>

                        {/* Right Navigation */}
                        <div className="flex items-center space-x-6">
                            <nav className="flex items-center space-x-6">
                                <Link href="/" className="text-white hover:text-blue-200 transition">
                                    {translations.home}
                                </Link>

                                <div
                                    className="relative group"
                                    onMouseEnter={handleServicesMouseEnter}
                                    onMouseLeave={handleServicesMouseLeave}
                                >
                                    <button className="text-white hover:text-blue-200 transition flex items-center">
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
                                        <Link href="/plans" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.plans}
                                        </Link>
                                        <Link href="/transportation" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.transportation}
                                        </Link>
                                        <Link href="/hotels" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.hotels}
                                        </Link>
                                        <Link href="/residence" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.residence}
                                        </Link>
                                    </div>
                                </div>



                                <div
                                    className="relative group"
                                    onMouseEnter={handleRussiaMouseEnter}
                                    onMouseLeave={handleRussiaMouseLeave}
                                >
                                    <button className="text-white hover:text-blue-200 transition flex items-center">
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
                                        <Link href="/restaurants" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.restaurants}
                                        </Link>
                                        <Link href="/attractions" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.touristAttractions}
                                        </Link>
                                        <Link href="/events" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.events}
                                        </Link>
                                        <Link href="/shopping" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.shopping}
                                        </Link>
                                        <Link href="/museums" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.museums}
                                        </Link>
                                        <Link href="/natural-places" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                            {translations.naturalPlaces}
                                        </Link>
                                    </div>
                                </div>


                                <Link href="/contact" className="text-white hover:text-blue-200 transition">
                                    {translations.contact}
                                </Link>

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
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={100}
                                height={100}
                                className="h-10 w-auto"
                            />
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
                isLoggedIn={isLoggedIn} // Pass login status to mobile sidebar
            />
        </>
    );
};

export default Navbar;