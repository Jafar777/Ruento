// app/blog/[id]/page.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaUser } from 'react-icons/fa';

const BlogPost = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { translations } = useLanguage();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog?id=${id}`);
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const nextImage = () => {
    if (!blog?.images?.length) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === blog.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!blog?.images?.length) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? blog.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {translations.blogNotFound || 'Blog post not found'}
          </h1>
          <a href="/blog" className="text-blue-600 hover:text-blue-700">
            {translations.backToBlog || '← Back to Blog'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <a href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
            <FaChevronLeft className="mr-2" />
            {translations.backToBlog || 'Back to Blog'}
          </a>

          <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Image Slider */}
            {blog.images.length > 0 && (
              <div className="relative h-96 overflow-hidden">
                <img 
                  src={blog.images[currentImageIndex]} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                
                {blog.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full text-white hover:bg-opacity-70 transition"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full text-white hover:bg-opacity-70 transition"
                    >
                      <FaChevronRight />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {blog.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center text-gray-600 mb-6">
                <div className="flex items-center mr-6 mb-2">
                  <FaUser className="mr-2" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="mr-2" />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="prose max-w-none text-gray-700">
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;