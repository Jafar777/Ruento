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

    const handleUserIconClick = () => {
        router.push('/admin/dashboard');
    };

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

    const scrollToSection = (sectionId) => {
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 50);
    };

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
                        {/* Left Icons - Only User icon remains */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleUserIconClick}
                                className="text-white p-2 rounded-full hover:bg-blue-600 transition cursor-pointer"
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
                                <button onClick={() => handleNavigation('hero')} className="text-white hover:text-blue-200 transition ml-3 mr-3">
                                    {translations.home}
                                </button>

                                <button
                                    onClick={() => handleNavigation('services')}
                                    className="text-white hover:text-blue-200 ml-3 mr-3 transition"
                                >
                                    {translations.services}
                                </button>

                                <button
                                    onClick={() => handleNavigation('get-to-know-russia')}
                                    className="text-white hover:text-blue-200 ml-3 mr-3 transition"
                                >
                                    {translations.getToKnowRussia}
                                </button>

                                <button onClick={() => handleNavigation('contact')} className="text-white hover:text-blue-200 ml-3 mr-3 transition">
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

                    {/* Mobile Navigation */}
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