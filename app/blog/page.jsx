// app/blog/page.jsx
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';

const BlogPage = async () => {
  const { translations } = useLanguage();
  
  // Fetch blogs from API
  let blogs = [];
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/blog`, {
      cache: 'no-store'
    });
    blogs = await response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {translations.blog || 'Blog'}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {translations.blogDescription || 'Discover the latest news, tips, and stories about traveling in Russia'}
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                {translations.noBlogs || 'No blog posts available yet. Check back later!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog._id} href={`/blog/${blog._id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                    {blog.images.length > 0 && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={blog.images[0]} 
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {blog.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{translations.by || 'By'} {blog.author}</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="mt-4">
                        <span className="text-blue-600 font-medium hover:text-blue-700 transition">
                          {translations.readMore || 'Read More'} →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;