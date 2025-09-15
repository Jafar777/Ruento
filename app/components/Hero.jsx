'use client'

import { useEffect, useState, useRef } from 'react';

const Hero = () => {
  const [heroData, setHeroData] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchHeroData();
  }, []);

  useEffect(() => {
    // Try to play video when component mounts
    if (videoRef.current && heroData?.videoUrl) {
      const playVideo = async () => {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error('Video play failed:', error);
          setVideoError(true);
        }
      };
      
      playVideo();
    }
  }, [heroData]);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/hero');
      if (!response.ok) throw new Error('Failed to fetch hero data');
      const data = await response.json();
      setHeroData(data);
    } catch (error) {
      console.error('Error fetching hero data:', error);
    }
  };

  if (!heroData) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {heroData.videoUrl && !videoError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="flex inset-0 w-full h-full object-cover"
          onError={() => setVideoError(true)}
          onCanPlay={() => setVideoError(false)}
        >
          <source src={heroData.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900"></div>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-50"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          {heroData.title || 'Discover Russia'}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in-delay">
          {heroData.subtitle || 'Experience the beauty and culture of Russia like never before'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
            {heroData.ctaText || 'Explore Tours'}
          </button>
          <button className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>

      {/* Video error message */}
      {videoError && (
        <div className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded text-sm z-20">
          Video playback issue. Using fallback background.
        </div>
      )}

      {/* Scrolling indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delay {
          0% { opacity: 0; transform: translateY(20px); }
          50% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delay-2 {
          0% { opacity: 0; transform: translateY(20px); }
          66% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fade-in-delay 2s ease-out forwards;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in-delay-2 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Hero;